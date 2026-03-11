'use client';

import type { Idea } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { ideaService } from '@/services/ideaService';

interface AdminIdeaTableProps {
  ideas: Idea[];
  onUpdate: () => void;
}

export default function AdminIdeaTable({ ideas, onUpdate }: AdminIdeaTableProps) {
  const handleStatusChange = async (id: string, status: string) => {
    await ideaService.update(id, { status: status as Idea['status'] });
    onUpdate();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
            <th className="text-left py-3 px-2">제목</th>
            <th className="text-left py-3 px-2">상태</th>
            <th className="text-left py-3 px-2">추천</th>
            <th className="text-left py-3 px-2">등록일</th>
            <th className="text-right py-3 px-2">상태 변경</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea) => (
            <tr key={idea.id} className="border-b border-gray-800">
              <td className="py-2 px-2 text-white">{idea.title}</td>
              <td className="py-2 px-2"><StatusBadge status={idea.status} /></td>
              <td className="py-2 px-2 text-gray-400">👍 {idea.recommendCount || 0}</td>
              <td className="py-2 px-2 text-gray-500">
                {new Date(idea.createdAt).toLocaleDateString('ko-KR')}
              </td>
              <td className="py-2 px-2 text-right">
                <select
                  value={idea.status}
                  onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
                >
                  <option value="reviewing">검토중</option>
                  <option value="approved">승인</option>
                  <option value="rejected">반려</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
