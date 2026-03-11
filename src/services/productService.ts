import { api } from './api';
import type { Product } from '@/types';

export const productService = {
  list: (params?: { status?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    return api.get<Product[]>(`/api/products?${query}`);
  },

  getById: (id: string) => api.get<Product>(`/api/products/${id}`),

  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Product>('/api/products', data),

  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/api/products/${id}`, data),

  delete: (id: string) => api.delete(`/api/products/${id}`),
};
