'use client';

import Link from 'next/link';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/hooks/useAuth';
import IdeaCard from '@/components/ideas/IdeaCard';
import EmptyState from '@/components/ui/EmptyState';

export default function IdeasPage() {
  const { data: ideas, isLoading } = useIdeas();
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">아이디어</h1>
        {user && (
          <Link
            href="/ideas/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            아이디어 올리기
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-5 animate-pulse h-40" />
          ))}
        </div>
      ) : !ideas || ideas.length === 0 ? (
        <EmptyState
          title="등록된 아이디어가 없습니다"
          description="첫 번째 아이디어를 등록해보세요!"
          action={
            user ? (
              <Link
                href="/ideas/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                아이디어 등록하기
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                로그인 후 등록하기
              </Link>
            )
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
