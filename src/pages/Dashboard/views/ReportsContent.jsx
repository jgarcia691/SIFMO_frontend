import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import { API_URL } from '../../../config/api';

const ReportsContent = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0], // Last 6 months
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/incidentes/listar/`);
      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyStats = {};

    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyStats[key] = { name: key, resueltos: 0, pendientes: 0, total: 0 };
    }

    incidents.forEach(inc => {
      if (!inc.fecha) return;
      const date = new Date(inc.fecha);
      const key = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      
      if (monthlyStats[key]) {
        if (inc.status === 'Listo' || inc.status === 'Entregado') {
          monthlyStats[key].resueltos++;
        } else {
          monthlyStats[key].pendientes++;
        }
        monthlyStats[key].total++;
      }
    });

    return Object.values(monthlyStats);
  };

  const processStatusData = () => {
    const stats = {};
    incidents.forEach(inc => {
      stats[inc.status] = (stats[inc.status] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#a855f7', '#ef4444'];

  const exportToExcel = () => {
    const filtered = incidents.filter(inc => {
      if (!inc.fecha) return false;
      const d = new Date(inc.fecha);
      return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
    });

    const worksheetData = filtered.map(inc => ({
      'ID': inc.id,
      'Fecha': inc.fecha ? new Date(inc.fecha).toLocaleDateString() : 'N/A',
      'Tipo': inc.tipo,
      'Solicitante': inc.solicitante,
      'Ficha': inc.cliente,
      'Departamento': inc.area,
      'Estado': inc.status,
      'Encargado': inc.encargado_nombre || 'No asignado',
      'Observaciones': inc.observacion || ''
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incidentes");
    XLSX.writeFile(wb, `SGI_FMO_Reporte_${dateRange.start}_a_${dateRange.end}.xlsx`);
  };

  const monthlyData = processMonthlyData();
  const statusData = processStatusData();

  return (
    <main className="md:ml-20 pt-16 md:pt-24 px-4 md:px-10 pb-20 md:pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface-variant uppercase tracking-tighter leading-none">
              Reportes y <span className="text-primary italic">Estadísticas</span>
            </h1>
            <p className="text-xs text-stone-500 font-label uppercase tracking-widest">Análisis de rendimiento SGI-FMO</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-surface-container-low p-2 rounded-xl border border-outline-variant/10">
            <div className="flex items-center gap-2 px-2">
              <span className="material-symbols-outlined text-stone-400 text-sm">date_range</span>
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="bg-transparent border-none text-xs font-label focus:ring-0"
              />
              <span className="text-stone-400">/</span>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="bg-transparent border-none text-xs font-label focus:ring-0"
              />
            </div>
            <button 
              onClick={exportToExcel}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-headline font-bold uppercase tracking-wider hover:bg-green-700 transition-all text-xs shadow-md"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar Excel
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart - Monthly History */}
            <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
              <h3 className="font-headline font-bold text-on-surface-variant uppercase mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                Evolución Mensual (Últimos 6 meses)
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#888'}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#888'}}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      cursor={{fill: 'rgba(249, 115, 22, 0.05)'}}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="resueltos" name="Resueltos" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pendientes" name="Pendientes" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side Chart - Status Distribution */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col">
              <h3 className="font-headline font-bold text-on-surface-variant uppercase mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">pie_chart</span>
                Distribución de Estados
              </h3>
              <div className="h-[250px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {statusData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[10px] font-label text-stone-500 uppercase truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
              {[
                { label: 'Total Histórico', value: incidents.length, icon: 'database', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Resueltos', value: incidents.filter(i => i.status === 'Listo' || i.status === 'Entregado').length, icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/10' },
                { label: 'Pendientes', value: incidents.filter(i => i.status === 'Pendiente' || i.status === 'En revisión').length, icon: 'pending', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { label: 'Tasa Resolución', value: `${Math.round((incidents.filter(i => i.status === 'Listo' || i.status === 'Entregado').length / (incidents.length || 1)) * 100)}%`, icon: 'trending_up', color: 'text-purple-500', bg: 'bg-purple-500/10' },
              ].map((card, i) => (
                <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest">{card.label}</p>
                    <p className="text-2xl font-headline font-bold text-on-surface-variant">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ReportsContent;
