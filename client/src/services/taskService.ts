import api from './api';
import type { Task, PaginatedMeta } from '../types';

export const taskService = {
  async list(params: Record<string, unknown> = {}) {
    const { data } = await api.get('/tasks', { params });
    return { tasks: data.data as Task[], meta: data.meta as PaginatedMeta };
  },
  async create(payload: Partial<Task> & { title: string }) {
    const { data } = await api.post('/tasks', payload);
    return data.data as Task;
  },
  async update(id: number, payload: Partial<Task>) {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data.data as Task;
  },
  async remove(id: number) {
    await api.delete(`/tasks/${id}`);
  },
};
