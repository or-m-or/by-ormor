'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, deletePost } from '@/lib/database';
import { Post } from '@/lib/supabase';
import { getCategoryStyleByName, CategoryStyle } from '@/lib/categories';
import { ArrowLeft, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PostsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [categoryStyles, setCategoryStyles] = useState<Record<string, CategoryStyle>>({});

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

    // 카테고리 스타일 로드
    useEffect(() => {
        const loadCategoryStyles = async () => {
            const styles: Record<string, CategoryStyle> = {};
            const uniqueCategories = [...new Set(posts.map(post => post.category?.name || 'ETC'))];

            for (const categoryName of uniqueCategories) {
                const style = await getCategoryStyleByName(categoryName);
                styles[categoryName] = style;
            }

            setCategoryStyles(styles);
        };

        if (posts.length > 0) {
            loadCategoryStyles();
        }
    }, [posts]);

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
                <main className="p-6 pb-32">
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
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/70 text-white rounded-xl transition-all duration-300 text-sm backdrop-blur-sm shadow-lg hover:shadow-xl"
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
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl font-bold text-white mb-1">{posts.length}</div>
                                <div className="text-gray-400 text-sm">총 게시물</div>
                            </div>
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl font-bold text-white mb-1">
                                    {new Set(posts.map(post => post.category?.name || 'ETC')).size}
                                </div>
                                <div className="text-gray-400 text-sm">카테고리</div>
                            </div>
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl font-bold text-white mb-1">
                                    {posts.filter(post => post.updated_at && post.updated_at !== post.created_at).length}
                                </div>
                                <div className="text-gray-400 text-sm">수정된 게시물</div>
                            </div>
                        </div>

                        {/* 표 상단 컨트롤 */}
                        <div className="mb-4 flex items-center justify-between">
                            {/* 페이지당 게시물 수 선택 - 왼쪽 */}
                            <div className="flex items-center space-x-3">
                                <label htmlFor="postsPerPage" className="text-sm font-medium text-gray-300 bg-gray-800/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border-0">
                                    페이지당 게시물
                                </label>
                                <Select value={postsPerPage.toString()} onValueChange={(value) => handlePostsPerPageChange(Number(value))}>
                                    <SelectTrigger className="w-24 px-3 py-2 bg-gray-800/50 border-0 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                                        <SelectValue placeholder="선택" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-0 rounded-xl backdrop-blur-sm">
                                        <SelectItem value="5" className="text-white hover:bg-gray-700 focus:bg-gray-700">5개</SelectItem>
                                        <SelectItem value="10" className="text-white hover:bg-gray-700 focus:bg-gray-700">10개</SelectItem>
                                        <SelectItem value="20" className="text-white hover:bg-gray-700 focus:bg-gray-700">20개</SelectItem>
                                        <SelectItem value="50" className="text-white hover:bg-gray-700 focus:bg-gray-700">50개</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 새 게시물 작성 버튼 - 오른쪽 */}
                            <Link
                                href="/dashboard/posts/new"
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-xl transition-all duration-300 text-sm shadow-lg hover:shadow-xl hover:shadow-green-500/30 backdrop-blur-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span>새 게시물 작성</span>
                            </Link>
                        </div>

                        {/* 게시물 목록 테이블 */}
                        <div className="bg-gray-800/20 rounded-xl border-0 overflow-hidden backdrop-blur-sm shadow-lg">
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
                                        className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/30 backdrop-blur-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>첫 게시물 작성하기</span>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-700/30">
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
                                                    <tr key={post.id} className="hover:bg-gray-700/20 transition-all duration-300">
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
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryStyles[post.category?.name || 'ETC']?.bg || 'bg-purple-900/50'} ${categoryStyles[post.category?.name || 'ETC']?.text || 'text-purple-300'}`}>
                                                                {post.category?.name || 'ETC'}
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
                                                            <div className="flex items-center justify-end space-x-1">
                                                                <Link
                                                                    href={`/posts/${post.slug}`}
                                                                    target="_blank"
                                                                    className="p-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/15 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/20 backdrop-blur-sm"
                                                                    title="보기"
                                                                >
                                                                    <Eye className="w-5 h-5" />
                                                                </Link>
                                                                <Link
                                                                    href={`/dashboard/posts/edit/${post.slug}`}
                                                                    className="p-2.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/15 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-yellow-500/20 backdrop-blur-sm"
                                                                    title="수정"
                                                                >
                                                                    <Edit className="w-5 h-5" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(post.id)}
                                                                    disabled={deletingId === post.id}
                                                                    className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/15 disabled:text-red-600 disabled:bg-red-500/5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-500/20 backdrop-blur-sm"
                                                                    title="삭제"
                                                                >
                                                                    {deletingId === post.id ? (
                                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                                                                    ) : (
                                                                        <Trash2 className="w-5 h-5" />
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
                                        <div className="flex justify-between items-center mt-6 mb-6 px-6 py-4 select-none">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-gray-800/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border-0">
                                                    <span className="text-sm text-gray-300">
                                                        {posts.length > 0 ? (
                                                            <>
                                                                {((currentPage - 1) * postsPerPage) + 1} - {Math.min(currentPage * postsPerPage, posts.length)} / {posts.length}개
                                                            </>
                                                        ) : (
                                                            '0개'
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="bg-gray-800/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border-0">
                                                    <span className="text-sm text-gray-300">
                                                        페이지 {currentPage} / {totalPages}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-full hover:bg-gray-700/40 disabled:opacity-40 transition-all duration-200"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                                                </button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => handlePageChange(p)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${p === currentPage ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700/40 text-gray-200 hover:bg-purple-700/60 hover:shadow-md'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 rounded-full hover:bg-gray-700/40 disabled:opacity-40 transition-all duration-200"
                                                >
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </button>
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