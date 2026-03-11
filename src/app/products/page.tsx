'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import EmptyState from '@/components/ui/EmptyState';

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">진행 중인 제품</h1>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-5 animate-pulse h-40" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <EmptyState
          title="등록된 제품이 없습니다"
          description="아직 진행 중인 제품이 없습니다."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
