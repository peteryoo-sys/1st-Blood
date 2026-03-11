const statusConfig: Record<string, { label: string; color: string }> = {
  recruiting: { label: '모집중', color: 'bg-green-600' },
  in_progress: { label: '진행중', color: 'bg-blue-600' },
  completed: { label: '완료', color: 'bg-gray-600' },
  reviewing: { label: '검토중', color: 'bg-yellow-600' },
  approved: { label: '승인', color: 'bg-green-600' },
  rejected: { label: '반려', color: 'bg-red-600' },
  pending: { label: '대기', color: 'bg-yellow-600' },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-600' };
  return (
    <span className={`${config.color} text-white text-xs px-2 py-1 rounded-full`}>
      {config.label}
    </span>
  );
}
