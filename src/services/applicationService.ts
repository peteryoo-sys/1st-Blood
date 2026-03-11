import { api } from './api';
import type { Application } from '@/types';

export const applicationService = {
  create: (data: { productId: string; message: string }) =>
    api.post<Application>('/api/applications', data),

  listByUser: () =>
    api.get<Application[]>('/api/applications?mine=true'),

  updateStatus: (id: string, status: Application['status']) =>
    api.put<Application>(`/api/applications/${id}`, { status }),
};
