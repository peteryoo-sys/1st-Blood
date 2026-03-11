import { api } from './api';
import type { User } from '@/types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  me: () => api.get<User>('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
  },
};
