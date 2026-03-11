'use client';

import type { Comment } from '@/types';

export default function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm">아직 댓글이 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              {comment.userName || '익명'}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
