'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import IdeaForm from '@/components/ideas/IdeaForm';

export default function NewIdeaPage() {
  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">아이디어 등록</h1>
        <IdeaForm />
      </div>
    </AuthGuard>
  );
}
