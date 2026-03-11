'use client';

import useSWR from 'swr';
import { productService } from '@/services/productService';
import type { Product } from '@/types';

export function useProducts(params?: { status?: string; page?: number }) {
  return useSWR<Product[]>(
    ['products', params],
    () => productService.list(params),
  );
}

export function useProduct(id: string) {
  return useSWR<Product>(
    id ? ['product', id] : null,
    () => productService.getById(id),
  );
}
