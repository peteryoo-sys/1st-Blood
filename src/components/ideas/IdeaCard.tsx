import Link from 'next/link';
import type { Idea } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Link
      href={`/ideas/${idea.id}`}
      className="block bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{idea.title}</h3>
        <StatusBadge status={idea.status} />
      </div>
      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{idea.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>👍 {idea.recommendCount || 0}</span>
        <span>{new Date(idea.createdAt).toLocaleDateString('ko-KR')}</span>
      </div>
    </Link>
  );
}
