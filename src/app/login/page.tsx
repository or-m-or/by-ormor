'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (data.user) {
                // 로그인 성공 시 대시보드로 리다이렉트
                router.push('/dashboard');
            }
        } catch (error) {
            setError('로그인 중 오류가 발생했습니다.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black relative">
            {/* 고정된 배경 애니메이션 */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/20 to-gray-800/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]"></div>
            </div>

            {/* 스크롤되는 내용 */}
            <div className="relative z-10">
                <main className="flex items-center justify-center min-h-screen p-6">
                    <div className="w-full max-w-md">
                        {/* 로고 */}
                        <div className="text-center mb-8">
                            <Link
                                href="/"
                                className="font-dunggeunmo flex items-center justify-center space-x-2 text-2xl font-bold text-white mb-2"
                            >
                                <Image
                                    src="/icons/asterisk.png"
                                    alt="Logo"
                                    width={24}
                                    height={24}
                                    className="rounded-sm"
                                />
                                <span>ormor</span>
                            </Link>
                        </div>

                        {/* 로그인 폼 */}
                        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* 이메일 입력 */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        이메일
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                {/* 비밀번호 입력 */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        비밀번호
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* 에러 메시지 */}
                                {error && (
                                    <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
                                        {error}
                                    </div>
                                )}

                                {/* 로그인 버튼 */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            로그인 중...
                                        </div>
                                    ) : (
                                        '로그인'
                                    )}
                                </button>
                            </form>

                            {/* 홈으로 돌아가기 */}
                            <div className="mt-6 text-center">
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-white text-sm transition-colors"
                                >
                                    ← 홈으로 돌아가기
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 