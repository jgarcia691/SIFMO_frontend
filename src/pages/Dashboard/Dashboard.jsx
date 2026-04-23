import React from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NewIncidentModal from './components/NewIncidentModal';
import MobileNav from './components/MobileNav';
import FloatingActionButton from './components/FloatingActionButton';

const Dashboard = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen font-body w-full">
      <TopNav />
      <Sidebar />
      <MainContent />
      <NewIncidentModal />
      <MobileNav />
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;
