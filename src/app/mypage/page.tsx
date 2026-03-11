'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useIdeas } from '@/hooks/useIdeas';
import { useMyApplications } from '@/hooks/useApplications';
import IdeaCard from '@/components/ideas/IdeaCard';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  );
}

function MyPageContent() {
  const { user } = useAuth();
  const { data: allIdeas } = useIdeas();
  const { data: applications } = useMyApplications();

  const myIdeas = allIdeas?.filter((idea) => idea.userId === user?.id) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

      <div className="mb-4 text-gray-400">
        {user?.name} ({user?.email})
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">내 아이디어</h2>
        {myIdeas.length === 0 ? (
          <EmptyState
            title="등록한 아이디어가 없습니다"
            action={
              <Link
                href="/ideas/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                아이디어 등록하기
              </Link>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">내 지원 내역</h2>
        {!applications || applications.length === 0 ? (
          <EmptyState
            title="지원 내역이 없습니다"
            action={
              <Link
                href="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                제품 둘러보기
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <Link
                    href={`/products/${app.productId}`}
                    className="text-white hover:text-blue-400"
                  >
                    제품 보기
                  </Link>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">{app.message}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
