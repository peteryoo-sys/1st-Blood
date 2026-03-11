'use client';

import AdminGuard from '@/components/auth/AdminGuard';
import AdminProductTable from '@/components/admin/AdminProductTable';
import { useProducts } from '@/hooks/useProducts';
import { productService } from '@/services/productService';
import { useState } from 'react';

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <AdminProductsContent />
    </AdminGuard>
  );
}

function AdminProductsContent() {
  const { data: products, mutate } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'recruiting', category: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await productService.create(form as Parameters<typeof productService.create>[0]);
    setForm({ title: '', description: '', status: 'recruiting', category: '' });
    setShowForm(false);
    mutate();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">제품 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? '취소' : '새 제품 등록'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8 space-y-4">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="제품명"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="제품 설명"
            rows={4}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex gap-4">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="recruiting">모집중</option>
              <option value="in_progress">진행중</option>
              <option value="completed">완료</option>
            </select>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="카테고리"
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            등록
          </button>
        </form>
      )}

      {products && products.length > 0 ? (
        <AdminProductTable products={products} onUpdate={() => mutate()} />
      ) : (
        <p className="text-gray-500">등록된 제품이 없습니다.</p>
      )}
    </div>
  );
}
