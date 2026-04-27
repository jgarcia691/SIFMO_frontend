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
      } else {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen font-body w-full">
      <TopNav />
      <Sidebar activeView={currentView} />
      {(() => {
        if (currentView === 'equipos') return <EquiposContent />;
        if (userRole === 'Administrador' && currentView === 'users') return <UsersContent />;
        if (userRole === 'Administrador' && (currentView === 'dashboard' || currentView === 'incidents')) {
           return <AdminContent activeView={currentView} />;
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
