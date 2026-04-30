import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config/api';
import AddUserModal from '../modals/AddUserModal';
import UserDetailsModal from '../modals/UserDetailsModal';

const ROLE_ORDER = ['Administrador', 'Analista', 'Operador'];

const ROLE_CONFIG = {
  Administrador: {
    icon: 'admin_panel_settings',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    accent: 'border-red-400 dark:border-red-600',
    header: 'bg-red-50 dark:bg-red-900/10',
    dot: 'bg-red-400',
  },
  Analista: {
    icon: 'manage_search',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    accent: 'border-blue-400 dark:border-blue-600',
    header: 'bg-blue-50 dark:bg-blue-900/10',
    dot: 'bg-blue-400',
  },
  Operador: {
    icon: 'engineering',
    badge: 'bg-stone-100 text-stone-600 dark:bg-stone-700/40 dark:text-stone-300',
    accent: 'border-stone-400 dark:border-stone-500',
    header: 'bg-stone-50 dark:bg-stone-800/20',
    dot: 'bg-stone-400',
  }
};

const DEFAULT_CONFIG = {
  icon: 'person',
  badge: 'bg-stone-100 text-stone-600 dark:bg-stone-700/40 dark:text-stone-300',
  accent: 'border-stone-400',
  header: 'bg-stone-50 dark:bg-stone-800/20',
  dot: 'bg-stone-400',
};

const RoleGroup = ({ role, users, onSelectUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const config = ROLE_CONFIG[role] || DEFAULT_CONFIG;
  
  const pluralRoles = {
    'Administrador': 'Administradores',
    'Analista': 'Analistas',
    'Operador': 'Operadores'
  };

  return (
    <div className={`rounded-xl border-l-4 ${config.accent} bg-surface-container-lowest shadow-sm overflow-hidden`}>
      {/* Group Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`w-full flex items-center justify-between px-5 py-3.5 ${config.header} transition-colors hover:brightness-95`}
      >
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined text-xl ${config.badge.split(' ').slice(1).join(' ')}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {config.icon}
          </span>
          <span className="font-headline font-black uppercase tracking-tight text-on-surface-variant text-sm md:text-base">
            {pluralRoles[role] || `${role}s`}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-label font-black ${config.badge}`}>
            {users.length}
          </span>
        </div>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Table — Desktop */}
      {!collapsed && (
        <>
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container/40">
                  <th className="px-5 py-3 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Ficha</th>
                  <th className="px-5 py-3 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Nombre</th>
                  <th className="px-5 py-3 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant">Área</th>
                  <th className="px-5 py-3 text-[10px] font-label font-bold uppercase tracking-widest text-stone-400 dark:text-on-surface-variant text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {users.map((user) => (
                  <tr key={user.ficha} className="hover:bg-surface-container/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="font-label font-bold text-primary">#{user.ficha}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                        <span className="font-headline font-bold text-on-surface-variant uppercase text-sm">{user.nombre}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-on-surface-variant font-body uppercase">{user.area || 'N/A'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onSelectUser(user)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors material-symbols-outlined"
                      >
                        visibility
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout — Mobile */}
          <div className="md:hidden divide-y divide-outline-variant/10">
            {users.map((user) => (
              <div
                key={user.ficha}
                className="p-4 flex justify-between items-center bg-surface-container-lowest active:bg-surface-container transition-colors"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-label font-bold text-primary">#{user.ficha}</span>
                    <span className="text-[9px] font-label text-stone-400 dark:text-on-surface-variant uppercase tracking-widest">{user.area || 'Sin área'}</span>
                  </div>
                  <h4 className="font-headline font-bold text-on-surface-variant uppercase text-sm leading-tight">{user.nombre}</h4>
                </div>
                <button className="p-2 text-primary material-symbols-outlined">chevron_right</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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

  const groupedUsers = ROLE_ORDER.reduce((acc, role) => {
    const group = users.filter(u => u.rol === role);
    if (group.length > 0) acc[role] = group;
    return acc;
  }, {});

  return (
    <main className="md:ml-20 pt-16 md:pt-24 px-4 md:px-10 pb-20 md:pb-12 bg-surface min-h-screen">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-headline font-black text-on-surface-variant uppercase tracking-tighter leading-none">
              Gestión de <span className="text-primary italic">Usuarios</span>
            </h1>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-headline font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-primary/20 text-xs md:text-base"
          >
            <span className="material-symbols-outlined">person_add</span>
            Agregar Usuario
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedUsers).map(([role, roleUsers]) => (
              <RoleGroup
                key={role}
                role={role}
                users={roleUsers}
                onSelectUser={openDetailsModal}
              />
            ))}
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
