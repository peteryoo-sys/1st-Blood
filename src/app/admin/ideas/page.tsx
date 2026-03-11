'use client';

import AdminGuard from '@/components/auth/AdminGuard';
import AdminIdeaTable from '@/components/admin/AdminIdeaTable';
import { useIdeas } from '@/hooks/useIdeas';

export default function AdminIdeasPage() {
  return (
    <AdminGuard>
      <AdminIdeasContent />
    </AdminGuard>
  );
}

function AdminIdeasContent() {
  const { data: ideas, mutate } = useIdeas();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">아이디어 관리</h1>
      {ideas && ideas.length > 0 ? (
        <AdminIdeaTable ideas={ideas} onUpdate={() => mutate()} />
      ) : (
        <p className="text-gray-500">등록된 아이디어가 없습니다.</p>
      )}
    </div>
  );
}
