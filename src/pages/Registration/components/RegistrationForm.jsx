import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../../config/api';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        ficha: '',
        id_area: '',
        numero: '',
        rol: 'Operador',
        correo: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await fetch(`${API_URL}/areas/listar/`);
                if (response.ok) {
                    const data = await response.json();
                    setAreas(data);
                } else {
                    console.error("Error al obtener las áreas");
                }
            } catch (err) {
                console.error("Error de conexión al obtener áreas:", err);
            }
        };
        fetchAreas();
    }, []);

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
                headers: {
                    'Content-Type': 'application/json'
                },
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

            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-span-1 lg:col-span-5 p-8 lg:p-16 flex flex-col justify-center bg-surface">
            <div className="mb-10">
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Crear Cuenta</h2>
                <p className="text-on-surface-variant font-body">Registre sus credenciales para acceder</p>
            </div>
            
            {error && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-body text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Input Field */}
                <div className="space-y-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="nombre">
                        Nombre Completo
                        <span className="text-primary italic">Obligatorio</span>
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="person">person</span>
                        <input 
                            className="w-full bg-surface-container-low border-none h-14 pl-12 pr-4 text-lg font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary" 
                            id="nombre" 
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej. Juan Pérez" 
                            type="text" 
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Ficha Input Field */}
                    <div className="space-y-2">
                        <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="ficha">
                            Número de Ficha
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="badge">badge</span>
                            <input 
                                className="w-full bg-surface-container-low border-none h-14 pl-10 pr-2 text-base font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary" 
                                id="ficha" 
                                name="ficha"
                                value={formData.ficha}
                                onChange={handleChange}
                                placeholder="12345" 
                                type="number" 
                                required
                            />
                        </div>
                    </div>

                    {/* Phone Number Input Field */}
                    <div className="space-y-2">
                        <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="numero">
                            Número Telefónico
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="call">call</span>
                            <input 
                                className="w-full bg-surface-container-low border-none h-14 pl-10 pr-2 text-base font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary" 
                                id="numero" 
                                name="numero"
                                value={formData.numero}
                                onChange={handleChange}
                                placeholder="0412-1234567" 
                                type="tel" 
                            />
                        </div>
                    </div>

                    {/* Department Select Field */}
                    <div className="space-y-2">
                        <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="id_area">
                            Departamento
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="domain">domain</span>
                            <select 
                                className="w-full bg-surface-container-low border-none h-14 pl-10 pr-8 text-sm font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary appearance-none" 
                                id="id_area" 
                                name="id_area"
                                value={formData.id_area}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Seleccione</option>
                                {areas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.nombre}
                                    </option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl" data-icon="expand_more">expand_more</span>
                        </div>
                    </div>

                    {/* Rol Select Field */}
                    <div className="space-y-2">
                        <label className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="rol">
                            Rol
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl" data-icon="work">work</span>
                            <select 
                                className="w-full bg-surface-container-low border-none h-14 pl-10 pr-8 text-sm font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary appearance-none" 
                                id="rol" 
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                            >
                                <option value="Operador">Operador</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl" data-icon="expand_more">expand_more</span>
                        </div>
                    </div>
                </div>

                {/* Email Input Field */}
                <div className="space-y-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="correo">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="mail">mail</span>
                        <input 
                            className="w-full bg-surface-container-low border-none h-14 pl-12 pr-4 text-lg font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary" 
                            id="correo" 
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="j.perez@ferrominera.com" 
                            type="email" 
                        />
                    </div>
                </div>
                
                {/* Action Button */}
                <button 
                    className="w-full h-14 molten-gradient text-on-primary font-headline font-bold text-lg rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                    {!loading && <span className="material-symbols-outlined" data-icon="how_to_reg">how_to_reg</span>}
                </button>
            </form>
            
            {/* Secondary Links */}
            <div className="mt-8 space-y-4 text-center">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-outline-variant/30"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface px-4 text-outline font-label"> </span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <Link className="font-headline font-bold text-primary hover:text-primary-container transition-colors text-base inline-flex items-center justify-center gap-2" to="/login">
                        ¿Ya tienes acceso? Inicia sesión aquí
                        <span className="material-symbols-outlined text-base" data-icon="login">login</span>
                    </Link>
                </div>
            </div>
            
            {/* Technical Footer */}
            <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-outline font-label uppercase tracking-widest">
                <span>v0.0.1-ALPHA</span>
            </div>
        </div>
    );
};

export default RegistrationForm;
