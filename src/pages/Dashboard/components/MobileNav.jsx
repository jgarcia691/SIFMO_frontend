import React from 'react';

const MobileNav = ({ activeView }) => {
  const getLinkClasses = (view) => {
    const isActive = activeView === view || (view === 'dashboard' && activeView === 'incidents');
    return `flex flex-col items-center justify-center gap-1 ${isActive ? 'text-red-700 font-bold' : 'text-stone-400'}`;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center h-16">
      <a className={getLinkClasses('dashboard')} href="#dashboard">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'dashboard' || activeView === 'incidents' ? "'FILL' 1" : "''" }}>dashboard</span>
        <span className="text-[9px] uppercase font-label">HUD</span>
      </a>
      <a className={getLinkClasses('incidents')} href="#incidents">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'incidents' ? "'FILL' 1" : "''" }}>report_problem</span>
        <span className="text-[9px] uppercase font-label">Incidents</span>
      </a>
      <a className="flex items-center justify-center -mt-8 bg-primary w-14 h-14 rounded-full text-white shadow-lg shadow-primary/30" href="#modal-new-incident">
        <span className="material-symbols-outlined text-3xl">add</span>
      </a>
      <a className={getLinkClasses('equipos')} href="#equipos">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'equipos' ? "'FILL' 1" : "''" }}>precision_manufacturing</span>
        <span className="text-[9px] uppercase font-label">Equip</span>
      </a>
      <a className={getLinkClasses('profile')} href="#profile">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'profile' ? "'FILL' 1" : "''" }}>person</span>
        <span className="text-[9px] uppercase font-label">Profile</span>
      </a>
    </nav>
  );
};

export default MobileNav;
