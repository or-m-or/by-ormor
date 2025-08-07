'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchInput } from '@/components/search/SearchInput';
import { SearchResultCard } from '@/components/search/SearchResultCard';
import { CategoryFilterButton } from '@/components/search/CategoryFilterButton';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/database';
import { Post } from '@/lib/supabase';
import { getAllCategories, getCategoryPostCount, Category } from '@/lib/categories';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ShootingStars } from '@/components/common/ShootingStars';
import { StarsBackground } from '@/components/common/StarsBackground';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState<(Post & { category: Category })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('전체');
    const [loading, setLoading] = useState(true);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    // 페이지네이션 관련 상태
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // 기본 10개

    // 검색과 카테고리 필터링이 모두 적용된 결과
    const filtered = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            (post.description?.toLowerCase() || '').includes(query.toLowerCase());
        const matchesCategory = activeCategory === '전체' || post.category?.name === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // 페이지네이션 계산
    const pageCount = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    // pageSize 변경 시 page를 1로 리셋
    useEffect(() => { setPage(1); }, [pageSize, query, activeCategory]);

    // 카테고리별 게시물 수를 업데이트하는 함수
    const updateCategoryCounts = useCallback(async () => {
        const counts: Record<string, number> = {};

        // 전체 카테고리 수
        counts['전체'] = query ? filtered.length : posts.length;

        // 각 카테고리별 수
        for (const category of categories) {
            counts[category.name] = await getCategoryPostCount(category.name, query);
        }

        setCategoryCounts(counts);
    }, [categories, query, filtered, posts.length]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [allPosts, allCategories] = await Promise.all([
                    getAllPosts(),
                    getAllCategories()
                ]);
                setPosts(allPosts);
                setCategories(allCategories);
            } catch (error) {
                console.error('데이터 로드 중 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // 카테고리 수 업데이트
    useEffect(() => {
        if (categories.length > 0) {
            updateCategoryCounts();
        }
    }, [categories, query, posts, updateCategoryCounts]);

    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            {/* 고정된 배경 애니메이션 */}
            <div className="fixed inset-0 z-0">
                <ShootingStars />
                <StarsBackground />
            </div>

            {/* 스크롤되는 내용 */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />

                <main className="flex-1 md:ml-28 pb-16 md:pb-0 p-6">
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
                        <div className="mb-6 flex flex-wrap justify-center gap-3">
                            {/* 전체 카테고리는 항상 첫 번째로 표시 */}
                            <CategoryFilterButton
                                category="전체"
                                count={categoryCounts['전체'] || 0}
                                isActive={activeCategory === '전체'}
                                onClick={() => setActiveCategory('전체')}
                            />
                            {/* 나머지 카테고리들 */}
                            {categories.map((category) => (
                                <CategoryFilterButton
                                    key={category.id}
                                    category={category.name}
                                    count={categoryCounts[category.name] || 0}
                                    isActive={activeCategory === category.name}
                                    onClick={() => setActiveCategory(category.name)}
                                />
                            ))}
                        </div>

                        {/* 한 페이지에 n개 보기 셀렉트 박스 */}
                        <div className="flex items-center justify-end mb-6 gap-2">
                            <label htmlFor="pageSize" className="text-sm text-gray-300">한 페이지에</label>
                            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                                <SelectTrigger className="w-24 px-3 py-2 bg-gray-800/50 border-0 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                                    <SelectValue placeholder="선택" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-0 rounded-xl backdrop-blur-sm w-24 min-w-0">
                                    {[5, 10, 15, 20, 30, 50].map(n => (
                                        <SelectItem key={n} value={n.toString()} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                                            {n}개
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 검색 결과 */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
                                </div>
                            ) : paged.length > 0 ? (
                                paged.map((post) => (
                                    <div key={post.id}>
                                        <SearchResultCard
                                            id={post.id}
                                            title={post.title}
                                            summary={post.description || ''}
                                            imageUrl={post.thumbnail}
                                            publishedDate={new Date(post.date).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                            readTime="5 min read"
                                            category={post.category?.name || ''}
                                            slug={post.slug}
                                        />
                                    </div>
                                ))
                            ) : query || activeCategory !== '전체' ? (
                                <div className="text-center py-12">
                                    <div className="bg-gray-800/20 rounded-xl border border-gray-700/50 p-8 backdrop-blur-sm shadow-lg">
                                        <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
                                        <p className="text-gray-500 text-sm mt-2">다른 검색어나 카테고리를 시도해보세요.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-800/20 rounded-xl border border-gray-700/50 p-8 backdrop-blur-sm shadow-lg">
                                        <p className="text-gray-400 text-lg">검색을 시작해보세요</p>
                                        <p className="text-gray-500 text-sm mt-2">검색어를 입력하거나 카테고리를 선택해주세요.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* 페이지네이션 */}
                        {pageCount > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8 select-none">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="p-2 rounded-full hover:bg-gray-700/40 disabled:opacity-40"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-purple-600 text-white' : 'bg-gray-700/40 text-gray-200 hover:bg-purple-700/60'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === pageCount}
                                    className="p-2 rounded-full hover:bg-gray-700/40 disabled:opacity-40"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
} 