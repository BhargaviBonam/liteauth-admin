import api from './api';
import type { User, PaginatedMeta } from '../types';

export interface ListUsersParams {
  page?: number; limit?: number; search?: string; role?: string; status?: string;
}

export const userService = {
  async list(params: ListUsersParams = {}) {
    const { data } = await api.get('/users', { params });
    return { users: data.data as User[], meta: data.meta as PaginatedMeta };
  },
  async create(payload: { name: string; email: string; password: string; role: string }) {
    const { data } = await api.post('/users', payload);
    return data.data as User;
  },
  async update(id: number, payload: Partial<{ name: string; email: string; role: string; password: string }>) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data.data as User;
  },
  async remove(id: number) {
    await api.delete(`/users/${id}`);
  },
  async toggleStatus(id: number, status: 'active' | 'inactive') {
    const { data } = await api.patch(`/users/${id}/status`, { status });
    return data.data;
  },
};
