import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';
import IncidentDetailsModal from '../modals/IncidentDetailsModal';

const MainContent = ({ activeView }) => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        if (!user) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/incidentes/listar/cliente/${user.ficha}`);
        if (response.ok) {
          const data = await response.json();
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
            })(),
            rawDate: inc.fecha ? new Date(inc.fecha).toISOString().split('T')[0] : ''
          }));
          setIncidents(formattedData);
        }
      } catch (error) {
        console.error('Error al cargar incidentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const handleRefresh = () => fetchIncidents();
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
    'reparacion de estacion de trabajo': 'bg-red-50 dark:bg-red-900/30 text-stone-950 dark:text-red-400 border-2 border-stone-900 dark:border-none font-bold',
    'reparacion de periferico': 'bg-purple-50 dark:bg-purple-900/30 text-stone-950 dark:text-purple-400 border-2 border-stone-900 dark:border-none font-bold',
    'solicitud': 'bg-blue-50 dark:bg-blue-900/30 text-stone-950 dark:text-blue-400 border-2 border-stone-900 dark:border-none font-bold'
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface-variant uppercase tracking-tighter leading-none">
              {activeView === 'incidents' ? (
                <>Historial de <span className="text-primary italic">Solicitudes</span></>
              ) : (
                <>Mis <span className="text-primary italic">Solicitudes</span></>
              )}
            </h1>
            <p className="text-xs text-stone-500 dark:text-on-surface-variant font-label uppercase tracking-widest">
                {activeView === 'incidents' ? 'Registros históricos personales' : 'Tareas en curso'}
            </p>
          </div>

          {activeView === 'incidents' && (
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[180px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar por ID, Tipo..." 
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs font-body focus:ring-1 focus:ring-primary/30"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
                
                <select 
                  className="bg-surface-container-low border-none rounded-lg text-[10px] font-label px-3 py-2 focus:ring-1 focus:ring-primary/30 outline-none"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Cualquier Estado</option>
                  {Object.keys(statusIndicators).map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                  <input 
                    type="date" 
                    className="bg-transparent border-none text-[9px] font-label px-1 py-1 focus:ring-0"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  />
                  <span className="text-stone-400 text-[8px]">/</span>
                  <input 
                    type="date" 
                    className="bg-transparent border-none text-[9px] font-label px-1 py-1 focus:ring-0"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  />
                </div>
                
                {(filters.search || filters.status || filters.startDate || filters.endDate) && (
                  <button 
                    onClick={() => setFilters({ search: '', status: '', startDate: '', endDate: '' })}
                    className="text-primary material-symbols-outlined hover:bg-primary/10 p-1.5 rounded-full transition-colors text-lg"
                  >
                    filter_list_off
                  </button>
                )}
              </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/20">
             <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">folder_open</span>
             <p className="text-on-surface-variant font-body">No se encontraron solicitudes registradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {incidents.map((incident) => {
              const statusStyle = statusIndicators[incident.status] || { color: 'bg-stone-500', text: 'text-stone-700', pulse: false };
              const typeClass = typeColors[incident.tipo] || 'bg-stone-100 text-stone-800';

              if (activeView === 'incidents') return null;

              return (
                <div 
                  key={incident.id} 
                  className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-surface-container transition-colors duration-300 cursor-pointer flex flex-col"
                  onClick={() => openModal(incident)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-label font-bold text-stone-400 dark:text-on-surface-variant">SOLICITUD #{incident.id}</span>
                      <span className={`${typeClass} text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter w-fit`}>
                        {incident.tipo}
                      </span>
                    </div>
                    <span className="text-stone-400 dark:text-on-surface-variant text-xs font-label">{incident.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-headline font-bold text-on-surface-variant mb-2 group-hover:text-primary transition-colors uppercase">
                    {incident.tipo}
                  </h3>
                  
                  <p className="text-sm text-on-surface-variant font-body mb-6 line-clamp-2">
                    {incident.observacion || 'Sin observaciones adicionales registradas en la vista previa.'}
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

        {/* Responsive History View */}
        {!loading && activeView === 'incidents' && incidents.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant/10">
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">ID</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Tipo de Incidente</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Fecha</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Estado</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {(() => {
                    const filtered = incidents.filter(i => {
                      const term = filters.search.toLowerCase();
                      const matchesSearch = !term || 
                        i.id.toString().includes(term) ||
                        i.tipo.toLowerCase().includes(term);
                      
                      const matchesStatus = !filters.status || i.status === filters.status;
                      
                      const incidentDate = new Date(i.fecha);
                      const matchesStartDate = !filters.startDate || incidentDate >= new Date(filters.startDate);
                      const matchesEndDate = !filters.endDate || incidentDate <= new Date(filters.endDate);
                      
                      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan="5" className="py-20 text-center">
                            <p className="text-on-surface-variant font-body italic text-sm">No se encontraron solicitudes que coincidan.</p>
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((incident) => {
                      const statusStyle = statusIndicators[incident.status] || { color: 'bg-stone-500', text: 'text-stone-700', pulse: false };
                      return (
                        <tr key={incident.id} className="hover:bg-surface-container/30 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="font-label font-bold text-primary">#{incident.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-headline font-bold text-on-surface-variant uppercase text-sm">{incident.tipo}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setFilters({...filters, startDate: incident.rawDate, endDate: incident.rawDate});
                              }}
                              className="text-xs text-stone-500 dark:text-on-surface-variant font-label hover:text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors"
                              title="Filtrar por esta fecha"
                            >
                              {incident.date}
                            </button>
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
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-outline-variant/10">
              {(() => {
                const filtered = incidents.filter(i => {
                  const term = filters.search.toLowerCase();
                  const matchesSearch = !term || 
                    i.id.toString().includes(term) ||
                    i.tipo.toLowerCase().includes(term);
                  
                  const matchesStatus = !filters.status || i.status === filters.status;
                  
                  const incidentDate = new Date(i.fecha);
                  const matchesStartDate = !filters.startDate || incidentDate >= new Date(filters.startDate);
                  const matchesEndDate = !filters.endDate || incidentDate <= new Date(filters.endDate);
                  
                  return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-10 text-center bg-surface-container-lowest">
                      <p className="text-on-surface-variant font-body italic text-sm">No hay resultados.</p>
                    </div>
                  );
                }

                return filtered.map((incident) => {
                  const statusStyle = statusIndicators[incident.status] || { color: 'bg-stone-500', text: 'text-stone-700', pulse: false };
                  return (
                    <div 
                      key={incident.id} 
                      className="p-4 flex justify-between items-center bg-surface-container-lowest active:bg-surface-container transition-colors"
                      onClick={() => openModal(incident)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-label font-bold text-primary">#{incident.id}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilters({...filters, startDate: incident.rawDate, endDate: incident.rawDate});
                            }}
                            className="text-[10px] text-stone-400 dark:text-on-surface-variant font-label hover:text-primary px-1 transition-colors"
                          >
                            {incident.date}
                          </button>
                        </div>
                        <h4 className="font-headline font-bold text-on-surface-variant uppercase text-sm leading-tight">{incident.tipo}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.color}`}></span>
                          <span className={`text-[9px] font-label font-black uppercase ${statusStyle.text}`}>{incident.status}</span>
                          <span className="text-[9px] text-stone-400 dark:text-on-surface-variant font-label uppercase tracking-widest ml-1">• {incident.solicitante || 'Yo'}</span>
                        </div>
                      </div>
                      <button className="p-2 text-primary material-symbols-outlined">
                        chevron_right
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
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

export default MainContent;
