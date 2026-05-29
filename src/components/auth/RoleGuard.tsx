'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ('Admin' | 'Editor' | 'Viewer')[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="auth-guard-loader">
        <RefreshCw className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '70vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ background: '#fee2e2', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <ShieldAlert size={48} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Accès Refusé</h2>
        <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '2rem' }}>
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page. 
          Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  return isAuthenticated && user && allowedRoles.includes(user.role) ? <>{children}</> : null;
}
