import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeView }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAdmin(user.rol === 'Administrador');
    }
  }, []);

  const getLinkClasses = (view) => {
    const base = "flex items-center gap-3 px-3 py-3 font-headline text-sm uppercase font-semibold transition-transform active:scale-90 border-l-4";
    const active = "bg-stone-200 dark:bg-stone-800 text-red-700 dark:text-red-400 border-red-700";
    const inactive = "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/70 dark:hover:bg-stone-800/70 border-transparent";
    
    return `${base} ${activeView === view ? active : inactive}`;
  };

  return (
    <aside className="group flex flex-col fixed left-0 top-0 pt-20 pb-8 px-4 h-screen w-20 hover:w-64 transition-[width] duration-300 ease-in-out border-r-0 bg-stone-100 dark:bg-stone-950 z-40 hidden md:flex overflow-hidden whitespace-nowrap">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 shrink-0 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
          </div>
          <h2 className="font-headline text-lg font-black text-stone-900 dark:text-stone-100 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">SIFMO</h2>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <a className={getLinkClasses('dashboard')} href="#dashboard">
          <span className="material-symbols-outlined text-xl shrink-0">dashboard</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">{isAdmin ? 'Panel de Control' : 'Dashboard'}</span>
        </a>
        <a className={getLinkClasses('incidents')} href="#incidents">
          <span className="material-symbols-outlined text-xl shrink-0">report_problem</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Historial</span>
        </a>
        <a className={getLinkClasses('equipos')} href="#equipos">
          <span className="material-symbols-outlined text-xl shrink-0">computer</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Equipos</span>
        </a>
        {isAdmin && (
          <>
            <a className={getLinkClasses('users')} href="#users">
              <span className="material-symbols-outlined text-xl shrink-0">group</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Usuarios</span>
            </a>
            <a className={getLinkClasses('reports')} href="#reports">
              <span className="material-symbols-outlined text-xl shrink-0">analytics</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Reportes</span>
            </a>
          </>
        )}
      </nav>
      <div className="mt-auto pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
        <Link className="flex items-center gap-3 px-3 py-2 text-stone-600 dark:text-stone-400 hover:text-red-600 font-headline text-sm uppercase font-semibold border-l-4 border-transparent" to="/login">
          <span className="material-symbols-outlined text-xl shrink-0">logout</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
