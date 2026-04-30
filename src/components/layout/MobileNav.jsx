import React from 'react';
import { useAuth } from '../../context/AuthContext';

const MobileNav = ({ activeView }) => {
  const { user } = useAuth();
  const isAdmin = user?.rol?.toLowerCase() === 'administrador';
  const isAnalyst = user?.rol?.toLowerCase() === 'analista';

  const getLinkClasses = (view) => {
    const isActive = activeView === view;
    return `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-primary font-bold' : 'text-stone-600 dark:text-on-surface-variant'}`;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-stone-200 dark:bg-surface-container border-t-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center h-16 px-2">
      {/* 1. Dashboard / Panel Principal */}
      <a className={getLinkClasses('dashboard')} href="#dashboard">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'dashboard' ? "'FILL' 1" : "''" }}>dashboard</span>
      </a>
      
      {/* 2. Historial / Incidencias */}
      <a className={getLinkClasses('incidents')} href="#incidents">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'incidents' ? "'FILL' 1" : "''" }}>history</span>
      </a>

      {/* 3. Botón Central (Nueva Solicitud) */}
      <a className="flex items-center justify-center -mt-8 bg-primary w-14 h-14 rounded-full text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform" href="#modal-new-incident">
        <span className="material-symbols-outlined text-3xl">add</span>
      </a>

      {/* 4. Equipos */}
      <a className={getLinkClasses('equipos')} href="#equipos">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'equipos' ? "'FILL' 1" : "''" }}>computer</span>
      </a>

      {/* 5. Botón Dinámico según Rol (Eliminando redundancia de Perfil) */}
      {isAdmin ? (
        <a className={getLinkClasses('users')} href="#users" title="Gestión de Usuarios">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'users' ? "'FILL' 1" : "''" }}>group</span>
        </a>
      ) : isAnalyst ? (
        <a className={getLinkClasses('reports')} href="#reports" title="Reportes y Estadísticas">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'reports' ? "'FILL' 1" : "''" }}>analytics</span>
        </a>
      ) : (
        <a className={getLinkClasses('settings')} href="#profile" title="Ajustes de Cuenta">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'settings' ? "'FILL' 1" : "''" }}>settings</span>
        </a>
      )}
    </nav>
  );
};

export default MobileNav;
