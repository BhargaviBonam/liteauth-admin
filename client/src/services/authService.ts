import api from './api';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data as { user: User; accessToken: string };
  },
  async logout() {
    await api.post('/auth/logout');
  },
  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data as User;
  },
};
