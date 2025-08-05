'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, deletePost } from '@/lib/database';
import { Post } from '@/lib/supabase';
import { ArrowLeft, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PostsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoadingPosts(true);
                const allPosts = await getAllPosts();
                setPosts(allPosts);
            } catch (error) {
                console.error('게시물 로드 중 오류:', error);
            } finally {
                setLoadingPosts(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user]);

    // 페이지네이션 계산
    useEffect(() => {
        const total = Math.ceil(posts.length / postsPerPage);
        setTotalPages(total);
        if (currentPage > total && total > 0) {
            setCurrentPage(1);
        }
    }, [posts.length, postsPerPage, currentPage]);

    // 현재 페이지의 게시물들
    const getCurrentPosts = () => {
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        return posts.slice(startIndex, endIndex);
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
            return;
        }

        try {
            setDeletingId(postId);
            await deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
            alert('게시물이 삭제되었습니다.');
        } catch (error) {
            console.error('게시물 삭제 중 오류:', error);
            alert('게시물 삭제 중 오류가 발생했습니다.');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePostsPerPageChange = (value: number) => {
        setPostsPerPage(value);
        setCurrentPage(1); // 페이지당 게시물 수가 변경되면 첫 페이지로 이동
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const currentPosts = getCurrentPosts();

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
                    <div className="max-w-7xl mx-auto">
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

                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>대시보드로</span>
                                </Link>
                            </div>

                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-bold text-white">게시물 관리</h1>
                            </div>
                        </header>

                        {/* 통계 정보 */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4">
                                <div className="text-2xl font-bold text-white">{posts.length}</div>
                                <div className="text-gray-400 text-sm">총 게시물</div>
                            </div>
                            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4">
                                <div className="text-2xl font-bold text-white">
                                    {new Set(posts.map(post => post.category)).size}
                                </div>
                                <div className="text-gray-400 text-sm">카테고리</div>
                            </div>
                            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4">
                                <div className="text-2xl font-bold text-white">
                                    {posts.filter(post => post.updated_at && post.updated_at !== post.created_at).length}
                                </div>
                                <div className="text-gray-400 text-sm">수정된 게시물</div>
                            </div>
                        </div>

                        {/* 새 게시물 작성 버튼 */}
                        <div className="mb-4 flex justify-end">
                            <Link
                                href="/dashboard/posts/new"
                                className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>새 게시물 작성</span>
                            </Link>
                        </div>

                        {/* 페이지당 게시물 수 선택 */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <label htmlFor="postsPerPage" className="text-sm text-gray-300">
                                    페이지당 게시물:
                                </label>
                                <select
                                    id="postsPerPage"
                                    value={postsPerPage}
                                    onChange={(e) => handlePostsPerPageChange(Number(e.target.value))}
                                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={5}>5개</option>
                                    <option value={10}>10개</option>
                                    <option value={20}>20개</option>
                                    <option value={50}>50개</option>
                                </select>
                            </div>
                            <div className="text-sm text-gray-400">
                                {posts.length > 0 ? (
                                    <>
                                        {((currentPage - 1) * postsPerPage) + 1} - {Math.min(currentPage * postsPerPage, posts.length)} / {posts.length}개
                                    </>
                                ) : (
                                    '0개'
                                )}
                            </div>
                        </div>

                        {/* 게시물 목록 테이블 */}
                        <div className="bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
                            {loadingPosts ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                                    <p className="text-gray-400">게시물을 불러오는 중...</p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-400 mb-4">등록된 게시물이 없습니다.</p>
                                    <Link
                                        href="/dashboard/posts/new"
                                        className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>첫 게시물 작성하기</span>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-700/50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        제목
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        카테고리
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        작성일
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        수정일
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        Slug
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        작업
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700">
                                                {currentPosts.map((post) => (
                                                    <tr key={post.id} className="hover:bg-gray-700/30 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="max-w-xs">
                                                                <div className="text-sm font-medium text-white truncate">
                                                                    {post.title}
                                                                </div>
                                                                <div className="text-xs text-gray-400 truncate">
                                                                    {post.description}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-900/50 text-purple-300">
                                                                {post.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {formatDate(post.created_at || post.date)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {post.updated_at ? formatDate(post.updated_at) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                                            {post.slug}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <Link
                                                                    href={`/posts/${post.slug}`}
                                                                    target="_blank"
                                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                                    title="보기"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                                <Link
                                                                    href={`/dashboard/posts/edit/${post.slug}`}
                                                                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                                                    title="수정"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(post.id)}
                                                                    disabled={deletingId === post.id}
                                                                    className="text-red-400 hover:text-red-300 disabled:text-red-600 transition-colors"
                                                                    title="삭제"
                                                                >
                                                                    {deletingId === post.id ? (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                                                                    ) : (
                                                                        <Trash2 className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 페이지네이션 */}
                                    {totalPages > 1 && (
                                        <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-400">
                                                    페이지 {currentPage} / {totalPages}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded transition-colors disabled:cursor-not-allowed"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>

                                                    {/* 페이지 번호들 */}
                                                    <div className="flex items-center space-x-1">
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                            .filter(page => {
                                                                // 현재 페이지 주변 2페이지씩만 표시
                                                                return page === 1 ||
                                                                    page === totalPages ||
                                                                    (page >= currentPage - 2 && page <= currentPage + 2);
                                                            })
                                                            .map((page, index, array) => {
                                                                // 생략 표시 추가
                                                                if (index > 0 && page - array[index - 1] > 1) {
                                                                    return (
                                                                        <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                                                                            ...
                                                                        </span>
                                                                    );
                                                                }

                                                                return (
                                                                    <button
                                                                        key={page}
                                                                        onClick={() => handlePageChange(page)}
                                                                        className={`px-3 py-1 rounded transition-colors ${currentPage === page
                                                                            ? 'bg-purple-600 text-white'
                                                                            : 'bg-gray-600 hover:bg-gray-500 text-white'
                                                                            }`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                );
                                                            })}
                                                    </div>

                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded transition-colors disabled:cursor-not-allowed"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 