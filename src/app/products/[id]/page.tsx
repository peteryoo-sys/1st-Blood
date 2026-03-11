'use client';

import { useProduct } from '@/hooks/useProducts';
import ProductDetail from '@/components/products/ProductDetail';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-800 rounded w-1/2" />
          <div className="h-48 bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">제품을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <ProductDetail product={product} />
    </div>
  );
}
