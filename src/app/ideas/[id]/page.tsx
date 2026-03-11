'use client';

import { useParams } from 'next/navigation';
import { useIdea } from '@/hooks/useIdeas';
import IdeaDetail from '@/components/ideas/IdeaDetail';
import useSWR from 'swr';
import { commentService } from '@/services/commentService';

export default function IdeaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: idea, isLoading } = useIdea(id);
  const { data: comments, mutate: mutateComments } = useSWR(
    id ? ['comments', id] : null,
    () => commentService.listByIdea(id),
  );

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

  if (!idea) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">아이디어를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <IdeaDetail
        idea={idea}
        comments={comments || []}
        onCommentAdded={() => mutateComments()}
      />
    </div>
  );
}
