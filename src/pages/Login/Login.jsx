import React from 'react';
import AuthHero from '../../components/AuthHero';
import LoginForm from './components/LoginForm';
import ThemeToggle from '../../components/common/ThemeToggle';

const Login = () => {
    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center p-4 relative">
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
                <ThemeToggle />
            </div>
            {/* Suppressing Navigation Shell for Transactional Login Page */}
            <main className="w-full max-w-6xl lg:h-[680px] grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-surface-container dark:bg-surface-container-high rounded-xl shadow-2xl">
                <AuthHero />
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
