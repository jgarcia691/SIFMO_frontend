import React, { useState, useEffect } from 'react';
import IncidentDetailsModal from './IncidentDetailsModal';
import { API_URL } from '../../../config/api';

const AdminContent = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    mttr: '4.2h'
  });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/incidentes/listar/`);
        if (response.ok) {
          const data = await response.json();
          // Formatear fechas
          const formattedData = data.map(inc => ({
            ...inc,
            date: new Date(inc.fecha).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }).toUpperCase()
          }));
          setIncidents(formattedData);
          
          // Calcular estadísticas reales
          const total = data.length;
          const pending = data.filter(i => i.status === 'Pendiente' || i.status === 'En revisión').length;
          const resolved = data.filter(i => i.status === 'Listo' || i.status === 'Entregado').length;
          
          setStats(prev => ({ ...prev, total, pending, resolved }));
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleRefresh = () => fetchData();
    window.addEventListener('incident-created', handleRefresh);
    return () => window.removeEventListener('incident-created', handleRefresh);
  }, []);

  const openModal = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedIncident(null), 200);
  };

  const typeColors = {
    'reparacion de estacion de trabajo': 'bg-red-100 text-red-800',
    'reparacion de periferico': 'bg-stone-100 text-stone-600',
    'solicitud': 'bg-blue-100 text-blue-800'
  };

  const statusIndicators = {
    'Pendiente': { color: 'bg-amber-500', text: 'text-amber-700', pulse: true },
    'En revisión': { color: 'bg-blue-500', text: 'text-blue-700', pulse: true },
    'Listo': { color: 'bg-green-500', text: 'text-green-700', pulse: false },
    'En espera': { color: 'bg-stone-400', text: 'text-stone-500', pulse: false }
  };

  return (
    <main className="md:ml-20 pt-24 px-6 md:px-10 pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none mb-2">
            Panel de <span className="text-primary italic">Control</span>
          </h1>
          <p className="text-stone-500 font-label uppercase tracking-widest text-xs">Administración Global SIFMO</p>
        </header>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Incidentes Totales', value: stats.total, icon: 'analytics', trend: '+5%', color: 'text-primary' },
            { label: 'Pendientes', value: stats.pending, icon: 'pending_actions', trend: '-2', color: 'text-amber-500' },
            { label: 'Resueltos', value: stats.resolved, icon: 'check_circle', trend: '+12%', color: 'text-green-500' },
            { label: 'MTTR (Promedio)', value: stats.mttr, icon: 'timer', trend: '-8%', color: 'text-blue-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-stone-50 ${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
              <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-headline font-black text-on-surface">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-tight">Incidencias <span className="text-primary">Pendientes</span></h2>
          <p className="text-xs text-stone-500 font-label uppercase tracking-widest">Todos los departamentos</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {incidents
              .filter(i => i.status === 'Pendiente' || i.status === 'En revisión')
              .map((incident) => {
              const statusStyle = statusIndicators[incident.status] || { color: 'bg-stone-500', text: 'text-stone-700', pulse: false };
              const typeClass = typeColors[incident.tipo] || 'bg-stone-100 text-stone-800';

              return (
                <div 
                  key={incident.id} 
                  className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-white transition-colors duration-300 cursor-pointer flex flex-col"
                  onClick={() => openModal(incident)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-label font-bold text-stone-400"># {incident.id} • SOLICITANTE: {incident.cliente}</span>
                      <span className={`${typeClass} text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter w-fit`}>
                        {incident.tipo}
                      </span>
                    </div>
                    <span className="text-stone-400 text-xs font-label">{incident.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors uppercase">
                    {incident.tipo}
                  </h3>
                  
                  <p className="text-sm text-on-surface-variant font-body mb-6 line-clamp-2">
                    {incident.observacion || 'Sin observaciones registradas.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusStyle.color} ${statusStyle.pulse ? 'animate-pulse' : ''}`}></span>
                      <span className={`text-[10px] font-label font-bold uppercase ${statusStyle.text}`}>{incident.status}</span>
                    </div>
                    <button className="text-primary material-symbols-outlined hover:bg-primary-fixed p-1 rounded-full transition-colors group-hover:bg-primary-fixed">
                      open_in_new
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <IncidentDetailsModal 
        incident={selectedIncident} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </main>
  );
};

export default AdminContent;
