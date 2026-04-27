import React, { useState, useEffect } from 'react';
import IncidentDetailsModal from './IncidentDetailsModal';
import { API_URL } from '../../../config/api';

const AdminContent = ({ activeView }) => {
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
            date: (() => {
              if (!inc.fecha) return 'PENDIENTE';
              const d = new Date(inc.fecha);
              return isNaN(d.getTime()) ? inc.fecha : d.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }).toUpperCase();
            })()
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
    'Entregado': { color: 'bg-stone-600', text: 'text-stone-600', pulse: false },
    'En espera': { color: 'bg-stone-400', text: 'text-stone-500', pulse: false }
  };

  return (
    <main className="md:ml-20 pt-16 md:pt-24 px-4 md:px-10 pb-20 md:pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none mb-2">
              Panel de <span className="text-primary italic">Control</span>
            </h1>
            <p className="text-stone-500 font-label uppercase tracking-widest text-xs">Administración Global SIFMO</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4 bg-surface-container-low p-2 md:p-3 rounded-2xl border border-outline-variant/10 scale-90 md:scale-100 origin-left">
            <div className="px-3 md:px-4 text-center">
              <p className="text-[8px] md:text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest">Total</p>
              <p className="text-xl md:text-2xl font-headline font-bold text-on-surface">{stats.total}</p>
            </div>
            <div className="w-[1px] h-8 md:h-10 bg-stone-200"></div>
            <div className="px-3 md:px-4 text-center">
              <p className="text-[8px] md:text-[10px] font-label font-bold text-amber-500 uppercase tracking-widest">Espera</p>
              <p className="text-xl md:text-2xl font-headline font-bold text-on-surface">{stats.pending}</p>
            </div>
            <div className="w-[1px] h-8 md:h-10 bg-stone-200"></div>
            <div className="px-3 md:px-4 text-center">
              <p className="text-[8px] md:text-[10px] font-label font-bold text-green-600 uppercase tracking-widest">Listos</p>
              <p className="text-xl md:text-2xl font-headline font-bold text-on-surface">{stats.resolved}</p>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-tight">
            {activeView === 'incidents' ? (
              <>Historial de <span className="text-primary">Incidencias</span></>
            ) : (
              <>Incidencias <span className="text-primary">Pendientes</span></>
            )}
          </h2>
          <p className="text-xs text-stone-500 font-label uppercase tracking-widest">
            {activeView === 'incidents' ? 'Todos los registros' : 'Todos los departamentos'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {incidents
              .filter(i => {
                if (activeView === 'incidents') return true;
                return i.status === 'Pendiente' || i.status === 'En revisión';
              })
              .map((incident) => {
              const statusStyle = statusIndicators[incident.status] || { color: 'bg-stone-500', text: 'text-stone-700', pulse: false };
              const typeClass = typeColors[incident.tipo] || 'bg-stone-100 text-stone-800';

              if (activeView === 'incidents') return null; // We render the table below for this view

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

        {/* List View for History */}
        {!loading && activeView === 'incidents' && incidents.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">ID</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Tipo / Solicitante</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Departamento</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Fecha</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {incidents.map((incident) => {
                  const statusStyle = statusIndicators[incident.status] || { color: 'bg-stone-500', text: 'text-stone-700', pulse: false };
                  const typeClass = typeColors[incident.tipo] || 'bg-stone-100 text-stone-800';
                  
                  return (
                    <tr key={incident.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-label font-bold text-primary">#{incident.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-headline font-bold text-on-surface uppercase text-sm">{incident.tipo}</span>
                          <span className="text-[10px] font-label text-stone-400 uppercase">{incident.solicitante} ({incident.cliente})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-on-surface-variant font-body uppercase">{incident.area || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-500 font-label">{incident.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusStyle.color}`}></span>
                          <span className={`text-[10px] font-label font-bold uppercase ${statusStyle.text}`}>{incident.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openModal(incident)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors material-symbols-outlined"
                        >
                          visibility
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
