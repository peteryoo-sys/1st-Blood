import { api } from './api';
import type { Recommendation } from '@/types';

export const recommendationService = {
  toggle: (ideaId: string) =>
    api.post<{ recommended: boolean }>('/api/recommendations', { ideaId }),

  check: (ideaId: string) =>
    api.get<{ recommended: boolean }>(`/api/recommendations/check?ideaId=${ideaId}`),
};
