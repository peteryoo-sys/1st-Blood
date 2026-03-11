'use client';

import Link from 'next/link';
import AdminGuard from '@/components/auth/AdminGuard';

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/products"
            className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-gray-600 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">🚀 제품 관리</h2>
            <p className="text-gray-400">제품 등록, 수정, 삭제</p>
          </Link>
          <Link
            href="/admin/ideas"
            className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-gray-600 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">💡 아이디어 관리</h2>
            <p className="text-gray-400">아이디어 상태 관리 (검토/승인/반려)</p>
          </Link>
        </div>
      </div>
    </AdminGuard>
  );
}
