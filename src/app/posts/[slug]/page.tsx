'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/database';
import { Post } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PostHeader } from '@/components/layouts/PostHeader';
import TableOfContents from '@/components/layouts/TableOfContents';
import { RelatedPosts } from '@/components/layouts/RelatedPosts';
import NovelEditor from '@/components/editor/NovelEditor';

export default function PostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<Post | null>(null);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postData, allPostsData] = await Promise.all([
                    getPostBySlug(slug),
                    getAllPosts()
                ]);

                if (!postData) {
                    setError('게시물을 찾을 수 없습니다.');
                    return;
                }

                setPost(postData);
                setAllPosts(allPostsData);
            } catch (err) {
                console.error('게시물 로드 중 오류:', err);
                setError('게시물을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-black">
                <Navigation />
                <main className="px-3 sm:px-4 md:px-6 py-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">게시물을 찾을 수 없습니다</h1>
                        <p className="text-gray-400 mb-6">{error || '요청하신 게시물이 존재하지 않습니다.'}</p>
                        <a
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            홈으로 돌아가기
                        </a>
                    </div>
                </main>
            </div>
        );
    }



    // 같은 카테고리의 다른 게시물들 (현재 게시물 제외)
    const relatedPosts = allPosts
        .filter(p => p.category_id === post.category_id && p.slug !== post.slug)
        .slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navigation />
            <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 pt-20 sm:pt-24 md:pt-28 lg:pt-8 md:ml-28">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
                        {/* 메인 콘텐츠 영역 */}
                        <div className="flex-1 lg:max-w-none max-w-4xl lg:max-w-none">
                            {/* 게시물 헤더 */}
                            <PostHeader post={post} />

                            {/* 게시물 내용 */}
                            <article>
                                {(() => {
                                    console.log('NovelEditor 렌더링 시작');
                                    console.log('post.content 타입:', typeof post.content);
                                    console.log('post.content 값:', post.content);
                                    let parsedContent = null;
                                    try {
                                        parsedContent = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
                                        console.log('파싱된 content:', parsedContent);
                                    } catch (error) {
                                        console.error('Content parsing error:', error);
                                    }
                                    console.log('NovelEditor에 전달할 initialContent:', parsedContent);
                                    return (
                                        <NovelEditor
                                            initialContent={parsedContent}
                                            editable={false}
                                            className="text-lg sm:text-xl"
                                            showToolbar={false}
                                            showStatus={false}
                                        />
                                    );
                                })()}
                            </article>

                            {/* 연관 게시물 */}
                            {relatedPosts.length > 0 && (
                                <RelatedPosts currentPost={post} allPosts={allPosts} />
                            )}
                        </div>

                        {/* 목차 - 완전히 분리된 오른쪽 사이드바 */}
                        <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
                            <TableOfContents content={post.content} />
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
} 