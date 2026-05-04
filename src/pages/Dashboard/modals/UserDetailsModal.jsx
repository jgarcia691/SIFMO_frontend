import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    id_area: '',
    numero: '',
    correo: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        id_area: user.id_area || '',
        numero: user.numero || '',
        correo: user.correo || ''
      });
    }
    if (isOpen) {
      fetchAreas();
    }
    setIsEditing(false);
  }, [user, isOpen]);

  const fetchAreas = async () => {
    try {
      const response = await fetch(`${API_URL}/areas/listar/`);
      if (response.ok) {
        const data = await response.json();
        setAreas(data);
      }
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/users/${user.ficha}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_area: formData.id_area ? parseInt(formData.id_area, 10) : null
        })
      });

      if (response.ok) {
        alert('Usuario actualizado con éxito');
        window.dispatchEvent(new Event('user-created')); // Re-fetch users in list
        setIsEditing(false);
        onClose();
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'No se pudo actualizar'));
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/users/${user.ficha}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Usuario eliminado correctamente');
        window.dispatchEvent(new Event('user-created'));
        onClose();
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'No se pudo eliminar'));
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-lowest">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface">
              {isEditing ? 'Editar Usuario' : 'Detalles del Usuario'}
            </h2>
            <p className="text-sm font-label text-stone-500 dark:text-on-surface-variant mt-1">Ficha #{user.ficha}</p>
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
             <div className="flex-1">
                {isEditing ? (
                  <input 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded px-2 py-1 text-sm font-headline font-bold uppercase outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <h3 className="text-xl font-headline font-bold text-on-surface uppercase">{user.nombre}</h3>
                )}
                <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-[10px] font-label font-black uppercase tracking-tighter mt-1 inline-block">
                  {user.rol}
                </span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
               <h3 className="text-xs font-label font-bold text-stone-500 dark:text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">mail</span> Correo
               </h3>
               {isEditing ? (
                 <input 
                   name="correo"
                   value={formData.correo}
                   onChange={handleChange}
                   className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none text-sm font-body py-1"
                   placeholder="correo@ejemplo.com"
                 />
               ) : (
                 <p className="font-body text-sm text-on-surface truncate" title={user.correo}>{user.correo || 'No registrado'}</p>
               )}
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
               <h3 className="text-xs font-label font-bold text-stone-500 dark:text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">call</span> Teléfono
               </h3>
               {isEditing ? (
                 <input 
                   name="numero"
                   value={formData.numero}
                   onChange={handleChange}
                   className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none text-sm font-body py-1"
                   placeholder="0412-0000000"
                 />
               ) : (
                 <p className="font-body text-sm text-on-surface">{user.numero || 'No registrado'}</p>
               )}
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 sm:col-span-2">
               <h3 className="text-xs font-label font-bold text-stone-500 dark:text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">domain</span> Departamento
               </h3>
               {isEditing ? (
                 <select 
                   name="id_area"
                   value={formData.id_area}
                   onChange={handleChange}
                   className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none text-sm font-body py-1"
                 >
                   <option value="">Seleccionar Departamento</option>
                   {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                 </select>
               ) : (
                 <p className="font-body text-sm text-on-surface uppercase">{user.area || 'No especificado'}</p>
               )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {!isEditing && (
              <button 
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-4 py-2 rounded-full font-label font-bold text-error hover:bg-error/10 transition-colors text-xs uppercase"
              >
                <span className="material-symbols-outlined text-sm">delete</span> Eliminar
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-full font-label font-bold text-on-surface hover:bg-surface-container transition-colors text-xs uppercase"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full font-label font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm text-xs uppercase"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 rounded-full font-label font-bold border border-outline-variant text-on-surface hover:bg-surface-container transition-colors text-xs uppercase"
                >
                  Editar
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full font-label font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm text-xs uppercase"
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
