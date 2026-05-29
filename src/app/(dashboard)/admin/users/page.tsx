'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  UserCog, 
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import RoleGuard from '@/components/auth/RoleGuard';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    setUpdating(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['Admin']}>
      <div className="animate-fade-in">
        {/* ... (rest of the component) */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Gestion des Utilisateurs</h1>
            <p style={{ color: '#64748b' }}>Gérez les permissions et les rôles d'accès à la plateforme.</p>
          </div>
          <button 
            onClick={fetchUsers}
            className="glass-card" 
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
          </button>
        </div>

        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Rechercher un utilisateur (nom ou email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  borderRadius: '0.75rem', 
                  border: '1px solid var(--border)',
                  background: 'rgba(0,0,0,0.02)',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Utilisateur</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Rôle Actuel</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center' }}><RefreshCw className="animate-spin" /></td></tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: 'var(--primary)', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {user.username[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{user.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: user.role === 'Admin' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: user.role === 'Admin' ? '#9333ea' : '#64748b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {user.role === 'Admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <select 
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updating === user.id}
                          style={{ 
                            padding: '0.4rem 0.75rem', 
                            borderRadius: '0.5rem', 
                            border: '1px solid var(--border)',
                            background: 'white',
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                        {updating === user.id && <RefreshCw size={16} className="animate-spin" style={{ alignSelf: 'center' }} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ background: 'rgba(147, 51, 234, 0.05)', border: '1px dashed var(--primary)' }}>
          <h5 style={{ color: '#9333ea', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} /> Rappel de Sécurité
          </h5>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
            Les changements de rôle sont effectifs immédiatement. Un administrateur a un accès total à la configuration de la plateforme et à la gestion des données sensibles.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
