import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const ProfileContent = () => {
  const [user, setUser] = useState(null);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    numero: '',
    id_area: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        nombre: storedUser.nombre || '',
        correo: storedUser.correo || '',
        numero: storedUser.numero || '',
        id_area: storedUser.id_area || ''
      });
    }

    const fetchAreas = async () => {
      try {
        const response = await fetch(`${API_URL}/areas`);
        if (response.ok) {
          const data = await response.json();
          setAreas(data);
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/users/${user.ficha}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        // Actualizar localStorage con los nuevos datos
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        // Disparar evento para que TopNav se actualice
        window.dispatchEvent(new Event('user-updated'));
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Error al actualizar el perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <main className="md:ml-20 pt-24 px-6 md:px-10 pb-12 bg-surface min-h-screen">
      <section className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none mb-2">
            Mi <span className="text-primary italic">Perfil</span>
          </h1>
          <p className="text-stone-500 font-label uppercase tracking-widest text-xs">Gestiona tu información personal</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card de Información Estática */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-5xl">person</span>
              </div>
              <h2 className="text-2xl font-headline font-bold text-on-surface uppercase">{user.nombre}</h2>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-label font-bold uppercase tracking-wider mt-2 mb-6">
                {user.rol}
              </span>
              
              <div className="w-full space-y-4 pt-6 border-t border-outline-variant/10 text-left">
                <div>
                  <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest">Ficha de Empleado</p>
                  <p className="text-sm font-body font-bold text-on-surface">#{user.ficha}</p>
                </div>
                <div>
                  <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest">Departamento</p>
                  <p className="text-sm font-body font-bold text-on-surface">{user.area || 'Sin asignar'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Edición */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
              <h3 className="text-xl font-headline font-bold text-on-surface uppercase mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                Editar Información
              </h3>

              {message.text && (
                <div className={`mb-8 p-4 rounded-xl text-sm font-label font-bold uppercase tracking-tight flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest ml-2">Nombre Completo</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">person</span>
                      <input 
                        type="text" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/20 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest ml-2">Área / Departamento</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">business</span>
                      <select 
                        name="id_area"
                        value={formData.id_area}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/20 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body appearance-none"
                      >
                        <option value="">Seleccionar área</option>
                        {areas.map(area => (
                          <option key={area.id} value={area.id}>{area.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest ml-2">Correo Electrónico</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">mail</span>
                      <input 
                        type="email" 
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/20 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                        placeholder="ejemplo@ferrominera.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest ml-2">Número de Contacto</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">call</span>
                      <input 
                        type="text" 
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/20 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
                        placeholder="04XX-XXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/10 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-headline font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">save</span>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfileContent;
