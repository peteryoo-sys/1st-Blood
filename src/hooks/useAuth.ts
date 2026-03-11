'use client';

import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    const { token, user } = await authService.login({ email, password });
    localStorage.setItem('token', token);
    set({ user });
  },

  signup: async (email, password, name) => {
    const { token, user } = await authService.signup({ email, password, name });
    localStorage.setItem('token', token);
    set({ user });
  },

  logout: () => {
    authService.logout();
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }
      const user = await authService.me();
      set({ user, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isLoading: false });
    }
  },
}));
