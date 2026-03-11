'use client';

import { useParams } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import ApplicationForm from '@/components/products/ApplicationForm';

export default function ApplyPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">개발 지원 신청</h1>
        <ApplicationForm productId={id} />
      </div>
    </AuthGuard>
  );
}
