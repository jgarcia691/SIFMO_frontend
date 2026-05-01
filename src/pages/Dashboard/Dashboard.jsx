import React, { useState, useEffect } from 'react';
// Layout
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';
import MobileNav from '../../components/layout/MobileNav';
import FloatingActionButton from '../../components/layout/FloatingActionButton';
// Views
import MainContent from './views/MainContent';
import EquiposContent from './views/EquiposContent';
import AdminContent from './views/AdminContent';
import UsersContent from './views/UsersContent';
import AnalystContent from './views/AnalystContent';
import ProfileContent from './views/ProfileContent';
import ReportsContent from './views/ReportsContent';
// Modals
import NewIncidentModal from './modals/NewIncidentModal';
import NewWorkstationModal from './modals/NewWorkstationModal';

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
      } else if (hash === '#reports') {
        setCurrentView('reports');
      } else if (hash === '#dashboard' || hash === '' || hash === '#') {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

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
        if (userRole?.toLowerCase() === 'administrador' && currentView === 'reports') return <ReportsContent />;
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
      {currentView === 'dashboard' && <FloatingActionButton />}
    </div>
  );
};

export default Dashboard;
