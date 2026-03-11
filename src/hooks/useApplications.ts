'use client';

import useSWR from 'swr';
import { applicationService } from '@/services/applicationService';
import type { Application } from '@/types';

export function useMyApplications() {
  return useSWR<Application[]>(
    'my-applications',
    () => applicationService.listByUser(),
  );
}
