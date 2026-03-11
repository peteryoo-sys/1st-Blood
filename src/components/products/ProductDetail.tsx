'use client';

import Link from 'next/link';
import type { Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ProductDetail({ product }: { product: Product }) {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={product.status} />
            {product.category && (
              <span className="text-gray-500 text-sm">{product.category}</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <p className="text-gray-300 whitespace-pre-wrap">{product.description}</p>
      </div>

      <div className="text-sm text-gray-500 mb-8">
        등록일: {new Date(product.createdAt).toLocaleDateString('ko-KR')}
      </div>

      {product.status === 'recruiting' && (
        <div className="flex gap-4">
          {user ? (
            <Link
              href={`/products/${product.id}/apply`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              개발 지원하기
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              로그인 후 지원하기
            </Link>
          )}
        </div>
      )}

      <Link href="/products" className="inline-block mt-6 text-gray-400 hover:text-white text-sm">
        &larr; 제품 리스트로
      </Link>
    </div>
  );
}
