import React, { useState, useEffect } from 'react';

const NewWorkstationModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [areas, setAreas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [formData, setFormData] = useState({
    fmo: '',
    area_fk: '',
    nombre: '',
    serial: '',
    marca_fk: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, marcasRes] = await Promise.all([
          fetch('http://localhost:3000/api/areas/listar/'),
          fetch('http://localhost:3000/api/marcas/')
        ]);
        
        if (areasRes.ok) setAreas(await areasRes.json());
        if (marcasRes.ok) setMarcas(await marcasRes.json());
      } catch (error) {
        console.error('Error fetching areas or brands:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      fmo: parseInt(formData.fmo),
      area_fk: parseInt(formData.area_fk),
      nombre: formData.nombre,
      serial: formData.serial,
      marca_fk: parseInt(formData.marca_fk)
    };

    try {
      const response = await fetch('http://localhost:3000/api/equipos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Equipo registrado con éxito');
        window.dispatchEvent(new Event('workstation-created'));
        window.location.hash = '#equipos';
      } else {
        const errorData = await response.json();
        alert('Error al registrar: ' + (errorData.message || 'Intente de nuevo'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 opacity-0 pointer-events-none transition-opacity duration-300 target:opacity-100 target:pointer-events-auto" id="modal-new-workstation">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <div className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight uppercase">
              Registrar Nuevo Equipo
            </h2>
            <p className="text-xs font-label text-stone-500 tracking-widest uppercase">
              Ingresa las especificaciones del hardware
            </p>
          </div>
          <a className="material-symbols-outlined text-stone-400 hover:text-primary transition-colors" href="#equipos">close</a>
        </div>
        
        <div className="overflow-y-auto">
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">FMO # (ID Único)</label>
                <input name="fmo" value={formData.fmo} onChange={handleChange} type="number" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: 10245" required />
              </div>
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Área / Departamento</label>
                <select name="area_fk" value={formData.area_fk} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required>
                  <option value="">Seleccione un área</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Nombre del Equipo / Identificador</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: Estación de Control B-1" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Número de Serial</label>
                <input name="serial" value={formData.serial} onChange={handleChange} type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="Ej: SN-987654321" required />
              </div>
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Marca</label>
                <select name="marca_fk" value={formData.marca_fk} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required>
                  <option value="">Seleccione una marca</option>
                  {marcas.map(marca => (
                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-4 shrink-0">
              <a className="flex-1 flex items-center justify-center py-4 text-stone-500 font-headline font-bold text-sm uppercase tracking-wider rounded-md bg-stone-100 hover:bg-stone-200 transition-colors" href="#equipos">
                Cancelar
              </a>
              <button disabled={isSubmitting} className="flex-[2] py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm uppercase tracking-wider rounded-md transition-transform active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100" type="submit">
                {isSubmitting ? 'Registrando...' : 'Registrar Equipo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewWorkstationModal;
