import React, { useState, useEffect } from 'react';
import IncidentDetailsModal from './IncidentDetailsModal';

const MainContent = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        if (!user) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3000/api/incidentes/listar/cliente/${user.ficha}`);
        if (response.ok) {
          const data = await response.json();
          // Formatear fechas para que se vean bien
          const formattedData = data.map(inc => ({
            ...inc,
            date: new Date(inc.fecha).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }).toUpperCase()
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
    
    // Opcional: Escuchar eventos de creación para recargar (por ahora recarga al montar)
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
    setTimeout(() => setSelectedIncident(null), 200); // clear after animation
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none">
              Mis <span className="text-primary italic">Solicitudes</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-lg">
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-label font-bold uppercase text-stone-400 tracking-widest">Total Reportes</p>
              <p className="text-2xl font-headline font-bold text-on-surface">{incidents.length}</p>
            </div>
            <div className="w-[1px] h-10 bg-stone-200"></div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-label font-bold uppercase text-stone-400 tracking-widest">Pendientes</p>
              <p className="text-2xl font-headline font-bold text-primary">
                {incidents.filter(i => i.status === 'Pendiente' || i.status === 'En revisión').length}
              </p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-stone-200">
             <span className="material-symbols-outlined text-stone-300 text-6xl mb-4">folder_open</span>
             <p className="text-on-surface-variant font-body">No se encontraron solicitudes registradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {incidents.map((incident) => {
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
                      <span className="text-[10px] font-label font-bold text-stone-400">SOLICITUD #{incident.id}</span>
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
