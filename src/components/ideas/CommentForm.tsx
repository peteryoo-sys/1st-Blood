'use client';

import { useState } from 'react';
import { commentService } from '@/services/commentService';

interface CommentFormProps {
  ideaId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ ideaId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await commentService.create({ ideaId, content: content.trim() });
      setContent('');
      onCommentAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        placeholder="댓글을 입력하세요..."
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        등록
      </button>
    </form>
  );
}
