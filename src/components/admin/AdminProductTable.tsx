'use client';

import type { Product, ProductStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { productService } from '@/services/productService';
import { useState } from 'react';

interface AdminProductTableProps {
  products: Product[];
  onUpdate: () => void;
}

export default function AdminProductTable({ products, onUpdate }: AdminProductTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; status: ProductStatus; category: string }>({ title: '', description: '', status: 'recruiting', category: '' });

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      status: product.status,
      category: product.category || '',
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    await productService.update(editingId, form);
    setEditingId(null);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await productService.delete(id);
    onUpdate();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left py-3 px-2">제목</th>
            <th className="text-left py-3 px-2">상태</th>
            <th className="text-left py-3 px-2">카테고리</th>
            <th className="text-left py-3 px-2">등록일</th>
            <th className="text-right py-3 px-2">액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-800">
              {editingId === product.id ? (
                <>
                  <td className="py-2 px-2">
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white w-full"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
                    >
                      <option value="recruiting">모집중</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white w-full"
                    />
                  </td>
                  <td className="py-2 px-2 text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button onClick={handleSave} className="text-green-400 hover:text-green-300 mr-2">저장</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">취소</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-2 text-white">{product.title}</td>
                  <td className="py-2 px-2"><StatusBadge status={product.status} /></td>
                  <td className="py-2 px-2 text-gray-400">{product.category || '-'}</td>
                  <td className="py-2 px-2 text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button onClick={() => startEdit(product)} className="text-blue-400 hover:text-blue-300 mr-2">수정</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300">삭제</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
