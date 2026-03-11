import { api } from './api';
import type { Comment } from '@/types';

export const commentService = {
  listByIdea: (ideaId: string) =>
    api.get<Comment[]>(`/api/comments?ideaId=${ideaId}`),

  create: (data: { ideaId: string; content: string }) =>
    api.post<Comment>('/api/comments', data),

  delete: (id: string) => api.delete(`/api/comments/${id}`),
};
