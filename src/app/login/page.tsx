import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-3xl font-bold mb-8">로그인</h1>
      <LoginForm />
      <p className="mt-4 text-gray-400 text-sm">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-blue-400 hover:text-blue-300">
          회원가입
        </Link>
      </p>
    </div>
  );
}
