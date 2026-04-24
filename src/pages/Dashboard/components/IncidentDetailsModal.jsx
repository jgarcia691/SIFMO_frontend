import React from 'react';

const IncidentDetailsModal = ({ incident, isOpen, onClose }) => {
  if (!isOpen || !incident) return null;

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
            <span className={`px-3 py-1 rounded-full text-xs font-label font-bold uppercase tracking-wider ${statusColors[incident.status] || 'bg-stone-100 text-stone-800'}`}>
              {incident.status}
            </span>
            <span className="text-sm font-label text-stone-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {incident.date}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-label font-bold text-stone-500 uppercase tracking-wider mb-2">Título</h3>
            <p className="text-lg font-body text-on-surface">{incident.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-label font-bold text-stone-500 uppercase tracking-wider mb-2">Descripción Completa</h3>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 text-on-surface-variant font-body leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </div>
          </div>
          
          {/* Mock additional details that could come from the database */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
               <h3 className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider mb-1">Área / Departamento</h3>
               <p className="font-body text-on-surface">{incident.area || 'No especificada'}</p>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
               <h3 className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider mb-1">Solicitante</h3>
               <p className="font-body text-on-surface">{incident.requester || 'Usuario Desconocido'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-label font-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Cerrar
          </button>
          <button 
            className="px-6 py-2.5 rounded-full font-label font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm"
          >
            Actualizar Estado
          </button>
        </div>

      </div>
    </div>
  );
};

export default IncidentDetailsModal;
