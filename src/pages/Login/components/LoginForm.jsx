import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import logo from '../../../assets/logo.png';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [ficha, setFicha] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [shouldShake, setShouldShake] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setShouldShake(false);

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ficha: parseInt(ficha, 10) })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Acceso Denegado');
            }

            setIsAuthenticating(true);
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 35;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    if (data.user) login(data.user);
                    setTimeout(() => navigate('/dashboard'), 500);
                }
                setLoadingProgress(progress);
            }, 180);

        } catch (err) {
            setError(err.message);
            setLoading(false);
            setShouldShake(true);
            // Quitar la clase de sacudida después de la animación para que pueda volver a sonar
            setTimeout(() => setShouldShake(false), 500);
        }
    };

    if (isAuthenticating) {
        return (
            <div className="fixed inset-0 z-[100] bg-stone-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="relative mb-12">
                    <div className="w-24 h-24 md:w-32 md:h-32 relative z-10 animate-pulse">
                        <img src={logo} alt="SIFMO" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                </div>
                
                <div className="w-full max-w-xs space-y-4">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-label font-black text-primary uppercase tracking-[0.2em] animate-pulse">Iniciando Terminal</span>
                        <span className="text-xs font-label text-stone-400 font-bold">{Math.round(loadingProgress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="text-[8px] font-label text-stone-500 uppercase tracking-widest">Estableciendo conexión segura...</p>
                        <p className="text-[8px] font-label text-stone-500 uppercase tracking-widest">Sincronizando protocolos FMO...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-span-1 lg:col-span-5 p-8 lg:p-16 flex flex-col justify-center bg-transparent">
            <div className="mb-12">
                <h2 className="font-headline text-3xl font-bold text-on-surface-variant mb-2 uppercase tracking-tighter">Acceso <span className="text-primary italic">Restringido</span></h2>
                <p className="text-on-surface-variant font-body text-sm">Terminal de Autenticación SIFMO</p>
            </div>
            
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg font-body text-xs flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                    <span className="material-symbols-outlined text-sm">lock_person</span>
                    <span className="uppercase font-black tracking-widest">{error}</span>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={`space-y-8 ${shouldShake ? 'animate-shake' : ''}`}>
                <div className="space-y-2">
                    <label className="font-label text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-on-surface-variant flex justify-between" htmlFor="ficha">
                        Ficha del Trabajador
                        <span className={`${error ? 'text-red-500' : 'text-primary'} italic`}>*</span>
                    </label>
                    <div className="relative">
                        <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-outline'}`}>badge</span>
                        <input 
                            className={`w-full bg-surface-container-low border-none h-16 pl-12 pr-4 text-xl font-headline font-semibold text-on-surface-variant focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 ${error ? 'border-red-500 bg-red-500/5' : 'border-transparent focus:border-primary'}`} 
                            id="ficha" 
                            name="ficha"
                            value={ficha}
                            onChange={(e) => setFicha(e.target.value)}
                            placeholder="Ej. 12345" 
                            type="number" 
                            required
                        />
                    </div>
                </div>
                
                <button 
                    className="w-full h-16 bg-primary text-on-primary font-headline font-bold text-lg rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="tracking-widest">VERIFICANDO</span>
                        </div>
                    ) : (
                        <>
                            <span className="tracking-widest">ENTRAR AL SISTEMA</span>
                            <span className="material-symbols-outlined">login</span>
                        </>
                    )}
                </button>
            </form>
            
            <div className="mt-12 space-y-6 text-center">
                <div className="flex flex-col gap-4">
                    <Link className="font-headline font-bold text-primary hover:text-primary-container transition-colors text-base inline-flex items-center justify-center gap-2 uppercase tracking-tighter" to="/register">
                        ¿Nuevo usuario? Registrarse
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                </div>
            </div>
            
            <div className="mt-auto pt-12 flex justify-between items-center text-[9px] text-stone-400 font-label uppercase tracking-[0.3em]">
                <span>FMO • TELEMÁTICA</span>
                <span>2024</span>
            </div>
        </div>
    );
};

export default LoginForm;
