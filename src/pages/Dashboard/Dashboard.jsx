import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import EquiposContent from './components/EquiposContent';
import NewIncidentModal from './components/NewIncidentModal';
import NewWorkstationModal from './components/NewWorkstationModal';
import MobileNav from './components/MobileNav';
import FloatingActionButton from './components/FloatingActionButton';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#equipos') {
        setCurrentView('equipos');
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
      <Sidebar />
      {currentView === 'equipos' ? <EquiposContent /> : <MainContent />}
      <NewIncidentModal />
      <NewWorkstationModal />
      <MobileNav />
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;
