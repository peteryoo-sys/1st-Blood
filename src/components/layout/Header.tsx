'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function Header() {
  const { user, isLoading, checkAuth, logout } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white">
            1st Blood
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
              제품
            </Link>
            <Link href="/ideas" className="text-gray-300 hover:text-white transition-colors">
              아이디어
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-20 h-8 bg-gray-800 rounded animate-pulse" />
          ) : user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 text-sm">
                  관리자
                </Link>
              )}
              <Link href="/mypage" className="text-gray-300 hover:text-white text-sm">
                마이페이지
              </Link>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white text-sm"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white text-sm"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
