import React from 'react';

const LoginHero = () => {
    return (
        <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 bg-tertiary overflow-hidden">
            {/* Background Image with Texture */}
            <div className="absolute inset-0 z-0 opacity-40">
                <img 
                    alt="Industrial steel plant" 
                    className="w-full h-full object-cover" 
                    data-alt="dramatic wide shot of a massive iron ore processing facility at dusk with glowing molten metal and heavy industrial machinery" 
                    src="../src/assets/images/Ferrominera-Orinoco.png"
                />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 molten-gradient rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white" data-icon="factory">factory</span>
                    </div>
                    <div className="font-headline font-black text-2xl uppercase tracking-tighter text-surface-bright">
                        Soporte Técnico de Ferrominera
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 mt-auto">
                <h1 className="font-headline text-6xl font-bold text-on-tertiary tracking-tighter leading-none mb-6">
                    EL HIERRO <br/>QUE MUEVE A VENEZUELA.
                </h1>
                <p className="text-on-tertiary-container max-w-md font-body text-lg">
                    Access the Industrial Technical HUD. Secure authentication for authorized Ferrominera field engineers and technical staff.
                </p>
                
                <div className="mt-8 flex gap-6">
                    <div className="bg-surface-container-low/10 backdrop-blur px-4 py-2 rounded-sm border border-outline-variant/10">
                        <span className="font-label text-xs uppercase text-tertiary-fixed-dim block">Estado del Sistema</span>
                        <span className="font-headline font-bold text-on-tertiary flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                            ACTIVO
                        </span>
                    </div>
                  {/*}  <div className="bg-surface-container-low/10 backdrop-blur px-4 py-2 rounded-sm border border-outline-variant/10">
                        <span className="font-label text-xs uppercase text-tertiary-fixed-dim block">Active Nodes</span>
                        <span className="font-headline font-bold text-on-tertiary">1,244 UNIT</span>
                    </div>*/}
                </div>
            </div>
        </div>
    );
};

export default LoginHero;
