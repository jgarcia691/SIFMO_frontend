import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';
import CustomAlert from '../../../components/common/CustomAlert';

const EditWorkstationModal = ({ equipo, isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [areas, setAreas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [users, setUsers] = useState([]);
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '' });
  const [formData, setFormData] = useState({
    fmo: '',
    area_fk: '',
    tipo: '',
    nombre: '',
    serial: '',
    marca_fk: '',
    propietario_ficha: ''
  });

  useEffect(() => {
    if (equipo) {
      setFormData({
        fmo: equipo.fmo || '',
        area_fk: equipo.area_fk || '',
        tipo: equipo.tipo || '',
        nombre: equipo.nombre || '',
        serial: equipo.serial || '',
        marca_fk: equipo.marca_fk || '',
        propietario_ficha: equipo.propietario_ficha || ''
      });
    }
  }, [equipo]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [areasRes, marcasRes, usersRes] = await Promise.all([
            fetch(`${API_URL}/areas/listar/`),
            fetch(`${API_URL}/marcas/`),
            fetch(`${API_URL}/users`)
          ]);
          
          if (areasRes.ok) setAreas(await areasRes.json());
          if (marcasRes.ok) setMarcas(await marcasRes.json());
          if (usersRes.ok) setUsers(await usersRes.json());
        } catch (error) {
          console.error('Error fetching data for edit modal:', error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      area_fk: parseInt(formData.area_fk),
      tipo: formData.tipo,
      nombre: formData.nombre,
      serial: formData.serial,
      marca_fk: parseInt(formData.marca_fk),
      propietario_ficha: formData.propietario_ficha ? parseInt(formData.propietario_ficha) : null
    };

    try {
      const response = await fetch(`${API_URL}/equipos/${formData.fmo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAlertConfig({
          show: true,
          type: 'success',
          message: 'Equipo actualizado con éxito',
          showCancel: false,
          confirmText: 'Aceptar',
          onConfirm: () => {
            window.dispatchEvent(new Event('workstation-created')); // Re-fetch list
            onClose();
          }
        });
      } else {
        const errorData = await response.json();
        setAlertConfig({
          show: true,
          type: 'error',
          message: 'Error al actualizar: ' + (errorData.message || 'Intente de nuevo'),
          showCancel: false,
          confirmText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertConfig({
        show: true,
        type: 'error',
        message: 'Error de conexión con el servidor',
        showCancel: false,
        confirmText: 'Aceptar'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <CustomAlert config={alertConfig} setConfig={setAlertConfig} />
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]">
        <div className="bg-surface-container px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight uppercase">
              Editar Equipo <span className="text-primary">#{formData.fmo}</span>
            </h2>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-stone-400 hover:text-primary transition-colors">close</button>
        </div>
        
        <div className="overflow-y-auto">
          <form className="p-8 pb-32 md:pb-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Nombre del Equipo</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tipo de Equipo</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" required>
                  <option value="">Seleccione tipo</option>
                  <option value="estacion de trabajo">Estación de Trabajo</option>
                  <option value="monitor">Monitor</option>
                  <option value="teclado">Teclado</option>
                  <option value="scaner">Scanner</option>
                  <option value="pendrive">Pendrive</option>
                  <option value="regulador">Regulador</option>
                  <option value="impresora">Impresora</option>
                  <option value="mouse">Mouse</option>
                  <option value="toner">Toner</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Asignar Propietario</label>
              <select name="propietario_ficha" value={formData.propietario_ficha} onChange={handleChange} className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all">
                <option value="">-- Sin asignar --</option>
                {users.map(user => (
                  <option key={user.ficha} value={user.ficha}>{user.nombre} ({user.rol})</option>
                ))}
              </select>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Número de Serial</label>
                <input name="serial" value={formData.serial} onChange={handleChange} type="text" className="w-full bg-surface-container-low border-0 border-b-2 border-stone-200 focus:ring-0 focus:border-primary px-4 py-3 font-body text-sm rounded-t-md transition-all" placeholder="SN-..." required />
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
              <button type="button" onClick={onClose} className="flex-1 flex items-center justify-center py-4 text-on-surface-variant font-headline font-bold text-sm uppercase tracking-wider rounded-md bg-surface-container hover:bg-surface-container-high transition-colors">
                Cancelar
              </button>
              <button disabled={isSubmitting} className="flex-[2] py-4 bg-primary text-on-primary font-headline font-bold text-sm uppercase tracking-wider rounded-md transition-transform active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100" type="submit">
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWorkstationModal;
