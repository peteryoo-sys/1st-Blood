'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { applicationService } from '@/services/applicationService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const schema = z.object({
  message: z.string().min(10, '지원 메시지는 10자 이상 입력하세요'),
});

type FormData = z.infer<typeof schema>;

export default function ApplicationForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await applicationService.create({ productId, message: data.message });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">지원 완료!</h2>
        <p className="text-gray-400 mb-6">지원이 성공적으로 접수되었습니다.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/mypage')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            마이페이지로
          </button>
          <button
            onClick={() => router.push(`/products/${productId}`)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            제품 상세로
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm text-gray-300 mb-1">지원 메시지</label>
        <textarea
          {...register('message')}
          rows={6}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
          placeholder="본인의 경험, 기여할 수 있는 부분 등을 작성하세요..."
        />
        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? '제출 중...' : '지원하기'}
      </button>
    </form>
  );
}
