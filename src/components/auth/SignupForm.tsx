'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await signup(data.email, data.password, data.name);
      router.push('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : '회원가입에 실패했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <div>
        <label className="block text-sm text-gray-300 mb-1">이름</label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="홍길동"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">이메일</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="email@example.com"
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">비밀번호</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="6자 이상"
        />
        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">비밀번호 확인</label>
        <input
          {...register('confirmPassword')}
          type="password"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="비밀번호 재입력"
        />
        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? '가입 중...' : '회원가입'}
      </button>
    </form>
  );
}
