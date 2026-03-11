'use client';

import { useState, useEffect } from 'react';
import { recommendationService } from '@/services/recommendationService';
import { useAuth } from '@/hooks/useAuth';

interface RecommendButtonProps {
  ideaId: string;
  initialCount: number;
}

export default function RecommendButton({ ideaId, initialCount }: RecommendButtonProps) {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (user) {
      recommendationService.check(ideaId).then((res) => {
        setRecommended(res.recommended);
      }).catch(() => {});
    }
  }, [ideaId, user]);

  const handleToggle = async () => {
    if (!user) return;
    const res = await recommendationService.toggle(ideaId);
    setRecommended(res.recommended);
    setCount((prev) => prev + (res.recommended ? 1 : -1));
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!user}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        recommended
          ? 'bg-blue-600 text-white'
          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span>{recommended ? '👍' : '👆'}</span>
      <span>추천 {count}</span>
    </button>
  );
}
