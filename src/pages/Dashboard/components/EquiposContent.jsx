import React, { useState, useEffect } from 'react';

const EquiposContent = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/equipos/');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipos.map((equipo) => {
              const statusClass = statusColors[equipo.status] || 'bg-stone-100 text-stone-800';
              return (
                <div 
                  key={equipo.fmo} 
                  className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-white transition-colors duration-300 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-label font-bold text-stone-400">FMO #{equipo.fmo}</span>
                      <span className={`${statusClass} text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter w-fit`}>
                        {equipo.status || 'Operativo'}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-stone-300">computer</span>
                  </div>
                  
                  <h3 className="text-xl font-headline font-bold text-on-surface mb-2 uppercase">
                    {equipo.nombre}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {equipo.area || 'Sin área registrada'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                      <span className="material-symbols-outlined text-xs">barcode</span>
                      S/N: {equipo.serial || 'Sin serial'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end mt-auto gap-2">
                    <button className="text-stone-400 material-symbols-outlined hover:text-primary transition-colors p-2 rounded-full hover:bg-stone-50">
                      edit
                    </button>
                    <button className="text-stone-400 material-symbols-outlined hover:text-error transition-colors p-2 rounded-full hover:bg-stone-50">
                      delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default EquiposContent;
