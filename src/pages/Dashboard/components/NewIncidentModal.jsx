import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const NewIncidentModal = () => {
  const [step, setStep] = useState('selection'); // 'selection' or 'form'
  const [incidentType, setIncidentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipos, setEquipos] = useState([]);
  
  const [formData, setFormData] = useState({
    cpu_fmo: '',
    so: '',
    tipo_falla: '',
    respaldo: false,
    ram: false,
    cpu: false,
    disco: false,
    tarj_video: false,
    pila: false,
    fuente: false,
    motherboard: false,
    tarj_red: false,
    cant_ram: '',
    usuario: '',
    password: '',
    observacion: '',
    // para el tipo general
    categoria: 'Maquinaria Pesada',
    descripcion: '',
    urgencia: 'Baja',
    area: '',
    // para periféricos y solicitudes
    tipo_solicitud: '',
    falla: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Fetch equipos and handle Reset state when modal closes
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch(`${API_URL}/equipos/`);
        if (response.ok) {
          const data = await response.json();
          setEquipos(data);
        }
      } catch (error) {
        console.error('Error fetching equipos:', error);
      }
    };
    fetchEquipos();

    const handleHashChange = () => {
      if (window.location.hash !== '#modal-new-incident') {
        setTimeout(() => {
          setStep('selection');
          setIncidentType('');
          setFormData({
            cpu_fmo: '',
            so: '',
            tipo_falla: '',
            respaldo: false,
            ram: false,
            cpu: false,
            disco: false,
            tarj_video: false,
            pila: false,
            fuente: false,
            motherboard: false,
            tarj_red: false,
            cant_ram: '',
            usuario: '',
            password: '',
            observacion: '',
            categoria: 'Maquinaria Pesada',
            descripcion: '',
            urgencia: 'Baja',
            area: '',
            tipo_solicitud: '',
            falla: ''
          });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mapear el tipo de incidente al formato que espera el backend
    const typeMap = {
      'Reparación de estaciones de trabajo': 'reparacion de estacion de trabajo',
      'Reparación de periférico': 'reparacion de periferico',
      'Solicitud': 'solicitud'
    };

    // Obtener el ID del usuario actual (si existe en localStorage)
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    if (!user) {
      alert('Error: No se detectó una sesión activa. Por favor, inicie sesión nuevamente.');
      setIsSubmitting(false);
      return;
    }

    const clienteId = user.ficha;

    const payload = {
      cliente: clienteId,
      tipo: typeMap[incidentType] || incidentType,
      workstationData: incidentType === 'Reparación de estaciones de trabajo' ? {
        cpu_fmo: parseInt(formData.cpu_fmo) || 0,
        tipo_falla: formData.tipo_falla,
        respaldo: formData.respaldo ? 1 : 0,
        ram: formData.ram ? 1 : 0,
        cant_ram: parseInt(formData.cant_ram) || 0,
        cpu: formData.cpu ? 1 : 0,
        so: formData.so,
        disco: formData.disco ? 1 : 0,
        tarj_video: formData.tarj_video ? 1 : 0,
        pila: formData.pila ? 1 : 0,
        fuente: formData.fuente ? 1 : 0,
        motherboard: formData.motherboard ? 1 : 0,
        tarj_red: formData.tarj_red ? 1 : 0,
        observacion: formData.observacion,
        usuario: formData.usuario,
        password: formData.password
      } : null,
      peripheralData: incidentType === 'Reparación de periférico' ? {
        tipo_solicitud: formData.tipo_solicitud,
        falla: formData.falla
      } : null,
      solicitudData: incidentType === 'Solicitud' ? {
        tipo_solicitud: formData.tipo_solicitud,
        descripcion: formData.descripcion
      } : null
    };

    try {
      const response = await fetch(`${API_URL}/incidentes/crear/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Incidente creado con éxito. ID: ' + (result.id || 'Generado'));
        
        // Disparar evento para recargar la lista en el dashboard
        window.dispatchEvent(new Event('incident-created'));
        
        window.location.hash = '#'; // Cerrar modal
      } else {
        const errorData = await response.json();
        alert('Error al crear el incidente: ' + (errorData.message || 'Intente de nuevo'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
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
            <form className="p-8 space-y-8" onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-4 -mt-2">
                <button type="button" onClick={() => setStep('selection')} className="text-xs font-label text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span> Volver a selección
                </button>
              </div>

              {incidentType === 'Reparación de estaciones de trabajo' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Seleccionar Equipo (FMO)</label>
                      <select name="cpu_fmo" value={formData.cpu_fmo} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required>
                        <option value="">Seleccione un equipo</option>
                        {equipos.map(equipo => (
                          <option key={equipo.fmo} value={equipo.fmo}>
                            {equipo.fmo} - {equipo.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Sistema Operativo</label>
                      <input name="so" value={formData.so} onChange={handleChange} type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: Windows 10, Linux..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tipo de Falla</label>
                    <textarea name="tipo_falla" value={formData.tipo_falla} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Describa el problema observado..." rows="2" required></textarea>
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
                          <input name={item.id} checked={formData[item.id]} onChange={handleChange} type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary border-stone-300" />
                          <span className="text-xs font-body text-on-surface-variant group-hover:text-primary transition-colors">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Cantidad RAM (GB)</label>
                      <input name="cant_ram" value={formData.cant_ram} onChange={handleChange} type="number" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: 8" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Usuario / Credenciales</label>
                      <input name="usuario" value={formData.usuario} onChange={handleChange} type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Usuario" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Contraseña</label>
                    <input name="password" value={formData.password} onChange={handleChange} type="password" title="Contraseña" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Observaciones Adicionales</label>
                    <textarea name="observacion" value={formData.observacion} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Cualquier detalle relevante..." rows="3"></textarea>
                  </div>
                </div>
              ) : incidentType === 'Reparación de periférico' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tipo de Periférico</label>
                    <select name="tipo_solicitud" value={formData.tipo_solicitud} onChange={handleChange} title="Tipo de Periférico" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required>
                      <option value="">Seleccione un periférico</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Teclado">Teclado</option>
                      <option value="Mouse">Mouse</option>
                      <option value="Impresora">Impresora</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Falla Reportada</label>
                    <textarea name="falla" value={formData.falla} onChange={handleChange} title="Falla Reportada" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Describa el problema del periférico..." rows="4" required></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tipo de Solicitud</label>
                    <select name="tipo_solicitud" value={formData.tipo_solicitud} onChange={handleChange} title="Tipo de Solicitud" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required>
                      <option value="">Seleccione el tipo</option>
                      <option value="Nuevo Equipo">Nuevo Equipo / Periférico</option>
                      <option value="Software">Instalación de Software</option>
                      <option value="Acceso">Acceso a Sistemas</option>
                      <option value="Insumos">Insumos (Tóner, Papel, etc.)</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Descripción y Justificación</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} title="Descripción" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Detalle su solicitud y la razón de la misma..." rows="4" required></textarea>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-4 shrink-0">
                <a className="flex-1 flex items-center justify-center py-4 text-stone-500 font-headline font-bold text-sm uppercase tracking-wider rounded-md bg-stone-100 hover:bg-stone-200 transition-colors" href="#">
                  Cancelar
                </a>
                <button disabled={isSubmitting} className="flex-[2] py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm uppercase tracking-wider rounded-md transition-transform active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100" type="submit">
                  {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
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
