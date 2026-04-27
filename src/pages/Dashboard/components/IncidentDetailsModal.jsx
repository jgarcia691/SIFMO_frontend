import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const IncidentDetailsModal = ({ incident, isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [newEncargado, setNewEncargado] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  // Get current user to check role
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = currentUser?.rol === 'Administrador' || currentUser?.rol === 'Analista';

  useEffect(() => {
    if (isOpen && incident) {
      setNewStatus(incident.status || '');
      setNewEncargado(incident.encargado || '');
      setIsContactExpanded(false); // Reset expanded state on open
    }
  }, [isOpen, incident]);

  useEffect(() => {
    if (isAdmin && isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${API_URL}/users`);
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [isAdmin, isOpen]);

  if (!isOpen || !incident) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_URL}/incidentes/actualizar/${incident.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          encargado: newEncargado || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        window.dispatchEvent(new Event('incident-created'));
        if (data.emailSent) {
          alert('Estado actualizado y correo de notificación enviado al usuario.');
        } else if (newStatus !== incident.status) {
          alert('Estado actualizado. (No se envió correo)');
        }
        onClose();
      }
    } catch (error) {
      console.error("Error updating incident:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta solicitud?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/incidentes/eliminar/${incident.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        window.dispatchEvent(new Event('incident-created'));
        onClose();
      }
    } catch (error) {
      console.error("Error deleting incident:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusOptions = ['En espera', 'En revisión', 'Listo', 'Entregado'];

  const statusColors = {
    'En revisión': 'bg-amber-100 text-amber-800',
    'Listo': 'bg-green-100 text-green-800',
    'Entregado': 'bg-stone-200 text-stone-700',
    'En espera': 'bg-stone-100 text-stone-600',
    'Critico': 'bg-red-100 text-red-800'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="flex flex-row items-stretch gap-4 max-h-[90vh] max-w-[95vw]">
        
        {/* Main Modal Panel */}
        <div className="bg-surface w-[600px] max-w-full rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-lowest">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface">Detalles de la Solicitud</h2>
              <p className="text-sm font-label text-stone-500 mt-1">Solicitud #{incident.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors"
            >
              close
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              {isAdmin ? (
                <select 
                  className="px-3 py-1.5 rounded-full text-xs font-label font-bold uppercase tracking-wider bg-surface-container-high text-on-surface border-none outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-label font-bold uppercase tracking-wider ${statusColors[incident.status] || 'bg-stone-100 text-stone-800'}`}>
                  {incident.status}
                </span>
              )}
              <span className="text-sm font-label text-stone-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {incident.date}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-label font-bold text-stone-500 uppercase tracking-wider mb-2">Tipo de Incidente</h3>
              <p className="text-lg font-body text-on-surface uppercase">{incident.tipo}</p>
            </div>

            <div>
              <h3 className="text-sm font-label font-bold text-stone-500 uppercase tracking-wider mb-2">Descripción Completa</h3>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 text-on-surface-variant font-body leading-relaxed whitespace-pre-wrap">
                {incident.tipo === 'reparacion de estacion de trabajo' && (
                  <div className="space-y-3">
                    <p><strong>FMO CPU:</strong> {incident.cpu_fmo || 'N/A'}</p>
                    <p><strong>Falla Reportada:</strong> {incident.workstation_tipo_falla || 'N/A'}</p>
                    <p><strong>Observación:</strong> {incident.workstation_observacion || 'Ninguna'}</p>
                    {(incident.workstation_usuario || incident.password) && (
                       <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
                         <p className="text-red-800 text-xs font-bold uppercase mb-1">Credenciales</p>
                         <p><strong>Usuario:</strong> {incident.workstation_usuario || 'N/A'}</p>
                         <p><strong>Contraseña:</strong> {incident.password || 'N/A'}</p>
                       </div>
                    )}
                  </div>
                )}
                {incident.tipo === 'reparacion de periferico' && (
                  <div className="space-y-3">
                    <p><strong>Falla Reportada:</strong> {incident.periferico_falla || 'N/A'}</p>
                    <p><strong>Tipo de Solicitud:</strong> {incident.periferico_tipo_solicitud || 'N/A'}</p>
                  </div>
                )}
                {incident.tipo === 'solicitud' && (
                  <div className="space-y-3">
                    <p><strong>Descripción:</strong> {incident.solicitud_descripcion || 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
                 <h3 className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider mb-1">Área / Departamento</h3>
                 <p className="font-body text-on-surface">{incident.area || 'No especificada'}</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
                 <h3 className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider mb-1">Solicitante</h3>
                 <p className="font-body text-on-surface">{incident.solicitante || 'Usuario Desconocido'}</p>
              </div>
            </div>

            {/* Analyst Contact Toggle */}
            {incident.encargado && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsContactExpanded(!isContactExpanded)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full font-label font-bold uppercase transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  {isContactExpanded ? 'Ocultar Contacto' : 'Ver Vías de Comunicación'}
                  <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isContactExpanded ? 'rotate-180' : ''}`}>
                    arrow_forward
                  </span>
                </button>
              </div>
            )}

            {/* Admin Tools: Encargado */}
            {isAdmin && (
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-primary/20 bg-primary/5 mt-4">
                <h3 className="text-sm font-label font-bold text-primary uppercase tracking-wider mb-2">Asignar Encargado (Analista/Admin)</h3>
                <select 
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-outline-variant/20 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={newEncargado}
                  onChange={(e) => setNewEncargado(e.target.value)}
                >
                  <option value="">-- Sin asignar --</option>
                  {users
                    .filter(u => u.rol === 'Administrador' || u.rol === 'Analista')
                    .map(u => (
                    <option key={u.ficha} value={u.ficha}>
                      {u.nombre} ({u.rol})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between">
            <div>
              {isAdmin && (
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting || isUpdating}
                  className="px-6 py-2.5 rounded-full font-label font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar Solicitud'}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-full font-label font-bold text-on-surface hover:bg-surface-container transition-colors"
              >
                Cerrar
              </button>
              {isAdmin && (
                <button 
                  onClick={handleUpdate}
                  disabled={isUpdating || isDeleting}
                  className="px-6 py-2.5 rounded-full font-label font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                      Actualizando...
                    </>
                  ) : 'Actualizar Estado'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel (Analyst Contact Information) */}
        {incident.encargado && (
          <div className={`transition-all duration-300 ease-in-out h-full overflow-hidden ${isContactExpanded ? 'w-80 opacity-100 ml-4' : 'w-0 opacity-0 ml-0'}`}>
            <div className="bg-surface w-80 rounded-2xl shadow-xl h-full border border-primary/20 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20 bg-surface-container-lowest flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <h3 className="text-sm font-label font-bold text-primary uppercase tracking-wider">Analista Asignado</h3>
                  <p className="text-xs text-stone-500 font-body">{incident.encargado_nombre || 'Analista'}</p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                {incident.encargado_numero && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span className="text-sm font-body">{incident.encargado_numero}</span>
                    </div>
                    <a 
                      href={`https://wa.me/${incident.encargado_numero.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-sm font-bold uppercase transition-colors w-full"
                    >
                      <span className="material-symbols-outlined">chat</span>
                      WhatsApp
                    </a>
                  </div>
                )}

                {incident.encargado_correo && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="material-symbols-outlined text-sm">mail</span>
                      <span className="text-sm font-body truncate" title={incident.encargado_correo}>{incident.encargado_correo}</span>
                    </div>
                    <a 
                      href={`mailto:${incident.encargado_correo}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-bold uppercase transition-colors w-full"
                    >
                      <span className="material-symbols-outlined">send</span>
                      Enviar Correo
                    </a>
                  </div>
                )}

                {!incident.encargado_numero && !incident.encargado_correo && (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-stone-300 text-4xl mb-2">person_off</span>
                    <p className="text-xs text-stone-500 italic">No hay vías registradas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default IncidentDetailsModal;
