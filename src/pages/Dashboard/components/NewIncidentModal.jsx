import React from 'react';

const NewIncidentModal = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 opacity-0 pointer-events-none transition-opacity duration-300 target:opacity-100 target:pointer-events-auto" id="modal-new-incident">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative">
        <div className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight uppercase">Nueva Solicitud</h2>
            <p className="text-xs font-label text-stone-500 tracking-widest uppercase">Reporte Técnico de Planta</p>
          </div>
          <a className="material-symbols-outlined text-stone-400 hover:text-primary transition-colors" href="#">close</a>
        </div>
        <form className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Categoría del Problema</label>
            <select className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all">
              <option>Maquinaria Pesada</option>
              <option>Sistemas Eléctricos</option>
              <option>Software / PLC</option>
              <option>Infraestructura Civil</option>
              <option>Seguridad Industrial</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Descripción Detallada</label>
            <textarea className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Describa los síntomas observados y el código de error si está disponible..." rows="4"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Urgencia</label>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-tighter border border-stone-200 rounded hover:bg-stone-100" type="button">Baja</button>
                <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-tighter bg-primary text-white rounded" type="button">Crítica</button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Área / Sector</label>
              <input className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: B-12 Fundición" type="text" />
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <a className="flex-1 flex items-center justify-center py-4 text-stone-500 font-headline font-bold text-sm uppercase tracking-wider rounded-md bg-stone-100 hover:bg-stone-200 transition-colors" href="#">
              Cancelar
            </a>
            <button className="flex-[2] py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm uppercase tracking-wider rounded-md transition-transform active:scale-95 shadow-lg shadow-primary/20" type="button">
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIncidentModal;
