'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { getToken, setToken } from '@/lib/api';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
  type AuthUser,
} from '@/lib/auth-service';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    confirmPassword?: string,
    email?: string,
  ) => Promise<void>;
  logout: () => void;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Rehydrate session from stored token on mount
  useEffect(() => {
    console.log('[AuthContext] Mounting and checking token...');
    const token = getToken();
    if (!token) {
      console.log('[AuthContext] No token found, setting isLoading: false');
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    console.log('[AuthContext] Token found, fetching current user...');
    fetchCurrentUser()
      .then((user) => {
        console.log('[AuthContext] User fetched successfully:', user.username);
        setState({ user, isLoading: false, isAuthenticated: true });
      })
      .catch((err) => {
        console.error('[AuthContext] Failed to fetch user:', err);
        logoutUser();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mock_mode');
        }
        setState({ user: null, isLoading: false, isAuthenticated: false });
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { user } = await loginUser(username, password);
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
      confirmPassword?: string,
      email?: string,
    ) => {
      const { user } = await registerUser(username, password, confirmPassword, email);
      setState({ user, isLoading: false, isAuthenticated: true });
    },
    [],
  );

  const logout = useCallback(() => {
    logoutUser();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_mode');
    }
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const loginAsDemo = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_mode', 'true');
      setToken('mock-demo-jwt-token');
    }
    setState({
      user: { id: 1, username: 'demo_admin', email: 'admin@smartovate.com', role: 'Admin' },
      isLoading: false,
      isAuthenticated: true
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
