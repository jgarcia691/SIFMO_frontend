import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const EquiposContent = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch(`${API_URL}/equipos/`);
        if (response.ok) {
          const data = await response.json();
          setEquipos(data);
        } else {
          setEquipos([
            { fmo: 10245, nombre: 'PC-ADMIN-01', serial: 'SN-123', status: 'Operativo', area: 'Administración' },
            { fmo: 10289, nombre: 'PC-PLANTA-02', serial: 'SN-456', status: 'En mantenimiento', area: 'Fundición' }
          ]);
        }
      } catch (error) {
        console.error('Error al cargar equipos:', error);
        setEquipos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
    
    const handleRefresh = () => fetchEquipos();
    window.addEventListener('workstation-created', handleRefresh);
    return () => window.removeEventListener('workstation-created', handleRefresh);
  }, []);

  const statusColors = {
    'Operativo': 'bg-green-100 text-green-800',
    'En mantenimiento': 'bg-amber-100 text-amber-800',
    'Fuera de servicio': 'bg-red-100 text-red-800'
  };

  return (
    <main className="md:ml-20 pt-24 px-6 md:px-10 pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none">
              Gestión de <span className="text-primary italic">Equipos</span>
            </h1>
          </div>
          
          <a 
            href="#modal-new-workstation"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-headline font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-primary/20"
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
          <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-stone-200">
             <span className="material-symbols-outlined text-stone-300 text-6xl mb-4">desktop_windows</span>
             <p className="text-on-surface-variant font-body">No se encontraron equipos registrados.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">FMO</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Nombre / Identificador</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Área</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Marca</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Serial</th>
                  <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {equipos.map((equipo) => (
                  <tr key={equipo.fmo} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-label font-bold text-primary">#{equipo.fmo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-stone-300 text-lg">computer</span>
                        <span className="font-headline font-bold text-on-surface uppercase text-sm">{equipo.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface-variant font-body">{equipo.area_nombre || 'Sin área'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-[10px] font-label font-black uppercase tracking-tighter">
                        {equipo.marca_nombre || 'Genérica'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-stone-400 font-label tracking-tight">{equipo.serial}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openHistory(equipo)} className="p-2 text-stone-400 hover:text-blue-500 transition-colors rounded-full hover:bg-stone-100" title="Ver Historial">
                          <span className="material-symbols-outlined text-xl">history</span>
                        </button>
                        <button className="p-2 text-stone-400 hover:text-primary transition-colors rounded-full hover:bg-stone-100">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button className="p-2 text-stone-400 hover:text-error transition-colors rounded-full hover:bg-stone-100">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Equipment History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-lowest">
              <div>
                <h2 className="text-2xl font-headline font-bold text-on-surface">Historial de Mantenimiento</h2>
                <p className="text-sm font-label text-stone-500 mt-1">Equipo #{selectedEquipo?.fmo} - {selectedEquipo?.nombre}</p>
              </div>
              <button 
                onClick={() => setHistoryModalOpen(false)}
                className="material-symbols-outlined text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors"
              >
                close
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {loadingHistory ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-10 bg-surface-container-lowest rounded-xl border border-dashed border-stone-200">
                  <span className="material-symbols-outlined text-stone-300 text-4xl mb-2">history_toggle_off</span>
                  <p className="text-on-surface-variant font-body">No hay registros de incidentes para este equipo.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyData.map(inc => (
                    <div key={inc.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-label font-bold text-primary uppercase tracking-widest">INCIDENTE #{inc.id}</span>
                        <span className="text-xs font-label text-stone-500">{new Date(inc.fecha).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm font-headline font-bold text-on-surface uppercase mb-1">{inc.tipo}</h3>
                      <p className="text-sm text-on-surface-variant font-body">{inc.observacion || inc.tipo_falla || 'Sin detalles adicionales'}</p>
                      <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-[10px] font-label font-black uppercase tracking-tighter">
                          {inc.status}
                        </span>
                        {inc.solicitante && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-label font-black uppercase tracking-tighter">
                            Usuario: {inc.solicitante}
                          </span>
                        )}
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
