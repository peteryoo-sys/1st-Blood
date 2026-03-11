import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-3xl font-bold mb-8">회원가입</h1>
      <SignupForm />
      <p className="mt-4 text-gray-400 text-sm">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300">
          로그인
        </Link>
      </p>
    </div>
  );
}
