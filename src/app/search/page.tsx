'use client';

import { useState, useEffect } from 'react';
import { SearchInput } from '@/components/search/SearchInput';
import { SearchResultCard } from '@/components/search/SearchResultCard';
import { CategoryFilterButton } from '@/components/search/CategoryFilterButton';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { getAllPosts } from '@/lib/database';
import { Post } from '@/lib/supabase';

const categoryOptions = ['ALL', '개발', '기술', '일상', '리뷰', '튜토리얼', '프로젝트', '회고', '팁', '소개', '경험'];

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('ALL');
    const [loading, setLoading] = useState(true);

    // 검색과 카테고리 필터링이 모두 적용된 결과
    const filtered = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.description.toLowerCase().includes(query.toLowerCase());

        const matchesCategory = activeCategory === 'ALL' || post.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    // 각 카테고리별 포스트 수 계산 (검색어가 있을 때는 검색 결과 내에서 계산)
    const getCategoryCount = (category: string) => {
        if (category === 'ALL') {
            return query ? filtered.length : posts.length;
        }

        const categoryPosts = query
            ? posts.filter(post =>
                (post.title.toLowerCase().includes(query.toLowerCase()) ||
                    post.description.toLowerCase().includes(query.toLowerCase())) &&
                post.category === category
            )
            : posts.filter(post => post.category === category);

        return categoryPosts.length;
    };

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                const allPosts = await getAllPosts();
                setPosts(allPosts);
            } catch (error) {
                console.error('게시물 로드 중 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    return (
        <div className="min-h-screen bg-black relative">
            {/* 고정된 배경 애니메이션 */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/20 to-gray-800/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]"></div>
            </div>

            {/* 스크롤되는 내용 */}
            <div className="relative z-10">
                <Navigation posts={posts} />

                <main className="md:ml-16 pb-16 md:pb-0 p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* 상단 바 */}
                        <div className="flex justify-between items-center mb-8">
                            {/* 로고 */}
                            <Link
                                href="/"
                                className="font-dunggeunmo flex items-center space-x-2 text-2xl font-bold whitespace-nowrap text-white"
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

                        {/* 검색 입력창 */}
                        <SearchInput
                            placeholder="제목 또는 내용으로 검색"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="mb-6"
                        />

                        {/* 카테고리 필터 버튼 */}
                        <div className="mb-8 flex flex-wrap justify-center gap-3">
                            {categoryOptions.map((category) => (
                                <CategoryFilterButton
                                    key={category}
                                    category={category}
                                    count={getCategoryCount(category)}
                                    isActive={activeCategory === category}
                                    onClick={() => setActiveCategory(category)}
                                />
                            ))}
                        </div>

                        {/* 검색 결과 */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                                </div>
                            ) : filtered.length > 0 ? (
                                filtered.map((post) => (
                                    <div key={post.id}>
                                        <SearchResultCard
                                            id={post.id}
                                            title={post.title}
                                            summary={post.description}
                                            imageUrl={post.thumbnail}
                                            publishedDate={new Date(post.date).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                            readTime="5 min read"
                                            category={post.category}
                                            slug={post.slug}
                                        />
                                    </div>
                                ))
                            ) : query || activeCategory !== 'ALL' ? (
                                <div className="text-center py-8 text-gray-400">
                                    검색 결과가 없습니다.
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    검색어를 입력하거나 카테고리를 선택해주세요.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 