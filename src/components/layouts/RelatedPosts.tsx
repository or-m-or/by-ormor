'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CategoryBadge } from '@/components/badge/CategoryBadge';
import { Post } from '@/lib/supabase';

interface RelatedPostsProps {
    currentPost: Post;
    allPosts: Post[];
}

export const RelatedPosts = ({ currentPost, allPosts }: RelatedPostsProps) => {
    // 현재 게시물을 제외하고 동일 카테고리의 게시물들을 필터링
    const relatedPosts = allPosts
        .filter(post =>
            post.id !== currentPost.id &&
            post.category === currentPost.category
        )
        .slice(0, 3); // 최대 3개만 표시

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 sm:mt-16 mb-16 sm:mb-24">
            <div className="pt-6 sm:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {relatedPosts.map((post) => {
                        // 썸네일 이미지 처리 (Supabase Storage URL 또는 fallback)
                        const imageUrl = post.thumbnail.startsWith('http') ? post.thumbnail : '/api/placeholder/400/225';

                        return (
                            <Link
                                key={post.id}
                                href={`/posts/${post.slug}`}
                                className="group block"
                            >
                                <article className="bg-gray-800/30 rounded-lg overflow-hidden transition-all duration-200 hover:bg-gray-800/50">
                                    {/* 썸네일 */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                                            onError={(e) => {
                                                // 이미지 로드 실패 시 fallback
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/api/placeholder/400/225';
                                            }}
                                        />
                                    </div>

                                    {/* 내용 */}
                                    <div className="p-3 sm:p-4">
                                        {/* 카테고리 뱃지 */}
                                        <div className="mb-2 sm:mb-3">
                                            <CategoryBadge
                                                category={post.category}
                                                className="text-xs px-2 py-1"
                                            />
                                        </div>

                                        <h3 className="text-white font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                                            {post.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span className="text-xs">
                                                {new Date(post.date).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-xs">5 min read</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}; 