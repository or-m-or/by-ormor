'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/database';
import { Post } from '@/lib/supabase';

export default function DashboardPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allPosts = await getAllPosts();
                setPosts(allPosts);

                // 고유한 카테고리 추출
                const uniqueCategories = [...new Set(allPosts.map(post => post.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('데이터 로드 중 오류:', error);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    // 로딩 중이거나 인증되지 않은 경우
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (!user) {
        return null; // 리다이렉트 중
    }

    return (
        <div className="min-h-screen bg-black relative">
            {/* 고정된 배경 애니메이션 */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/20 to-gray-800/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]"></div>
            </div>

            {/* 스크롤되는 내용 */}
            <div className="relative z-10">
                <main className="p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* 헤더 */}
                        <header className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="font-dunggeunmo flex items-center space-x-2 text-2xl font-bold text-white">
                                    <Image
                                        src="/icons/asterisk.png"
                                        alt="Logo"
                                        width={24}
                                        height={24}
                                        className="rounded-sm"
                                    />
                                    <span>ormor</span>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300 text-sm">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">관리자 대시보드</h1>
                        </header>

                        {/* 대시보드 콘텐츠 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* 게시물 관리 카드 */}
                            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">게시물 관리</h3>
                                <p className="text-gray-300 mb-4">게시물 목록 보기, 작성, 수정, 삭제</p>
                                <div className="space-y-2">
                                    <Link
                                        href="/dashboard/posts"
                                        className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                                    >
                                        게시물 관리하기
                                    </Link>
                                </div>
                            </div>

                            {/* 통계 카드 */}
                            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">통계</h3>
                                <p className="text-gray-300 mb-4">블로그 방문자 및 게시물 통계</p>
                                <div className="space-y-2">
                                    <div className="bg-gray-700/50 rounded-lg p-3">
                                        <div className="text-2xl font-bold text-white">{posts.length}</div>
                                        <div className="text-gray-400 text-sm">총 게시물</div>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-3">
                                        <div className="text-2xl font-bold text-white">{categories.length}</div>
                                        <div className="text-gray-400 text-sm">카테고리</div>
                                    </div>
                                </div>
                            </div>

                            {/* 설정 카드 */}
                            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">설정</h3>
                                <p className="text-gray-300 mb-4">블로그 설정 및 관리</p>
                                <div className="space-y-2">
                                    <Link
                                        href="/dashboard/settings"
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                                    >
                                        블로그 설정
                                    </Link>
                                    <Link
                                        href="/dashboard/profile"
                                        className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                                    >
                                        프로필 관리
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 홈으로 돌아가기 */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                ← 홈으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 