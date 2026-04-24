import React, { useState, useEffect } from 'react';

const NewIncidentModal = () => {
  const [step, setStep] = useState('selection'); // 'selection' or 'form'
  const [incidentType, setIncidentType] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash !== '#modal-new-incident') {
        setTimeout(() => {
          setStep('selection');
          setIncidentType('');
        }, 300); // Wait for transition
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectType = (type) => {
    setIncidentType(type);
    setStep('form');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 opacity-0 pointer-events-none transition-opacity duration-300 target:opacity-100 target:pointer-events-auto" id="modal-new-incident">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <div className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight uppercase">
              {step === 'selection' ? 'Tipo de Solicitud' : 'Nueva Solicitud'}
            </h2>
            <p className="text-xs font-label text-stone-500 tracking-widest uppercase">
              {step === 'selection' ? 'Seleccione una opción' : incidentType}
            </p>
          </div>
          <a className="material-symbols-outlined text-stone-400 hover:text-primary transition-colors" href="#">close</a>
        </div>
        
        <div className="overflow-y-auto">
          {step === 'selection' && (
            <div className="p-8 space-y-4">
              <button onClick={() => handleSelectType('Reparación de estaciones de trabajo')} className="w-full text-left p-6 rounded-xl border border-stone-200 hover:border-primary hover:bg-surface-container-lowest transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-fixed p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">desktop_windows</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-lg">Reparación de estaciones de trabajo</h3>
                    <p className="text-sm font-body text-stone-500">Reporte de fallas en CPUs y estaciones de trabajo de la planta.</p>
                  </div>
                </div>
              </button>
              <button onClick={() => handleSelectType('Reparación de periférico')} className="w-full text-left p-6 rounded-xl border border-stone-200 hover:border-primary hover:bg-surface-container-lowest transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-fixed p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">mouse</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-lg">Reparación de periférico</h3>
                    <p className="text-sm font-body text-stone-500">Fallas en monitores, teclados u otros periféricos.</p>
                  </div>
                </div>
              </button>
              <button onClick={() => handleSelectType('Solicitud')} className="w-full text-left p-6 rounded-xl border border-stone-200 hover:border-primary hover:bg-surface-container-lowest transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-fixed p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-lg">Solicitud</h3>
                    <p className="text-sm font-body text-stone-500">Requerimientos de nuevos accesos, software o insumos.</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 'form' && (
            <form className="p-8 space-y-8">
              <div className="flex items-center gap-2 mb-4 -mt-2">
                <button type="button" onClick={() => setStep('selection')} className="text-xs font-label text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span> Volver a selección
                </button>
              </div>

              {incidentType === 'Reparación de estaciones de trabajo' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">CPU FMO #</label>
                      <input type="number" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: 12345" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Sistema Operativo</label>
                      <input type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: Windows 10, Linux..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tipo de Falla</label>
                    <textarea className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Describa el problema observado..." rows="2"></textarea>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-4">Revisión de Hardware / Componentes</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                      {[
                        { id: 'respaldo', label: 'Respaldo' },
                        { id: 'ram', label: 'Memoria RAM' },
                        { id: 'cpu', label: 'Procesador' },
                        { id: 'disco', label: 'Disco Duro' },
                        { id: 'tarj_video', label: 'Tarj. Video' },
                        { id: 'pila', label: 'Pila BIOS' },
                        { id: 'fuente', label: 'Fuente Poder' },
                        { id: 'motherboard', label: 'Motherboard' },
                        { id: 'tarj_red', label: 'Tarj. Red' },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary border-stone-300" />
                          <span className="text-xs font-body text-on-surface-variant group-hover:text-primary transition-colors">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Cantidad RAM (GB)</label>
                      <input type="number" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: 8" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Usuario / Credenciales</label>
                      <input type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Usuario" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Contraseña</label>
                    <input type="password" title="Contraseña" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Observaciones Adicionales</label>
                    <textarea className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Cualquier detalle relevante..." rows="3"></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Categoría del Problema</label>
                    <select title="Categoría" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all">
                      <option>Maquinaria Pesada</option>
                      <option>Sistemas Eléctricos</option>
                      <option>Software / PLC</option>
                      <option>Infraestructura Civil</option>
                      <option>Seguridad Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Descripción Detallada</label>
                    <textarea title="Descripción" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Describa los síntomas observados..." rows="4"></textarea>
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
                      <input type="text" title="Área" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: B-12 Fundición" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-4 shrink-0">
                <a className="flex-1 flex items-center justify-center py-4 text-stone-500 font-headline font-bold text-sm uppercase tracking-wider rounded-md bg-stone-100 hover:bg-stone-200 transition-colors" href="#">
                  Cancelar
                </a>
                <button className="flex-[2] py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm uppercase tracking-wider rounded-md transition-transform active:scale-95 shadow-lg shadow-primary/20" type="button">
                  Enviar Reporte
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewIncidentModal;
