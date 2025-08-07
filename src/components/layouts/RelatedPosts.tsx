'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCategoryStyleByName, CategoryStyle } from '@/lib/categories';
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
            post.category_id === currentPost.category_id
        )
        .slice(0, 3); // 최대 3개만 표시

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 sm:mt-16 mb-16 sm:mb-24">
            {/* 구분선 */}
            <div className="border-t border-gray-700/50 mb-8"></div>

            {/* 제목 */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">연관 게시물</h2>
                <p className="text-gray-400 text-sm mt-2">같은 카테고리의 다른 게시물을 확인해보세요</p>
            </div>

            <div className="pt-6 sm:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {relatedPosts.map((post) => {
                        // 썸네일 이미지 처리 (Supabase Storage URL 또는 fallback)
                        const imageUrl = post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : '/images/default-thumbnail.jpg';

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
                                                target.src = '/images/default-thumbnail.jpg';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                                        {/* 카테고리 뱃지 - 이미지 위에 배치 */}
                                        <div className="absolute top-3 left-3">
                                            <RelatedPostCategoryBadge category={post.category?.name ?? 'ETC'} />
                                        </div>
                                    </div>

                                    {/* 내용 */}
                                    <div className="p-3 sm:p-4">
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

// 연관 게시물용 카테고리 뱃지 컴포넌트
const RelatedPostCategoryBadge = ({ category }: { category: string }) => {
    const [categoryStyle, setCategoryStyle] = useState<CategoryStyle>({ bg: 'bg-gray-600/80', text: 'text-gray-100' });

    useEffect(() => {
        const loadCategoryStyle = async () => {
            try {
                const style = await getCategoryStyleByName(category);
                setCategoryStyle(style);
            } catch (error) {
                console.error('카테고리 스타일 로드 중 오류:', error);
                setCategoryStyle({ bg: 'bg-gray-600/80', text: 'text-gray-100' });
            }
        };
        loadCategoryStyle();
    }, [category]);

    return (
        <div className={`rounded-full ${categoryStyle.bg} px-3 py-1.5 text-xs font-medium ${categoryStyle.text} backdrop-blur-md border border-white/30 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-200`}>
            {category}
        </div>
    );
}; 