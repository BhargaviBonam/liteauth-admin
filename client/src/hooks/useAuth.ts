import { useState, useCallback } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

function getStoredUser(): User | null {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    localStorage.setItem('token', result.accessToken);
    localStorage.setItem('user', JSON.stringify(result.user));
    setToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const u = await authService.getMe();
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  }, []);

  return { user, token, isAuthenticated: !!token && !!user, login, logout, refreshUser };
}
