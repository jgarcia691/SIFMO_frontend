import React, { useState } from 'react';
import IncidentDetailsModal from './IncidentDetailsModal';

const mockIncidents = [
  {
    id: "INC-2023-001",
    date: "24 OCT 2023",
    title: "Falla en Cinta Transportadora 04",
    description: "Sobrecalentamiento en el motor principal del sector B-12. Se requiere inspección inmediata de los rodamientos y posible reemplazo de piezas desgastadas. La cinta se encuentra detenida por seguridad.",
    status: "En revisión",
    type: "Critical",
    area: "Producción - Sector B",
    requester: "Juan Pérez"
  },
  {
    id: "INC-2023-002",
    date: "22 OCT 2023",
    title: "Calibración de Sensores PLC",
    description: "Optimización de parámetros en la unidad de control lógico programable de la fundición central. Los valores de temperatura mostraban variaciones anómalas durante el último turno.",
    status: "Listo",
    type: "Maint",
    area: "Mantenimiento Eléctrico",
    requester: "María Gómez"
  },
  {
    id: "INC-2023-003",
    date: "20 OCT 2023",
    title: "Sistema Hidráulico Prensa 2",
    description: "Pérdida de presión detectada en válvulas de retorno. Pendiente de repuestos importados. El proveedor estima llegada de las válvulas para el próximo martes.",
    status: "En espera",
    type: "Update",
    area: "Mecánica Pesada",
    requester: "Carlos Rodríguez"
  }
];

const MainContent = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedIncident(null), 200); // clear after animation
  };

  const typeColors = {
    'Critical': 'bg-red-100 text-red-800',
    'Maint': 'bg-stone-100 text-stone-600',
    'Update': 'bg-blue-100 text-blue-800'
  };

  const statusIndicators = {
    'En revisión': { color: 'bg-amber-500', text: 'text-amber-700', pulse: true },
    'Listo': { color: 'bg-green-500', text: 'text-green-700', pulse: false },
    'En espera': { color: 'bg-stone-400', text: 'text-stone-500', pulse: false }
  };

  return (
    <main className="md:ml-20 pt-24 px-6 md:px-10 pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none">
              Panel de <span className="text-primary italic">Control</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-lg">
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-label font-bold uppercase text-stone-400 tracking-widest">Active Reports</p>
              <p className="text-2xl font-headline font-bold text-on-surface">12</p>
            </div>
            <div className="w-[1px] h-10 bg-stone-200"></div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-label font-bold uppercase text-stone-400 tracking-widest">Avg. Response</p>
              <p className="text-2xl font-headline font-bold text-primary">2.4h</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockIncidents.map((incident) => {
            const statusStyle = statusIndicators[incident.status] || { color: 'bg-stone-500', text: 'text-stone-700', pulse: false };
            const typeClass = typeColors[incident.type] || 'bg-stone-100 text-stone-800';

            return (
              <div 
                key={incident.id} 
                className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-white transition-colors duration-300 cursor-pointer"
                onClick={() => openModal(incident)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-label font-bold text-stone-400">#{incident.id}</span>
                    <span className={`${typeClass} text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter w-fit`}>
                      {incident.type}
                    </span>
                  </div>
                  <span className="text-stone-400 text-xs font-label">{incident.date}</span>
                </div>
                
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                  {incident.title}
                </h3>
                
                <p className="text-sm text-on-surface-variant font-body mb-6 line-clamp-2">
                  {incident.description}
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
