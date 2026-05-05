import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const IncidentDetailsModal = ({ incident, isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [newEncargado, setNewEncargado] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const [isClientContactExpanded, setIsClientContactExpanded] = useState(false);
  
  const getEmailLink = (email) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return `mailto:${email}`;
    }
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
  };
  const [observacion, setObservacion] = useState('');

  // Get current user to check role
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = currentUser?.rol?.toLowerCase() === 'administrador';
  const isAnalyst = currentUser?.rol?.toLowerCase() === 'analista';
  const canEditStatus = isAdmin || isAnalyst;

  useEffect(() => {
    if (isOpen && incident) {
      setNewStatus(incident.status || '');
      setNewEncargado(incident.encargado || '');
      setObservacion(incident.observacion || '');
      setIsContactExpanded(false); 
      setIsClientContactExpanded(false);
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
          encargado: newEncargado || null,
          observacion: observacion
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
    <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-16 md:pt-4">
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-0 md:gap-4 max-w-[95vw] w-full md:w-auto pb-32 md:pb-0">
        
        {/* Main Modal Panel */}
        <div className="bg-surface w-full md:w-[600px] rounded-2xl shadow-xl overflow-hidden flex flex-col shrink-0 max-h-[85vh] md:max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-lowest">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface-variant">Detalles de la Solicitud</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-label font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded uppercase tracking-tighter">ID #{incident.id}</span>
                <span className="text-xs font-label text-stone-400 flex items-center gap-1 uppercase tracking-tighter">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  {incident.date}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors text-2xl"
            >
              close
            </button>
          </div>

          {/* Debug info (hidden) */}
          {/* <pre className="hidden">{JSON.stringify(incident, null, 2)}</pre> */}
          
          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-label font-bold text-stone-400 dark:text-on-surface-variant uppercase tracking-widest mb-1">Tipo de Incidente</h3>
                <p className="text-lg font-body font-bold text-on-surface-variant uppercase">{incident.tipo}</p>
              </div>
              <div>
                <h3 className="text-xs font-label font-bold text-stone-400 dark:text-on-surface-variant uppercase tracking-widest mb-1">Estado Actual</h3>
                {canEditStatus ? (
                <div className="relative">
                  <select 
                    className="pl-3 pr-10 py-1.5 rounded-lg text-sm font-label font-bold uppercase tracking-wider bg-surface-container-high text-on-surface border border-outline-variant/20 outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none w-full"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">expand_more</span>
                </div>
                ) : (
                  <span className={`px-4 py-1.5 rounded-full text-xs font-label font-bold uppercase tracking-wider ${statusColors[incident.status] || 'bg-stone-100 text-stone-800'}`}>
                    {incident.status}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-label font-bold text-stone-400 dark:text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">description</span>
                Detalles Técnicos / Descripción
              </h3>
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 text-on-surface-variant font-body text-base leading-relaxed whitespace-pre-wrap">
                {(incident.cpu_fmo !== undefined && incident.cpu_fmo !== null) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <p><strong>FMO CPU:</strong> {incident.cpu_fmo || 'N/A'}</p>
                      <p><strong>S.O:</strong> {incident.so || 'N/A'}</p>
                    </div>
                    <p><strong>Falla Reportada:</strong> {incident.workstation_tipo_falla || 'N/A'}</p>
                    
                    <div className="border-t border-outline-variant/10 pt-4 mt-2">
                      <h4 className="text-xs font-label font-bold text-stone-400 uppercase tracking-widest mb-4">Componentes Técnicos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.ram ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.ram ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">RAM ({incident.cant_ram || 0}GB)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.cpu ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.cpu ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">CPU</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.disco ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.disco ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">Disco Duro</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.tarj_video ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.tarj_video ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">T. Video</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.motherboard ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.motherboard ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">M. Board</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.fuente ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.fuente ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">Fuente</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.pila ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.pila ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">Pila</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.tarj_red ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.tarj_red ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">T. Red</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base ${incident.respaldo ? 'text-green-600' : 'text-stone-300'}`}>
                            {incident.respaldo ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-sm font-body">Respaldo</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 pt-4 border-t border-outline-variant/10 text-base"><strong>Observación Técnica:</strong> {incident.workstation_observacion || 'Ninguna'}</p>
                    {(incident.workstation_usuario || incident.password) && (
                       <div className="p-5 bg-red-50/40 rounded-xl border border-red-100 mt-2">
                         <p className="text-red-800 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                           <span className="material-symbols-outlined text-sm">key</span>
                           Credenciales de Acceso
                         </p>
                         <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                            <p className="flex flex-col gap-0.5">
                              <span className="text-stone-400 dark:text-on-surface-variant uppercase text-[10px]">Usuario</span>
                              <span className="text-stone-800 dark:text-on-surface-variant font-bold">{incident.workstation_usuario || 'N/A'}</span>
                            </p>
                            <p className="flex flex-col gap-0.5">
                              <span className="text-stone-400 dark:text-on-surface-variant uppercase text-[10px]">Contraseña</span>
                              <span className="text-stone-800 dark:text-on-surface-variant font-bold">{incident.password || 'N/A'}</span>
                            </p>
                         </div>
                       </div>
                    )}
                  </div>
                )}
                {/* Seccion de Periferico - Se muestra si hay datos de periferico */}
                {(incident.periferico_fmo !== undefined && incident.periferico_fmo !== null) && (
                  <div className="space-y-4 text-base">
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary text-white p-2 rounded-lg">
                          <span className="material-symbols-outlined text-xl">devices</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest">Información del Periférico</p>
                          <h4 className="font-headline font-bold text-on-surface-variant uppercase">{incident.periferico_nombre || 'Equipo no identificado'}</h4>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                        <div>
                          <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] font-bold mb-0.5">FMO #</p>
                          <p className="font-bold text-primary">#{incident.periferico_fmo || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] font-bold mb-0.5">Tipo</p>
                          <p className="font-bold text-on-surface-variant uppercase">{incident.periferico_tipo || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] font-bold mb-0.5">Marca</p>
                          <p className="font-bold text-on-surface-variant uppercase">{incident.periferico_marca || 'Genérica'}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] font-bold mb-0.5">Serial</p>
                          <p className="font-bold text-stone-600 dark:text-on-surface-variant">{incident.periferico_serial || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-500/5 dark:bg-red-500/10 rounded-xl border border-red-500/10">
                      <p className="text-[10px] font-label font-bold text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">report_problem</span>
                        Falla Reportada
                      </p>
                      <p className="text-on-surface-variant leading-relaxed">{incident.periferico_falla || 'Sin descripción de falla'}</p>
                    </div>
                  </div>
                )}
                {/* Seccion de Solicitud - Se muestra si hay datos de solicitud */}
                {(incident.solicitud_tipo || incident.solicitud_descripcion) && (
                  <div className="space-y-4 text-base">
                    <div>
                      <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mb-1">Categoría de Solicitud</p>
                      <p className="font-bold text-on-surface-variant uppercase">{incident.solicitud_tipo || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mb-1">Descripción</p>
                      <p className="text-on-surface-variant">{incident.solicitud_descripcion || 'Sin descripción detallada'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Observations Section (Editable for Admin/Analyst) */}
            <div>
              <h3 className="text-xs font-label font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">edit_note</span>
                Comentarios / Observaciones del Analista
              </h3>
              {canEditStatus ? (
                <textarea
                  className="w-full p-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest text-on-surface-variant font-body text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[140px]"
                  placeholder="Añade un comentario sobre el progreso o resolución..."
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                />
              ) : (
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 text-on-surface-variant font-body text-base italic">
                  {incident.observacion || 'Sin comentarios adicionales.'}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                 <h3 className="text-xs font-label font-bold text-stone-400 uppercase tracking-widest mb-1">Área / Departamento</h3>
                 <p className="text-base font-body font-bold text-on-surface-variant">{incident.area || 'No especificada'}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                 <h3 className="text-xs font-label font-bold text-stone-400 uppercase tracking-widest mb-1">Solicitante</h3>
                 <p className="text-base font-body font-bold text-on-surface-variant">{incident.solicitante || 'Usuario Desconocido'}</p>
                 {canEditStatus && (
                    <button 
                      onClick={() => setIsClientContactExpanded(!isClientContactExpanded)}
                      className="mt-2 text-xs font-label font-bold text-primary uppercase flex items-center gap-1 hover:bg-primary/5 px-3 py-1.5 rounded w-fit transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">contact_page</span>
                      {isClientContactExpanded ? 'Ocultar Contacto' : 'Ver Contacto Cliente'}
                    </button>
                  )}
              </div>
            </div>

            {/* Analyst Contact Toggle */}
            {incident.encargado && (
              <div className="flex justify-center mt-6">
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
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-surface border border-outline-variant/20 text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none"
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
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">expand_more</span>
                </div>
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
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-label font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs md:text-base"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-label font-bold text-on-surface hover:bg-surface-container transition-colors text-xs md:text-base"
              >
                Cerrar
              </button>
              {canEditStatus && (
                <button 
                  onClick={handleUpdate}
                  disabled={isUpdating || isDeleting}
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-label font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs md:text-base"
                >
                  {isUpdating ? (
                    <>
                      <span className="animate-spin material-symbols-outlined text-[16px] md:text-[18px]">progress_activity</span>
                      <span className="hidden md:inline">Actualizando...</span>
                      <span className="md:hidden">Espere...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden md:inline">Actualizar Tarea</span>
                      <span className="md:hidden">Actualizar</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel (Analyst Contact Information) */}
        {incident.encargado && (
          <div className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${isContactExpanded ? 'w-full md:w-80 max-h-[500px] md:max-h-[90vh] opacity-100 mt-4 md:mt-0 md:ml-4' : 'max-h-0 md:max-h-full w-full md:w-0 opacity-0'}`}>
            <div className="bg-surface w-full md:w-80 rounded-2xl shadow-xl h-full border border-primary/20 flex flex-col overflow-hidden">
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

                {incident.encargado_extension !== null && (
                  <div className="flex flex-col gap-2">
                    <div className="p-4 bg-stone-50 dark:bg-stone-900/30 rounded-xl border border-stone-200/50">
                      <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">phone_callback</span>
                        Extensión del Área
                      </p>
                      <p className="text-base font-body font-bold text-stone-700 dark:text-on-surface-variant">{incident.encargado_extension}</p>
                    </div>
                  </div>
                )}

                {incident.encargado_correo && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="material-symbols-outlined text-sm">mail</span>
                      <span className="text-sm font-body truncate" title={incident.encargado_correo}>{incident.encargado_correo}</span>
                    </div>
                    <a 
                      href={getEmailLink(incident.encargado_correo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-bold uppercase transition-colors w-full"
                    >
                      <span className="material-symbols-outlined">send</span>
                      Enviar Correo
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Side Panel (Client Contact Information for Analysts) */}
        {canEditStatus && (
          <div className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${isClientContactExpanded ? 'w-full md:w-80 max-h-[500px] md:max-h-[90vh] opacity-100 mt-4 md:mt-0 md:ml-4' : 'max-h-0 md:max-h-full w-full md:w-0 opacity-0'}`}>
            <div className="bg-surface w-full md:w-80 rounded-2xl shadow-xl h-full border border-primary/20 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20 bg-surface-container-lowest flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h3 className="text-sm font-label font-bold text-stone-600 uppercase tracking-wider">Contacto del Cliente</h3>
                  <p className="text-xs text-stone-500 font-body">{incident.solicitante}</p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">

                {incident.solicitante_extension !== null && (
                  <div className="flex flex-col gap-2">
                    <div className="p-4 bg-stone-50 dark:bg-stone-900/30 rounded-xl border border-stone-200/50">
                      <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">phone_callback</span>
                        Extensión del Área
                      </p>
                      <p className="text-base font-body font-bold text-stone-700 dark:text-on-surface-variant">{incident.solicitante_extension}</p>
                    </div>
                  </div>
                )}

                {incident.solicitante_correo && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="material-symbols-outlined text-sm">mail</span>
                      <span className="text-sm font-body truncate" title={incident.solicitante_correo}>{incident.solicitante_correo}</span>
                    </div>
                    <a 
                      href={getEmailLink(incident.solicitante_correo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-bold uppercase transition-colors w-full"
                    >
                      <span className="material-symbols-outlined">send</span>
                      Enviar Correo
                    </a>
                  </div>
                )}

                {!incident.solicitante_numero && !incident.solicitante_correo && (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-stone-300 text-4xl mb-2">person_off</span>
                    <p className="text-xs text-stone-500 italic">No hay vías de contacto registradas para este cliente.</p>
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
