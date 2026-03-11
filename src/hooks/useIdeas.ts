'use client';

import useSWR from 'swr';
import { ideaService } from '@/services/ideaService';
import type { Idea } from '@/types';

export function useIdeas(params?: { status?: string; page?: number }) {
  return useSWR<Idea[]>(
    ['ideas', params],
    () => ideaService.list(params),
  );
}

export function useIdea(id: string) {
  return useSWR<Idea>(
    id ? ['idea', id] : null,
    () => ideaService.getById(id),
  );
}
