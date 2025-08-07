'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/database';
import { Post } from '@/lib/supabase';
import { Home, LogOut, Settings, FileText, BarChart3, Tag } from 'lucide-react';

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
                const uniqueCategories = [...new Set(allPosts.map(post => post.category?.name || 'ETC'))];
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

                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-300 text-sm bg-gray-800/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border-0">
                                        {user.email}
                                    </span>
                                    <Link
                                        href="/"
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/70 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                                    >
                                        <Home className="w-4 h-4" />
                                        <span className="text-sm">홈으로</span>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center space-x-2 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">로그아웃</span>
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">관리자 대시보드</h1>
                        </header>

                        {/* 대시보드 콘텐츠 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* 게시물 관리 카드 */}
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-purple-600/20 rounded-lg">
                                        <FileText className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">게시물 관리</h3>
                                </div>
                                <p className="text-gray-300 mb-6">게시물 목록 보기, 작성, 수정, 삭제</p>
                                <Link
                                    href="/dashboard/posts"
                                    className="inline-flex items-center space-x-2 w-full bg-purple-600/90 hover:bg-purple-600 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 backdrop-blur-sm"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>게시물 관리하기</span>
                                </Link>
                                <Link
                                    href="/dashboard/categories"
                                    className="inline-flex items-center space-x-2 w-full bg-indigo-600/90 hover:bg-indigo-600 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 backdrop-blur-sm mt-3"
                                >
                                    <Tag className="w-4 h-4" />
                                    <span>카테고리 관리하기</span>
                                </Link>
                            </div>

                            {/* 통계 카드 */}
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-blue-600/20 rounded-lg">
                                        <BarChart3 className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">통계</h3>
                                </div>
                                <p className="text-gray-300 mb-6">블로그 방문자 및 게시물 통계</p>
                                <div className="space-y-3">
                                    <div className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm border-0">
                                        <div className="text-3xl font-bold text-white">{posts.length}</div>
                                        <div className="text-gray-400 text-sm">총 게시물</div>
                                    </div>
                                    <div className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm border-0">
                                        <div className="text-3xl font-bold text-white">{categories.length}</div>
                                        <div className="text-gray-400 text-sm">카테고리</div>
                                    </div>
                                </div>
                            </div>

                            {/* 설정 카드 */}
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-green-600/20 rounded-lg">
                                        <Settings className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">설정</h3>
                                </div>
                                <p className="text-gray-300 mb-6">블로그 설정 및 관리</p>
                                <Link
                                    href="/dashboard/settings"
                                    className="inline-flex items-center space-x-2 w-full bg-green-600/90 hover:bg-green-600 text-white text-center py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/30 backdrop-blur-sm"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>블로그 설정</span>
                                </Link>
                            </div>
                        </div>


                    </div>
                </main>
            </div>
        </div>
    );
} 