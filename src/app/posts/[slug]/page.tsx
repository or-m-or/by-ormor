'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { getPostBySlug, getAllPosts } from '@/lib/database';
import { PostHeader } from '@/components/layouts/PostHeader';
import { TableOfContents } from '@/components/layouts/TableOfContents';
import { RelatedPosts } from '@/components/layouts/RelatedPosts';
import { Post } from '@/lib/supabase';

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string>('');
    const [post, setPost] = useState<Post | null>(null);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // params에서 slug 추출
                const resolvedParams = await params;
                const currentSlug = resolvedParams.slug;
                setSlug(currentSlug);

                // 데이터 로드
                const [postData, allPostsData] = await Promise.all([
                    getPostBySlug(currentSlug),
                    getAllPosts()
                ]);

                if (!postData) {
                    setError('게시물을 찾을 수 없습니다.');
                    return;
                }

                setPost(postData);
                setAllPosts(allPostsData);
            } catch (error) {
                console.error('데이터 로드 중 오류:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">오류가 발생했습니다</h1>
                    <p className="text-gray-400 mb-6 text-sm sm:text-base">{error || '게시물을 찾을 수 없습니다.'}</p>
                    <a 
                        href="/" 
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                        홈으로 돌아가기
                    </a>
                </div>
            </div>
        );
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
                <Navigation />

                <main className="md:ml-16 pb-16 md:pb-0 px-3 sm:px-4 md:px-6 pt-12 md:pt-16">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-center gap-4 lg:gap-6">
                        {/* 본문 */}
                        <div className="flex-1 max-w-full lg:max-w-[720px] min-w-0">
                            <PostHeader post={post} />

                            <article className="prose prose-invert max-w-none prose-sm sm:prose-base">
                                <div 
                                    className="text-sm sm:text-base leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: post.content }} 
                                />
                            </article>

                            {/* 연관 게시물 */}
                            <RelatedPosts currentPost={post} allPosts={allPosts} />
                        </div>

                        {/* TOC 사이드바 */}
                        <aside className="hidden lg:block w-[240px] shrink-0 self-start sticky top-[100px]">
                            <TableOfContents content={post.content} />
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
} 