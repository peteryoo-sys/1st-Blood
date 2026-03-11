'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">아이디어를 제품으로</h1>
        <p className="text-xl text-gray-400 mb-8">
          아이디어를 공유하고, 함께 만들어갈 개발자를 찾으세요
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors"
          >
            진행 중인 제품 보기
          </Link>
          <Link
            href="/ideas"
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-lg transition-colors"
          >
            아이디어 둘러보기
          </Link>
        </div>
      </section>

      {user && (
        <section className="text-center mb-16">
          <p className="text-gray-400 mb-4">환영합니다, {user.name}님!</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/ideas/new"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              아이디어 올리기
            </Link>
            <Link
              href="/mypage"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              마이페이지
            </Link>
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-3">💡 아이디어</h2>
          <p className="text-gray-400 mb-4">
            새로운 아이디어를 등록하고, 다른 사람의 아이디어에 댓글과 추천을 남기세요.
          </p>
          <Link href="/ideas" className="text-blue-400 hover:text-blue-300">
            아이디어 리스트 →
          </Link>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-3">🚀 제품</h2>
          <p className="text-gray-400 mb-4">
            진행 중인 제품을 확인하고, 개발에 참여하세요.
          </p>
          <Link href="/products" className="text-blue-400 hover:text-blue-300">
            제품 리스트 →
          </Link>
        </div>
      </section>
    </div>
  );
}
