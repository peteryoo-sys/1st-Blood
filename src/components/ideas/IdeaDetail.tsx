'use client';

import type { Idea, Comment as CommentType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import StatusBadge from '@/components/ui/StatusBadge';
import RecommendButton from './RecommendButton';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import Link from 'next/link';

interface IdeaDetailProps {
  idea: Idea;
  comments: CommentType[];
  onCommentAdded: () => void;
}

export default function IdeaDetail({ idea, comments, onCommentAdded }: IdeaDetailProps) {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{idea.title}</h1>
          <StatusBadge status={idea.status} />
        </div>
        <RecommendButton ideaId={idea.id} initialCount={idea.recommendCount || 0} />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <p className="text-gray-300 whitespace-pre-wrap">{idea.description}</p>
      </div>

      <div className="text-sm text-gray-500 mb-8">
        등록일: {new Date(idea.createdAt).toLocaleDateString('ko-KR')}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">댓글 ({comments.length})</h2>
        {user && (
          <div className="mb-4">
            <CommentForm ideaId={idea.id} onCommentAdded={onCommentAdded} />
          </div>
        )}
        <CommentList comments={comments} />
      </div>

      <Link href="/ideas" className="inline-block text-gray-400 hover:text-white text-sm">
        &larr; 아이디어 리스트로
      </Link>
    </div>
  );
}
