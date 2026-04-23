import React from 'react';

const MainContent = () => {
  return (
    <main className="md:ml-20 pt-24 px-6 md:px-10 pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none">
              Technical <span className="text-primary italic">Overview</span>
            </h1>
            <p className="text-stone-500 font-body text-lg max-w-md">Control panel for industrial maintenance operations and active technical incident reporting.</p>
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
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-white transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-red-100 text-red-800 text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter">Critical</span>
              <span className="text-stone-400 text-xs font-label">24 OCT 2023</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">Falla en Cinta Transportadora 04</h3>
            <p className="text-sm text-on-surface-variant font-body mb-6 line-clamp-2">Sobrecalentamiento en el motor principal del sector B-12. Se requiere inspección inmediata de los rodamientos.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-[10px] font-label font-bold uppercase text-amber-700">En revisión</span>
              </div>
              <button className="text-primary material-symbols-outlined hover:bg-primary-fixed p-1 rounded-full">arrow_forward</button>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-white transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-stone-100 text-stone-600 text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter">Maint</span>
              <span className="text-stone-400 text-xs font-label">22 OCT 2023</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">Calibración de Sensores PLC</h3>
            <p className="text-sm text-on-surface-variant font-body mb-6 line-clamp-2">Optimización de parámetros en la unidad de control lógico programable de la fundición central.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] font-label font-bold uppercase text-green-700">Listo</span>
              </div>
              <button className="text-primary material-symbols-outlined hover:bg-primary-fixed p-1 rounded-full">arrow_forward</button>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:bg-white transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-label font-black px-2 py-1 rounded-sm uppercase tracking-tighter">Update</span>
              <span className="text-stone-400 text-xs font-label">20 OCT 2023</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">Sistema Hidráulico Prensa 2</h3>
            <p className="text-sm text-on-surface-variant font-body mb-6 line-clamp-2">Pérdida de presión detectada en válvulas de retorno. Pendiente de repuestos importados.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                <span className="text-[10px] font-label font-bold uppercase text-stone-500">En espera</span>
              </div>
              <button className="text-primary material-symbols-outlined hover:bg-primary-fixed p-1 rounded-full">arrow_forward</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
