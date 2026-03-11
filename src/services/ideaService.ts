import { api } from './api';
import type { Idea } from '@/types';

export const ideaService = {
  list: (params?: { status?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    return api.get<Idea[]>(`/api/ideas?${query}`);
  },

  getById: (id: string) => api.get<Idea>(`/api/ideas/${id}`),

  create: (data: { title: string; description: string }) =>
    api.post<Idea>('/api/ideas', data),

  update: (id: string, data: Partial<Idea>) =>
    api.put<Idea>(`/api/ideas/${id}`, data),

  delete: (id: string) => api.delete(`/api/ideas/${id}`),
};
