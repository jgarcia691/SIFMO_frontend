import React, { useState, useEffect } from 'react';
import IncidentDetailsModal from '../modals/IncidentDetailsModal';
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
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [dashboardTab, setDashboardTab] = useState('pendientes');

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
            })(),
            rawDate: inc.fecha ? new Date(inc.fecha).toISOString().split('T')[0] : ''
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
    <main className="md:ml-20 pt-16 md:pt-24 px-4 md:px-10 pb-32 md:pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface-variant uppercase tracking-tighter leading-none mb-2">
              Panel de <span className="text-primary italic">Control</span>
            </h1>
            <p className="text-stone-500 dark:text-on-surface-variant font-label uppercase tracking-widest text-xs">Administración Global SGI-FMO</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4 bg-surface-container-low p-2 md:p-3 rounded-2xl border border-outline-variant/10 scale-90 md:scale-100 origin-left">
            <div className="px-3 md:px-4 text-center">
              <p className="text-[8px] md:text-[10px] font-label font-bold text-stone-400 dark:text-on-surface-variant uppercase tracking-widest">Total</p>
              <p className="text-xl md:text-2xl font-headline font-bold text-on-surface-variant">{stats.total}</p>
            </div>
            <div className="w-[1px] h-8 md:h-10 bg-outline-variant/20"></div>
            <div className="px-3 md:px-4 text-center">
              <p className="text-[8px] md:text-[10px] font-label font-bold text-amber-500 uppercase tracking-widest">Espera</p>
              <p className="text-xl md:text-2xl font-headline font-bold text-on-surface-variant">{stats.pending}</p>
            </div>
            <div className="w-[1px] h-8 md:h-10 bg-outline-variant/20"></div>
            <div className="px-3 md:px-4 text-center">
              <p className="text-[8px] md:text-[10px] font-label font-bold text-green-600 uppercase tracking-widest">Listos</p>
              <p className="text-xl md:text-2xl font-headline font-bold text-on-surface-variant">{stats.resolved}</p>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface-variant uppercase tracking-tight">
                {activeView === 'incidents' ? (
                  <>Historial de <span className="text-primary">Incidencias</span></>
                ) : (
                  <>Incidencias <span className="text-primary">Pendientes</span></>
                )}
              </h2>
              <p className="text-xs text-stone-500 dark:text-on-surface-variant font-label uppercase tracking-widest">
                {activeView === 'incidents' ? 'Todos los registros' : 'Todos los departamentos'}
              </p>
            </div>

            {activeView === 'incidents' && (
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar por ID, Tipo, Ficha..." 
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs font-body focus:ring-1 focus:ring-primary/30"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
                
                <select 
                  className="bg-surface-container-low border-none rounded-lg text-xs font-label px-4 py-2 focus:ring-1 focus:ring-primary/30 outline-none"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Todos los Estados</option>
                  {Object.keys(statusIndicators).map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg">
                  <input 
                    type="date" 
                    className="bg-transparent border-none text-[10px] font-label px-2 py-1 focus:ring-0"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  />
                  <span className="text-stone-400">/</span>
                  <input 
                    type="date" 
                    className="bg-transparent border-none text-[10px] font-label px-2 py-1 focus:ring-0"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  />
                </div>
                
                {(filters.search || filters.status || filters.startDate || filters.endDate) && (
                  <button 
                    onClick={() => setFilters({ search: '', department: '', status: '', startDate: '', endDate: '' })}
                    className="text-primary material-symbols-outlined hover:bg-primary/10 p-2 rounded-full transition-colors"
                    title="Limpiar Filtros"
                  >
                    filter_list_off
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeView !== 'incidents' && (
              <div className="flex flex-wrap gap-3 mb-6">
                <button 
                  onClick={() => setDashboardTab('pendientes')}
                  className={`px-5 py-2.5 text-[10px] font-label font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 ${dashboardTab === 'pendientes' ? 'bg-primary text-on-primary shadow-md shadow-primary/20 scale-105' : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                  Pendientes / En Revisión
                </button>
                <button 
                  onClick={() => setDashboardTab('listos')}
                  className={`px-5 py-2.5 text-[10px] font-label font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 ${dashboardTab === 'listos' ? 'bg-green-600 text-white shadow-md shadow-green-600/20 scale-105' : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Listos
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {incidents
                .filter(i => {
                  if (activeView === 'incidents') return true;
                  if (dashboardTab === 'pendientes') {
                    return i.status === 'Pendiente' || i.status === 'En revisión' || i.status === 'En espera';
                  } else if (dashboardTab === 'listos') {
                    return i.status === 'Listo';
                  }
                  return false;
                })
              .map((incident) => {
              const statusStyle = statusIndicators[incident.status] || { color: 'bg-outline-variant/20', text: 'text-stone-700', pulse: false };
              const typeClass = typeColors[incident.tipo] || 'bg-surface-container text-stone-800';

              if (activeView === 'incidents') return null; // We render the table below for this view

              return (
                <div 
                  key={incident.id} 
                  className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-surface-container transition-colors duration-300 cursor-pointer flex flex-col"
                  onClick={() => openModal(incident)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-label font-bold text-stone-400 dark:text-on-surface-variant"># {incident.id} • SOLICITANTE: {incident.solicitante || incident.cliente}</span>
                      <div className="flex items-center gap-2">
                        <span className={`${typeClass} text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter w-fit`}>
                          {incident.tipo}
                        </span>
                        {incident.encargado_nombre && (
                          <span className="text-[10px] font-label font-bold text-primary bg-primary/5 px-2 py-1 rounded-sm border border-primary/10 uppercase tracking-tighter">
                            Asignado: {incident.encargado_nombre}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-stone-400 dark:text-on-surface-variant text-xs font-label">{incident.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-headline font-bold text-on-surface-variant mb-2 group-hover:text-primary transition-colors uppercase">
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
          </>
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
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Tipo / Solicitante</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Departamento</th>
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
                        i.tipo.toLowerCase().includes(term) ||
                        i.solicitante?.toLowerCase().includes(term) ||
                        i.cliente?.toString().includes(term);
                      
                      const matchesStatus = !filters.status || i.status === filters.status;
                      
                      const incidentDate = new Date(i.fecha);
                      const matchesStartDate = !filters.startDate || incidentDate >= new Date(filters.startDate);
                      const matchesEndDate = !filters.endDate || incidentDate <= new Date(filters.endDate);
                      
                      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan="6" className="py-20 text-center">
                            <p className="text-on-surface-variant font-body italic text-sm">No se encontraron incidentes que coincidan con los filtros.</p>
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
                            <div className="flex flex-col">
                              <span className="font-headline font-bold text-on-surface-variant uppercase text-sm">{incident.tipo}</span>
                              <span className="text-[10px] font-label text-stone-400 dark:text-on-surface-variant uppercase">{incident.solicitante} ({incident.cliente})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-on-surface-variant font-body uppercase">{incident.area || 'N/A'}</span>
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
                    i.tipo.toLowerCase().includes(term) ||
                    i.solicitante?.toLowerCase().includes(term);
                  
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
                      <div className="flex flex-col gap-1 pr-4 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-label font-bold text-primary">#{incident.id}</span>
                          <span className="text-[10px] text-stone-400 font-label">{incident.date}</span>
                        </div>
                        <h4 className="font-headline font-bold text-on-surface-variant uppercase text-sm leading-tight truncate">{incident.tipo}</h4>
                        <p className="text-[11px] text-stone-500 font-body truncate">{incident.solicitante}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.color}`}></span>
                          <span className={`text-[9px] font-label font-black uppercase ${statusStyle.text}`}>{incident.status}</span>
                          <span className="text-[9px] text-stone-400 font-label uppercase tracking-widest ml-1">• {incident.area || 'N/A'}</span>
                        </div>
                      </div>
                      <button className="p-2 text-primary material-symbols-outlined flex-shrink-0">
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

export default AdminContent;
