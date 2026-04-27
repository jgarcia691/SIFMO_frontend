import React from 'react';

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-lowest">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface">Detalles del Usuario</h2>
            <p className="text-sm font-label text-stone-500 mt-1">Ficha #{user.ficha}</p>
          </div>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors"
          >
            close
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 mb-2">
             <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl">person</span>
             </div>
             <div>
                <h3 className="text-xl font-headline font-bold text-on-surface uppercase">{user.nombre}</h3>
                <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-[10px] font-label font-black uppercase tracking-tighter mt-1 inline-block">
                  {user.rol}
                </span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
               <h3 className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">mail</span> Correo
               </h3>
               <p className="font-body text-sm text-on-surface truncate" title={user.correo}>{user.correo || 'No registrado'}</p>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
               <h3 className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">call</span> Teléfono
               </h3>
               <p className="font-body text-sm text-on-surface">{user.numero || 'No registrado'}</p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 sm:col-span-2">
               <h3 className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">domain</span> Departamento
               </h3>
               <p className="font-body text-sm text-on-surface uppercase">{user.area || 'No especificado'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest flex items-center justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-label font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
