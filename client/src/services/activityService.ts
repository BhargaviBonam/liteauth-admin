import api from './api';
import type { ActivityLog, DashboardStats, PaginatedMeta } from '../types';

export const activityService = {
  async getStats() {
    const { data } = await api.get('/dashboard/stats');
    return data.data as DashboardStats;
  },
  async getLogs(page = 1, limit = 20) {
    const { data } = await api.get('/activity-logs', { params: { page, limit } });
    return { logs: data.data as ActivityLog[], meta: data.meta as PaginatedMeta };
  },
};
