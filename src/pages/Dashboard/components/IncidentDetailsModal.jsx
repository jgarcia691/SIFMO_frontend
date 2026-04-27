import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const IncidentDetailsModal = ({ incident, isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [newEncargado, setNewEncargado] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current user to check role
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = currentUser?.rol === 'Administrador' || currentUser?.rol === 'Técnico';

  useEffect(() => {
    if (isOpen && incident) {
      setNewStatus(incident.status || '');
      setNewEncargado(incident.encargado || '');
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
        // Cierra el modal y opcionalmente dispara un evento para recargar
        window.dispatchEvent(new Event('incident-created')); // reusing the event to refresh list
        onClose();
      } else {
        console.error("Error al actualizar");
      }
    } catch (error) {
      console.error("Error updating incident:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = ['Pendiente', 'En revisión', 'En espera', 'Listo', 'Critico'];

  const statusColors = {
    'En revisión': 'bg-amber-100 text-amber-800',
    'Listo': 'bg-green-100 text-green-800',
    'En espera': 'bg-stone-100 text-stone-600',
    'Critico': 'bg-red-100 text-red-800'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
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
                  
                  {/* Credenciales si aplican */}
                  {(incident.workstation_usuario || incident.password) && (
                     <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
                       <p className="text-red-800 text-xs font-bold uppercase mb-1">Credenciales</p>
                       <p><strong>Usuario:</strong> {incident.workstation_usuario || 'N/A'}</p>
                       <p><strong>Contraseña:</strong> {incident.password || 'N/A'}</p>
                     </div>
                  )}

                  {/* Componentes a revisar/reparar */}
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase text-stone-500 mb-2">Componentes / Opciones Requeridas:</p>
                    <div className="flex flex-wrap gap-2">
                      {incident.respaldo ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">Respaldo</span> : null}
                      {incident.ram ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">RAM ({incident.cant_ram || 'N/A'})</span> : null}
                      {incident.cpu ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">CPU</span> : null}
                      {incident.so ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">SO: {incident.so}</span> : null}
                      {incident.disco ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">Disco</span> : null}
                      {incident.tarj_video ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">Tarj. Video</span> : null}
                      {incident.pila ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">Pila</span> : null}
                      {incident.fuente ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">Fuente</span> : null}
                      {incident.motherboard ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">Motherboard</span> : null}
                      {incident.tarj_red ? <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded text-xs">Tarj. Red</span> : null}
                    </div>
                  </div>
                </div>
              )}
              {incident.tipo === 'reparacion de periferico' && (
                <>
                  <p><strong>Falla Reportada:</strong> {incident.periferico_falla || 'N/A'}</p>
                  <p><strong>Tipo de Solicitud:</strong> {incident.periferico_tipo_solicitud || 'N/A'}</p>
                </>
              )}
              {incident.tipo === 'solicitud' && (
                <>
                  <p><strong>Descripción:</strong> {incident.solicitud_descripcion || 'N/A'}</p>
                </>
              )}
              {/* Fallback if none match exactly */}
              {!['reparacion de estacion de trabajo', 'reparacion de periferico', 'solicitud'].includes(incident.tipo) && (
                <p>Sin detalles adicionales.</p>
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

          {/* Admin Tools: Encargado */}
          {isAdmin && (
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-primary/20 bg-primary/5">
              <h3 className="text-sm font-label font-bold text-primary uppercase tracking-wider mb-2">Asignar Encargado (Técnico/Admin)</h3>
              <select 
                className="w-full px-4 py-2 rounded-lg bg-surface border border-outline-variant/20 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={newEncargado}
                onChange={(e) => setNewEncargado(e.target.value)}
              >
                <option value="">-- Sin asignar --</option>
                {users
                  .filter(u => u.rol === 'Administrador' || u.rol === 'Técnico')
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
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-label font-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Cerrar
          </button>
          {isAdmin && (
            <button 
              onClick={handleUpdate}
              disabled={isUpdating}
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
  );
};

export default IncidentDetailsModal;
