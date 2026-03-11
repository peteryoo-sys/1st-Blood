import Link from 'next/link';
import type { Product } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
        <StatusBadge status={product.status} />
      </div>
      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {product.category && <span>{product.category}</span>}
        <span>{new Date(product.createdAt).toLocaleDateString('ko-KR')}</span>
      </div>
    </Link>
  );
}
