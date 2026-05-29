import api, { setToken, clearToken } from './api';

export interface AuthUser {
  id: number;
  username: string;
  email: string | null;
  role: 'Admin' | 'Editor' | 'Viewer';
}

interface AuthResponse {
  access_token: string;
  user: AuthUser;
  msg?: string;
}

export async function loginUser(username: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/login', { username, password });
  setToken(data.access_token);
  return data;
}

export async function registerUser(
  username: string,
  password: string,
  confirmPassword?: string,
  email?: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/register', {
    username,
    password,
    confirm_password: confirmPassword,
    email: email || undefined,
  });
  setToken(data.access_token);
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>('/me');
  return data.user;
}

export function logoutUser() {
  clearToken();
}
