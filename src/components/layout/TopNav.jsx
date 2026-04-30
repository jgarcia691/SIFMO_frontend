import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const TopNav = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-stone-100/90 dark:bg-surface-container-lowest/80 backdrop-blur-xl border-b-0 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold uppercase tracking-tighter text-primary font-headline">Servicio Técnico de Ferrominera</span>
      </div>
      <div className="flex items-center gap-6">
        <ThemeToggle />
        <div className="flex items-center gap-3 ml-4">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter leading-none">{user?.nombre || 'Usuario'}</p>
            <p className="text-[10px] text-stone-400 dark:text-on-surface-variant font-label uppercase tracking-widest">{user?.rol || 'Invitado'}</p>
          </div>
          <a href="#profile" className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden hover:border-primary transition-all group flex items-center justify-center">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">person</span>
          </a>
          <button 
            onClick={logout}
            className="p-2 text-stone-400 hover:text-red-600 transition-colors material-symbols-outlined"
            title="Cerrar Sesión"
          >
            logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
