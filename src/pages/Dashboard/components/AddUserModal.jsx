import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const AddUserModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ficha: '',
    id_area: '',
    numero: '',
    rol: 'Analista',
    correo: ''
  });
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
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
      fetchAreas();
      
      // Reset form on open
      setFormData({
        nombre: '',
        ficha: '',
        id_area: '',
        numero: '',
        rol: 'Analista',
        correo: ''
      });
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ficha: parseInt(formData.ficha, 10),
          id_area: parseInt(formData.id_area, 10)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el usuario');
      }

      window.dispatchEvent(new Event('user-created'));
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-lowest">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface">Agregar Nuevo Usuario</h2>
            <p className="text-sm font-label text-stone-500 mt-1">Gestión de Administradores y Analistas</p>
          </div>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors"
          >
            close
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-body text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
            </div>
          )}

          <form id="addUserForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="nombre">
                    Nombre Completo
                </label>
                <input 
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg h-12 px-4 text-sm font-headline font-semibold text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                    id="nombre" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. María López" 
                    type="text" 
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="ficha">
                        Número de Ficha
                    </label>
                    <input 
                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg h-12 px-4 text-sm font-headline font-semibold text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                        id="ficha" 
                        name="ficha"
                        value={formData.ficha}
                        onChange={handleChange}
                        placeholder="12345" 
                        type="number" 
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="id_area">
                        Departamento
                    </label>
                    <select 
                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg h-12 px-4 text-sm font-headline font-semibold text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                        id="id_area" 
                        name="id_area"
                        value={formData.id_area}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Seleccione</option>
                        {areas.map((area) => (
                            <option key={area.id} value={area.id}>{area.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="rol">
                        Rol de Sistema
                    </label>
                    <select 
                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg h-12 px-4 text-sm font-headline font-semibold text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                        id="rol" 
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                    >
                        <option value="Analista">Analista</option>
                        <option value="Administrador">Administrador</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="numero">
                        Teléfono (Opcional)
                    </label>
                    <input 
                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg h-12 px-4 text-sm font-headline font-semibold text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                        id="numero" 
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="0412-1234567" 
                        type="tel" 
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="correo">
                    Correo Electrónico (Opcional)
                </label>
                <input 
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg h-12 px-4 text-sm font-headline font-semibold text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                    id="correo" 
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="m.lopez@ferrominera.com" 
                    type="email" 
                />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-label font-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="addUserForm"
            disabled={loading}
            className="px-6 py-2.5 rounded-full font-label font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span> Guardando...</>
            ) : 'Guardar Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
