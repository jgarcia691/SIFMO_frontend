import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import EquiposContent from './components/EquiposContent';
import AdminContent from './components/AdminContent';
import NewIncidentModal from './components/NewIncidentModal';
import NewWorkstationModal from './components/NewWorkstationModal';
import MobileNav from './components/MobileNav';
import FloatingActionButton from './components/FloatingActionButton';
import UsersContent from './components/UsersContent';
import AnalystContent from './components/AnalystContent';
import ProfileContent from './components/ProfileContent';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState('Operador');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.rol);
    }

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#equipos') {
        setCurrentView('equipos');
      } else if (hash === '#incidents') {
        setCurrentView('incidents');
      } else if (hash === '#users') {
        setCurrentView('users');
      } else if (hash === '#profile') {
        setCurrentView('profile');
      } else {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    // Listener para actualización de datos de usuario (desde ProfileContent)
    const handleUserUpdate = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserRole(user.rol);
      }
    };
    window.addEventListener('user-updated', handleUserUpdate);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen font-body w-full">
      <TopNav />
      <Sidebar activeView={currentView} />
      {(() => {
        if (currentView === 'profile') return <ProfileContent />;
        if (currentView === 'equipos') return <EquiposContent />;
        if (userRole?.toLowerCase() === 'administrador' && currentView === 'users') return <UsersContent />;
        if (userRole?.toLowerCase() === 'administrador' && (currentView === 'dashboard' || currentView === 'incidents')) {
           return <AdminContent activeView={currentView} />;
        }
        if (userRole?.toLowerCase() === 'analista' && (currentView === 'dashboard' || currentView === 'incidents')) {
           return <AnalystContent activeView={currentView} />;
        }
        return <MainContent activeView={currentView} />;
      })()}
      <NewIncidentModal />
      <NewWorkstationModal />
      <MobileNav activeView={currentView} />
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;
