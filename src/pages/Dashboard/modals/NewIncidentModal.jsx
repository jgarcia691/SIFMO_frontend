import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';

const NewIncidentModal = () => {
  const [step, setStep] = useState('selection'); // 'selection' or 'form'
  const [incidentType, setIncidentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [isOsDropdownOpen, setIsOsDropdownOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', redirectHash: '' });
  
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
    falla: '',
    fmo: ''
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
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const response = await fetch(`${API_URL}/equipos/?ficha=${user?.ficha}&rol=${user?.rol}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Equipos recibidos para el modal:', data);
          setEquipos(data);
        }
      } catch (error) {
        console.error('Error fetching equipos:', error);
      }
    };
    fetchEquipos();
    
    const handleRefresh = () => fetchEquipos();
    window.addEventListener('incident-created', handleRefresh);
    window.addEventListener('workstation-created', handleRefresh);
    window.addEventListener('workstation-deleted', handleRefresh);
    
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
            falla: '',
            fmo: ''
          });
        }, 300); // Wait for transition
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('incident-created', handleRefresh);
      window.removeEventListener('workstation-created', handleRefresh);
      window.removeEventListener('workstation-deleted', handleRefresh);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSelectType = (type) => {
    if (type === 'Reparación de estaciones de trabajo') {
      const hasWorkstation = equipos.some(e => {
        const t = (e.tipo || '').toLowerCase().trim();
        return t.includes('estacion') || t.includes('trabajo') || t === '';
      });
      if (!hasWorkstation) {
        setAlertConfig({
          show: true,
          message: 'No tienes una estación de trabajo registrada. Te redirigiremos al formulario para que añadas una.',
          redirectHash: '#modal-new-workstation'
        });
        return;
      }
    } else if (type === 'Reparación de periférico') {
      const hasPeripheral = equipos.some(e => {
        const t = (e.tipo || '').toLowerCase().trim();
        return t !== 'estacion de trabajo';
      });
      if (!hasPeripheral) {
        setAlertConfig({
          show: true,
          message: 'No tienes periféricos registrados. Te redirigiremos al formulario para que añadas uno.',
          redirectHash: '#modal-new-workstation'
        });
        return;
      }
    }

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
        fmo: parseInt(formData.fmo) || 0,
        falla: formData.falla
      } : null,
      solicitudData: incidentType === 'Solicitud' ? {
        tipo_solicitud: formData.tipo_solicitud,
        descripcion: formData.descripcion,
        area_id: user.id_area // Usamos el área del usuario solicitante
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

  const hardwareKeys = ['respaldo', 'ram', 'cpu', 'disco', 'tarj_video', 'pila', 'fuente', 'motherboard', 'tarj_red'];
  const allHardwareSelected = hardwareKeys.every(key => formData[key]);

  const handleToggleAllHardware = () => {
    const newValue = !allHardwareSelected;
    setFormData(prev => {
      const updated = { ...prev };
      hardwareKeys.forEach(key => {
        updated[key] = newValue;
      });
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 opacity-0 pointer-events-none transition-opacity duration-300 target:opacity-100 target:pointer-events-auto" id="modal-new-incident">
      
      {/* Alert Modal Overlay */}
      {alertConfig.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200 pointer-events-auto">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/10">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="absolute inset-0 bg-amber-500/30 rounded-full animate-ping opacity-75"></span>
                <span className="material-symbols-outlined text-3xl relative z-10 animate-pulse">warning</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2 tracking-tight uppercase">Aviso Importante</h3>
              <p className="text-sm font-body text-stone-500 dark:text-on-surface-variant mb-6">{alertConfig.message}</p>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setAlertConfig({ show: false, message: '', redirectHash: '' })}
                  className="flex-1 py-3 text-on-surface-variant font-headline font-bold text-xs uppercase tracking-wider rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const hash = alertConfig.redirectHash;
                    setAlertConfig({ show: false, message: '', redirectHash: '' });
                    window.location.hash = hash;
                  }}
                  className="flex-1 py-3 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-wider rounded-lg transition-transform active:scale-95 shadow-lg shadow-primary/20"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <div className="bg-surface-container px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface-variant tracking-tight uppercase">
              {step === 'selection' ? 'Tipo de Solicitud' : 'Nueva Solicitud'}
            </h2>
            <p className="text-xs font-label text-stone-500 dark:text-on-surface-variant tracking-widest uppercase">
              {step === 'selection' ? 'Seleccione una opción' : incidentType}
            </p>
          </div>
          <a className="material-symbols-outlined text-stone-400 hover:text-primary transition-colors" href="#">close</a>
        </div>
        
        <div className="overflow-y-auto">
          {step === 'selection' && (
            <div className="p-8 pb-32 md:pb-8 space-y-4">
              <button onClick={() => handleSelectType('Reparación de estaciones de trabajo')} className="w-full text-left p-6 rounded-xl border border-outline-variant/10 hover:border-primary hover:bg-surface-container-lowest transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-fixed p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">desktop_windows</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface-variant text-lg">Reparación de estaciones de trabajo</h3>
                    <p className="text-sm font-body text-stone-500 dark:text-on-surface-variant">Reporte de fallas en CPUs y estaciones de trabajo de la planta.</p>
                  </div>
                </div>
              </button>
              <button onClick={() => handleSelectType('Reparación de periférico')} className="w-full text-left p-6 rounded-xl border border-outline-variant/10 hover:border-primary hover:bg-surface-container-lowest transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-fixed p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">mouse</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface-variant text-lg">Reparación de periférico</h3>
                    <p className="text-sm font-body text-stone-500 dark:text-on-surface-variant">Fallas en monitores, teclados u otros periféricos.</p>
                  </div>
                </div>
              </button>
              <button onClick={() => handleSelectType('Solicitud')} className="w-full text-left p-6 rounded-xl border border-outline-variant/10 hover:border-primary hover:bg-surface-container-lowest transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-fixed p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface-variant text-lg">Solicitud</h3>
                    <p className="text-sm font-body text-stone-500 dark:text-on-surface-variant">Requerimientos de nuevos accesos, software o insumos.</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 'form' && (
            <form className="p-8 pb-32 md:pb-8 space-y-8" onSubmit={handleSubmit}>
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
                      <select name="cpu_fmo" value={formData.cpu_fmo} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required>
                        <option value="">Seleccione un equipo</option>
                        {equipos
                          .filter(e => {
                            const tipo = (e.tipo || '').toLowerCase().trim();
                            // Buscamos coincidencia parcial para evitar problemas con acentos o espacios
                            return tipo.includes('estacion') || tipo.includes('trabajo') || tipo === '';
                          })
                          .map(equipo => (
                          <option key={equipo.fmo} value={equipo.fmo}>
                            {equipo.fmo} - {equipo.nombre} {equipo.tipo ? `(${equipo.tipo})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Sistema Operativo</label>
                      <div 
                        className={`w-full bg-surface-container-low border-0 border-b-2 ${isOsDropdownOpen ? 'border-primary' : 'border-outline-variant/20'} px-4 py-3 font-body text-sm rounded-t-md cursor-pointer flex justify-between items-center transition-colors`}
                        onClick={() => setIsOsDropdownOpen(!isOsDropdownOpen)}
                      >
                        <span className={formData.so ? "text-on-surface" : "text-stone-400"}>
                          {formData.so || "Seleccione el S.O."}
                        </span>
                        <span className="material-symbols-outlined text-stone-400">arrow_drop_down</span>
                      </div>
                      
                      {isOsDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsOsDropdownOpen(false)}></div>
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-surface-container-highest border border-outline-variant/10 rounded-md shadow-xl max-h-48 overflow-y-auto styled-scrollbar">
                            {[
                              { group: 'Windows', options: ['Windows 10 (64-bit)', 'Windows 10 (32-bit)', 'Windows 8 (64-bit)', 'Windows 8 (32-bit)', 'Windows 7 (64-bit)', 'Windows 7 (32-bit)', 'Windows XP (32-bit)', 'Windows XP (64-bit)'] },
                              { group: 'Linux', options: ['Linux Mint (64-bit)', 'Linux Mint (32-bit)', 'Ubuntu (64-bit)', 'Ubuntu (32-bit)', 'Debian (64-bit)', 'Debian (32-bit)'] },
                              { group: 'Otros', options: ['Otros'] }
                            ].map((group, idx) => (
                              <div key={idx}>
                                <div className="px-3 py-1.5 text-[10px] font-bold text-primary uppercase tracking-widest bg-surface-container sticky top-0 border-b border-outline-variant/10 shadow-sm z-10">{group.group}</div>
                                {group.options.map(opt => (
                                  <div 
                                    key={opt}
                                    className={`px-4 py-2.5 text-sm font-body cursor-pointer transition-colors ${formData.so === opt ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, so: opt }));
                                      setIsOsDropdownOpen(false);
                                    }}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tipo de Falla</label>
                    <textarea name="tipo_falla" value={formData.tipo_falla} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Describa el problema observado..." rows="2" required></textarea>
                  </div>

                  <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-0">Revisión de Hardware / Componentes</label>
                      <button 
                        type="button" 
                        onClick={handleToggleAllHardware}
                        className="text-[9px] font-label font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded uppercase tracking-widest transition-colors"
                      >
                        {allHardwareSelected ? 'Desmarcar Todo' : 'Marcar Todo'}
                      </button>
                    </div>
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
                      <input name="cant_ram" value={formData.cant_ram} onChange={handleChange} type="number" className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: 8" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Usuario / Credenciales</label>
                      <input name="usuario" value={formData.usuario} onChange={handleChange} type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Usuario" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Contraseña</label>
                    <input name="password" value={formData.password} onChange={handleChange} type="password" title="Contraseña" className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Observaciones Adicionales</label>
                    <textarea name="observacion" value={formData.observacion} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Cualquier detalle relevante..." rows="3"></textarea>
                  </div>
                </div>
              ) : incidentType === 'Reparación de periférico' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">devices_other</span>
                      Seleccionar Periférico (FMO)
                    </label>
                    <select 
                      name="fmo" 
                      value={formData.fmo} 
                      onChange={handleChange} 
                      className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" 
                      required
                    >
                      <option value="">-- Busque o seleccione el equipo --</option>
                      {equipos
                        .filter(e => e.tipo !== 'estacion de trabajo')
                        .map(equipo => (
                        <option key={equipo.fmo} value={equipo.fmo}>
                          #{equipo.fmo} - {equipo.nombre} ({equipo.tipo})
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.fmo && (() => {
                    const selected = equipos.find(e => e.fmo.toString() === formData.fmo.toString());
                    return selected ? (
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 animate-in fade-in slide-in-from-top-1">
                        <p className="text-[10px] font-label font-bold text-primary uppercase tracking-widest mb-2">Información del Equipo Seleccionado</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] mb-0.5">Nombre</p>
                            <p className="font-bold text-on-surface-variant">{selected.nombre}</p>
                          </div>
                          <div>
                            <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] mb-0.5">Marca</p>
                            <p className="font-bold text-on-surface-variant">{selected.marca_nombre || 'Genérica'}</p>
                          </div>
                          <div>
                            <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] mb-0.5">Área Original</p>
                            <p className="font-bold text-on-surface-variant">{selected.area_nombre || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-stone-400 dark:text-on-surface-variant uppercase text-[9px] mb-0.5">Serial</p>
                            <p className="font-bold text-on-surface-variant">{selected.serial || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div>
                    <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">report_problem</span>
                      Falla Reportada
                    </label>
                    <textarea 
                      name="falla" 
                      value={formData.falla} 
                      onChange={handleChange} 
                      title="Falla Reportada" 
                      className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-base rounded-t-md transition-all min-h-[120px]" 
                      placeholder="Describa detalladamente el problema que presenta el equipo..." 
                      required
                    ></textarea>
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
                <a className="flex-1 flex items-center justify-center py-4 text-on-surface-variant font-headline font-bold text-sm uppercase tracking-wider rounded-md bg-surface-container hover:bg-surface-container-high transition-colors" href="#">
                  Cancelar
                </a>
                <button disabled={isSubmitting} className="flex-[2] py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm uppercase tracking-wider rounded-md transition-transform active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100" type="submit">
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
