import React, { useState, useEffect } from 'react';

const AuthHero = () => {
    const [serverStatus, setServerStatus] = useState('VERIFICANDO...');

    useEffect(() => {
        const checkServer = async () => {
            try {
                // Intenta contactar la ruta raiz del API
                const response = await fetch('http://localhost:3000/');
                if (response.ok) {
                    setServerStatus('ACTIVO');
                } else {
                    setServerStatus('ERROR');
                }
            } catch (error) {
                // Si la red falla o el servidor está apagado
                setServerStatus('INACTIVO');
            }
        };

        checkServer();
        const intervalId = setInterval(checkServer, 10000); // Polling cada 10 seg
        return () => clearInterval(intervalId);
    }, []);

    const getStatusDotColor = () => {
        if (serverStatus === 'ACTIVO') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
        if (serverStatus === 'VERIFICANDO...') return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-none';
    };

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
                    Plataforma de Soporte Técnico de Ferrominera Orinoco para el personal de la empresa, con el fin de gestionar y dar seguimiento a las incidencias técnicas.
                </p>
                
                <div className="mt-8 flex gap-6">
                    <div className="bg-surface-container-low/10 backdrop-blur px-4 py-2 rounded-sm border border-outline-variant/10">
                        <span className="font-label text-xs uppercase text-tertiary-fixed-dim block">Estado del Servidor</span>
                        <span className="font-headline font-bold text-on-tertiary flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getStatusDotColor()} ${serverStatus === 'ACTIVO' ? 'animate-pulse' : ''}`}></span>
                            {serverStatus}
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

export default AuthHero;
