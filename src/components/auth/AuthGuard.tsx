'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Wraps protected pages — redirects to /login when unauthenticated.
 * Shows a centered loading spinner while session state is resolving.
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="auth-guard-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
