import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const EquiposContent = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const openHistory = async (equipo) => {
    setSelectedEquipo(equipo);
    setHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const response = await fetch(`${API_URL}/equipos/${equipo.fmo}/historial`);
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setHistoryData([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchEquipos = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_URL}/equipos/?ficha=${user?.ficha}&rol=${user?.rol}`);
      if (response.ok) {
        const data = await response.json();
        setEquipos(data);
      }
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setEquipos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
    const handleRefresh = () => fetchEquipos();
    window.addEventListener('workstation-created', handleRefresh);
    return () => window.removeEventListener('workstation-created', handleRefresh);
  }, []);

  const handleDeleteEquipo = async (fmo) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el equipo #${fmo}? Esta acción no se puede deshacer.`)) return;
    
    try {
      const response = await fetch(`${API_URL}/equipos/${fmo}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setEquipos(prev => prev.filter(e => e.fmo !== fmo));
      }
    } catch (error) {
      console.error("Error deleting equipo:", error);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = currentUser?.rol?.toLowerCase() === 'administrador';

  return (
    <main className="md:ml-20 pt-16 md:pt-24 px-4 md:px-10 pb-20 md:pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface-variant uppercase tracking-tighter leading-none">
              Gestión de <span className="text-primary italic">Equipos</span>
            </h1>
          </div>

          <div className="w-full md:max-w-md relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre, tipo, marca, área..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-surface-container-low border-none rounded-xl text-on-surface-variant font-body focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-400/60"
            />
          </div>
          
          <a 
            href="#modal-new-workstation"
            className="flex items-center gap-2 bg-primary text-on-primary px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-headline font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-primary/20 text-xs md:text-base"
          >
            <span className="material-symbols-outlined">add</span>
            Agregar Equipo
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : equipos.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/20">
             <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">desktop_windows</span>
             <p className="text-on-surface-variant font-body uppercase tracking-widest text-sm">No se encontraron equipos registrados.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant/10">
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">FMO</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Nombre / Identificador</th>
                    {isAdmin && <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Propietario</th>}
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Área</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Marca</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Serial</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {(() => {
                    const filtered = equipos.filter(equipo => {
                      const term = searchTerm.toLowerCase();
                      return (
                        equipo.nombre?.toLowerCase().includes(term) ||
                        equipo.tipo?.toLowerCase().includes(term) ||
                        equipo.propietario_nombre?.toLowerCase().includes(term) ||
                        equipo.marca_nombre?.toLowerCase().includes(term) ||
                        equipo.area_nombre?.toLowerCase().includes(term) ||
                        equipo.fmo?.toString().includes(term)
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={isAdmin ? 8 : 7} className="py-20 text-center">
                            <p className="text-on-surface-variant font-body italic">No se encontraron equipos que coincidan con la búsqueda.</p>
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((equipo) => (
                      <tr key={equipo.fmo} className="hover:bg-surface-container/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-label font-bold text-primary">#{equipo.fmo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-label font-black uppercase bg-surface-container-high text-on-surface-variant px-2 py-1 rounded tracking-tighter">
                            {equipo.tipo || 'Desconocido'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-stone-300 text-lg">
                              {equipo.tipo === 'estacion de trabajo' ? 'desktop_windows' : 'devices_other'}
                            </span>
                            <span className="font-headline font-bold text-on-surface-variant uppercase text-sm">{equipo.nombre}</span>
                          </div>
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4">
                            <span className="text-xs text-primary font-bold uppercase tracking-tighter">
                              {equipo.propietario_nombre || 'Sin asignar'}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <span className="text-sm text-on-surface-variant font-body uppercase">{equipo.area_nombre || 'Sin área'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded text-[10px] font-label font-black uppercase tracking-tighter">
                            {equipo.marca_nombre || 'Genérica'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-stone-400 dark:text-on-surface-variant font-label tracking-tight">{equipo.serial}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openHistory(equipo)} className="p-2 text-stone-400 dark:text-on-surface-variant hover:text-blue-500 transition-colors rounded-full hover:bg-surface-container/50" title="Ver Historial">
                              <span className="material-symbols-outlined text-xl">history</span>
                            </button>
                            <button className="p-2 text-stone-400 dark:text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container/50">
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteEquipo(equipo.fmo)}
                              className="p-2 text-stone-400 dark:text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-surface-container/50"
                              title="Eliminar Equipo"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-outline-variant/10">
              {(() => {
                const filtered = equipos.filter(equipo => {
                  const term = searchTerm.toLowerCase();
                  return (
                    equipo.nombre?.toLowerCase().includes(term) ||
                    equipo.tipo?.toLowerCase().includes(term) ||
                    equipo.propietario_nombre?.toLowerCase().includes(term) ||
                    equipo.marca_nombre?.toLowerCase().includes(term) ||
                    equipo.area_nombre?.toLowerCase().includes(term) ||
                    equipo.fmo?.toString().includes(term)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-10 text-center bg-surface-container-lowest">
                      <p className="text-on-surface-variant font-body italic text-sm">No se encontraron equipos que coincidan.</p>
                    </div>
                  );
                }

                return filtered.map((equipo) => (
                  <div key={equipo.fmo} className="p-4 bg-surface-container-lowest">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-label font-bold text-primary">#{equipo.fmo}</span>
                        <h4 className="font-headline font-bold text-on-surface-variant uppercase text-sm leading-tight">{equipo.nombre}</h4>
                      </div>
                      <span className="text-[9px] font-label font-black uppercase bg-surface-container text-stone-400 dark:text-on-surface-variant px-2 py-1 rounded">
                        {equipo.tipo}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-stone-400 text-sm">location_on</span>
                        <span className="text-[10px] font-label text-stone-500 dark:text-on-surface-variant uppercase tracking-widest">{equipo.area_nombre || 'Sin área'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-stone-400 text-sm">branding_watermark</span>
                        <span className="text-[10px] font-label text-stone-500 dark:text-on-surface-variant uppercase tracking-widest">{equipo.marca_nombre || 'Genérica'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/5">
                      <div className="flex gap-1">
                        <button onClick={() => openHistory(equipo)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md">
                            <span className="material-symbols-outlined text-sm">history</span>
                            <span className="text-[9px] font-black uppercase">Historial</span>
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-stone-400 dark:text-on-surface-variant material-symbols-outlined">edit</button>
                        <button onClick={() => handleDeleteEquipo(equipo.fmo)} className="p-2 text-red-400 material-symbols-outlined">delete</button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </section>

      {/* Equipment History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-lowest">
              <div>
                <h2 className="text-2xl font-headline font-bold text-on-surface-variant">Historial de Mantenimiento</h2>
                <p className="text-sm font-label text-stone-500 dark:text-on-surface-variant mt-1">Equipo #{selectedEquipo?.fmo} - {selectedEquipo?.nombre}</p>
              </div>
              <button 
                onClick={() => setHistoryModalOpen(false)}
                className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors"
              >
                close
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-on-surface-variant">
              {loadingHistory ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-10 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/20">
                  <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">history_toggle_off</span>
                  <p className="text-on-surface-variant font-body">No hay registros de incidentes para este equipo.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyData.map(inc => (
                    <div key={inc.id} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-label font-black text-primary uppercase tracking-widest">INCIDENTE #{inc.id}</span>
                          <span className="text-xs font-label text-stone-500 font-bold">{new Date(inc.fecha).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-[9px] font-label font-black uppercase tracking-tighter ${
                          inc.status === 'Completado' ? 'bg-green-100 text-green-700' : 
                          inc.status === 'En Proceso' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {inc.status}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-headline font-black text-on-surface-variant uppercase mb-2 leading-tight">{inc.tipo}</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mb-1">Descripción / Falla</p>
                          <p className="text-sm text-on-surface-variant font-body leading-relaxed">
                            {inc.workstation_falla || inc.periferico_falla || 'Sin descripción de falla'}
                          </p>
                        </div>
                        
                        {inc.observacion && (
                          <div>
                            <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest mb-1">Resolución / Notas</p>
                            <p className="text-sm text-on-surface-variant font-body italic border-l-2 border-primary/20 pl-3 py-1 bg-surface-container/30 rounded-r-lg">
                              {inc.observacion}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 pt-2 border-t border-outline-variant/5">
                          <div>
                            <p className="text-[9px] font-label font-bold text-stone-400 uppercase tracking-widest">Solicitante</p>
                            <p className="text-[11px] font-headline font-bold text-on-surface-variant uppercase">{inc.solicitante || 'Desconocido'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-label font-bold text-stone-400 uppercase tracking-widest">Técnico</p>
                            <p className="text-[11px] font-headline font-bold text-primary uppercase">{inc.encargado_nombre || 'Sin asignar'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EquiposContent;
