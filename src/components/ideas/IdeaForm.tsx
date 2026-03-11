'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ideaService } from '@/services/ideaService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(2, '제목은 2자 이상 입력하세요'),
  description: z.string().min(10, '설명은 10자 이상 입력하세요'),
});

type FormData = z.infer<typeof schema>;

export default function IdeaForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await ideaService.create(data);
      router.push('/ideas');
    } catch (e) {
      setError(e instanceof Error ? e.message : '등록에 실패했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm text-gray-300 mb-1">제목</label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="아이디어 제목"
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">설명</label>
        <textarea
          {...register('description')}
          rows={8}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
          placeholder="아이디어에 대해 자세히 설명하세요..."
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? '등록 중...' : '아이디어 등록'}
      </button>
    </form>
  );
}
