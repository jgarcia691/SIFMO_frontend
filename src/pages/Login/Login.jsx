import React from 'react';
import LoginHero from './components/LoginHero';
import LoginForm from './components/LoginForm';

const Login = () => {
    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center p-4">
            {/* Suppressing Navigation Shell for Transactional Login Page */}
            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-surface-container-lowest rounded-xl shadow-2xl">
                <LoginHero />
                <LoginForm />
            </main>

            {/* Overlay HUD Elements (Decorative Industrial Aesthetic) */}
        
            <div className="fixed bottom-8 right-8 hidden xl:block pointer-events-none">
                <div className="text-[10px] font-label text-outline text-right mb-4">FERROMINERA DEL ORINOCO</div>
                <div className="w-32 h-px bg-primary/20"></div>
            </div>
        </div>
    );
};

export default Login;
