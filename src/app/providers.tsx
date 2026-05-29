'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

/**
 * Client-side providers wrapper.
 * All context providers that need 'use client' go here,
 * keeping the root layout as a server component.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
