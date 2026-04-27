import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';
import AddUserModal from './AddUserModal';
import UserDetailsModal from './UserDetailsModal';

const UsersContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    const handleRefresh = () => fetchUsers();
    window.addEventListener('user-created', handleRefresh);
    return () => window.removeEventListener('user-created', handleRefresh);
  }, []);

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedUser(null), 200);
  };

  const roleColors = {
    'Administrador': 'bg-red-100 text-red-800',
    'Analista': 'bg-blue-100 text-blue-800',
    'Operador': 'bg-stone-100 text-stone-600',
    'Supervisor': 'bg-amber-100 text-amber-800'
  };

  return (
    <main className="md:ml-20 pt-16 md:pt-24 px-4 md:px-10 pb-20 md:pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none">
              Gestión de <span className="text-primary italic">Usuarios</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-headline font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-primary/20 text-xs md:text-base"
          >
            <span className="material-symbols-outlined">person_add</span>
            Agregar Usuario
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-stone-200">
             <span className="material-symbols-outlined text-stone-300 text-6xl mb-4">group_off</span>
             <p className="text-on-surface-variant font-body">No se encontraron usuarios registrados.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            {/* Table for Desktop */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Ficha</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Nombre</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Rol</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400">Correo</th>
                    <th className="px-6 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((user) => {
                    const roleClass = roleColors[user.rol] || 'bg-stone-100 text-stone-800';
                    return (
                      <tr key={user.ficha} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-label font-bold text-primary">#{user.ficha}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-headline font-bold text-on-surface uppercase text-sm">{user.nombre}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-label font-black uppercase tracking-tighter ${roleClass}`}>
                            {user.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-stone-500 font-label">{user.correo || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => openDetailsModal(user)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors material-symbols-outlined"
                            title="Ver Detalles"
                          >
                            visibility
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Card Layout for Mobile */}
            <div className="md:hidden divide-y divide-stone-100">
              {users.map((user) => {
                const roleClass = roleColors[user.rol] || 'bg-stone-100 text-stone-800';
                return (
                  <div key={user.ficha} className="p-4 flex justify-between items-center bg-white" onClick={() => openDetailsModal(user)}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-label font-bold text-primary">#{user.ficha}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-label font-black uppercase tracking-tighter ${roleClass}`}>
                          {user.rol}
                        </span>
                      </div>
                      <h4 className="font-headline font-bold text-on-surface uppercase text-sm">{user.nombre}</h4>
                      <p className="text-[10px] text-stone-500 font-label truncate max-w-[150px]">{user.correo || 'Sin correo'}</p>
                    </div>
                    <button className="p-2 text-primary material-symbols-outlined">
                      chevron_right
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <UserDetailsModal 
        user={selectedUser} 
        isOpen={isDetailsModalOpen} 
        onClose={closeDetailsModal} 
      />

      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
      />
    </main>
  );
};

export default UsersContent;
