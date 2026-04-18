import React from 'react';

const LoginForm = () => {
    return (
        <div className="col-span-1 lg:col-span-5 p-8 lg:p-16 flex flex-col justify-center bg-surface">
            <div className="mb-12">
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Inicio de Sesión</h2>
                <p className="text-on-surface-variant font-body">Ingrese sus credenciales para continuar</p>
            </div>
            
            <form action="#" className="space-y-8">
                {/* Ficha Input Field */}
                <div className="space-y-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="ficha">
                        Numero de Ficha
                        <span className="text-primary italic">Campo Obligatorio</span>
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="badge">badge</span>
                        <input 
                            className="w-full bg-surface-container-low border-none h-16 pl-12 pr-4 text-xl font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary" 
                            id="ficha" 
                            placeholder="XXXX-XXXX" 
                            type="text" 
                        />
                    </div>
                    <p className="text-[10px] text-outline uppercase font-label">Official company ID required for session token.</p>
                </div>
                
                {/* Password/Secondary Verification (Standard UX) */}
                <div className="space-y-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="pass">Contraseña</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="lock">lock</span>
                        <input 
                            className="w-full bg-surface-container-low border-none h-16 pl-12 pr-4 text-xl font-headline font-semibold text-on-surface focus:ring-0 focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-primary" 
                            id="pass" 
                            placeholder="••••••••" 
                            type="password" 
                        />
                    </div>
                </div>
                
                {/* Action Button */}
                <button 
                    className="w-full h-16 molten-gradient text-on-primary font-headline font-bold text-lg rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3" 
                    type="submit"
                >
                    ENTRAR
                    <span className="material-symbols-outlined" data-icon="login">login</span>
                </button>
            </form>
            
            {/* Secondary Links */}
            <div className="mt-12 space-y-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-outline-variant/30"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface px-4 text-outline font-label">Account Services</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <a className="font-headline font-bold text-primary hover:text-primary-container transition-colors text-lg inline-flex items-center justify-center gap-2" href="#">
                        Not registered? Sign up here
                        <span className="material-symbols-outlined text-base" data-icon="arrow_forward">arrow_forward</span>
                    </a>
                    <a className="font-label text-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                        Forgot your credentials? Contact Supervisor
                    </a>
                </div>
            </div>
            
            {/* Technical Footer */}
            <div className="mt-auto pt-12 flex justify-between items-center text-[10px] text-outline font-label uppercase tracking-widest">
                <span>v0.0.1-ALPHA</span>
            </div>
        </div>
    );
};

export default LoginForm;
