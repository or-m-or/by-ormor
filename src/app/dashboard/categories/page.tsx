'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories, createCategory, updateCategory, deleteCategory, CategoryData } from '@/lib/database';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Tag, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

export default function CategoriesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 폼 상태
    const [formData, setFormData] = useState<Omit<CategoryData, 'id'>>({
        name: '',
        slug: '',
        color: 'blue',
        bg_color: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20',
        bg_opacity: '80',
        text_color: 'white',
        sort_order: 0,
        is_active: true
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const allCategories = await getAllCategories();
                setCategories(allCategories);
            } catch (error) {
                console.error('카테고리 로드 중 오류:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        if (user) {
            fetchCategories();
        }
    }, [user]);

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            color: 'blue',
            bg_color: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20',
            bg_opacity: '80',
            text_color: 'white',
            sort_order: 0,
            is_active: true
        });
    };

    const handleCreate = async () => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            toast.error('이름과 Slug는 필수 입력 항목입니다.');
            return;
        }

        try {
            setIsSubmitting(true);
            const newCategory = await createCategory(formData);
            if (newCategory) {
                setCategories([...categories, newCategory]);
                closeModal();
                toast.success('카테고리가 생성되었습니다.');
            }
        } catch (error) {
            console.error('카테고리 생성 중 오류:', error);
            toast.error('카테고리 생성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (id: number) => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            toast.error('이름과 Slug는 필수 입력 항목입니다.');
            return;
        }

        // 카테고리 상태가 변경되는 경우 사용자에게 알림
        const originalCategory = categories.find(cat => cat.id === id);
        const isStatusChanging = originalCategory && originalCategory.is_active !== formData.is_active;

        try {
            setIsSubmitting(true);
            const updatedCategory = await updateCategory(id, formData);
            if (updatedCategory) {
                setCategories(categories.map(cat => cat.id === id ? updatedCategory : cat));
                closeModal();

                if (isStatusChanging && !formData.is_active) {
                    toast.success('카테고리가 수정되었습니다.', {
                        description: '카테고리가 비활성화되었으므로, 해당 카테고리의 모든 게시물도 함께 비활성화되었습니다. 카테고리를 다시 활성화해도 게시물은 개별적으로 활성화해야 합니다.',
                        duration: 5000,
                    });
                } else if (isStatusChanging && formData.is_active) {
                    toast.success('카테고리가 수정되었습니다.', {
                        description: '카테고리가 활성화되었습니다. 비활성화된 게시물들은 개별적으로 활성화해야 합니다.',
                        duration: 5000,
                    });
                } else {
                    toast.success('카테고리가 수정되었습니다.');
                }
            }
        } catch (error) {
            console.error('카테고리 수정 중 오류:', error);
            toast.error('카테고리 수정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말로 이 카테고리를 삭제하시겠습니까?\n(관련 게시물들은 ETC 카테고리로 이동됩니다)')) {
            return;
        }

        try {
            setDeletingId(id);
            const success = await deleteCategory(id);
            if (success) {
                setCategories(categories.filter(cat => cat.id !== id));
                toast.success('카테고리가 삭제되었습니다.');
            }
        } catch (error) {
            console.error('카테고리 삭제 중 오류:', error);
            toast.error('카테고리 삭제 중 오류가 발생했습니다.');
        } finally {
            setDeletingId(null);
        }
    };

    const startEdit = (category: CategoryData) => {
        setEditingId(category.id!);
        setFormData({
            name: category.name,
            slug: category.slug,
            color: category.color,
            bg_color: category.bg_color,
            bg_opacity: category.bg_opacity,
            text_color: category.text_color,
            sort_order: category.sort_order,
            is_active: category.is_active
        });
        setShowModal(true);
    };

    const startCreate = () => {
        setEditingId(null);
        resetForm();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        resetForm();
    };

    const handleInputChange = (field: keyof Omit<CategoryData, 'id'>, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 상태 토글 함수
    const handleToggleStatus = async (category: CategoryData) => {
        try {
            const newStatus = !category.is_active;
            const updatedCategory = await updateCategory(category.id!, { is_active: newStatus });

            if (updatedCategory) {
                setCategories(categories.map(cat => cat.id === category.id ? updatedCategory : cat));

                if (!newStatus) {
                    toast.success('카테고리가 비활성화되었습니다.', {
                        description: '해당 카테고리의 모든 게시물도 함께 비활성화되었습니다.',
                        duration: 5000,
                    });
                } else {
                    toast.success('카테고리가 활성화되었습니다.', {
                        description: '비활성화된 게시물들은 개별적으로 활성화해야 합니다.',
                        duration: 5000,
                    });
                }
            }
        } catch (error) {
            console.error('카테고리 상태 토글 중 오류:', error);
            toast.error('카테고리 상태 변경 중 오류가 발생했습니다.');
        }
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

    const isEditing = editingId !== null;

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

                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/70 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="text-sm">대시보드로</span>
                                </Link>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">카테고리 관리</h1>
                        </header>

                        {/* 새 카테고리 버튼 */}
                        <div className="mb-6 flex justify-end">
                            <button
                                onClick={startCreate}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/30 backdrop-blur-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span>새 카테고리</span>
                            </button>
                        </div>

                        {/* 카테고리 목록 */}
                        <div className="bg-gray-800/20 rounded-xl border-0 overflow-hidden backdrop-blur-sm shadow-lg">
                            {loadingCategories ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                                    <p className="text-gray-400">카테고리를 불러오는 중...</p>
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-400 mb-4">등록된 카테고리가 없습니다.</p>
                                    <button
                                        onClick={startCreate}
                                        className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/30 backdrop-blur-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>첫 카테고리 생성하기</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-700/30">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    이름
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Slug
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    카테고리 태그
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    정렬
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    상태
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    작업
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/30">
                                            {categories.map((category) => (
                                                <tr key={category.id} className="hover:bg-gray-700/20 transition-all duration-300">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-3">
                                                            <Tag className="w-5 h-5 text-gray-400" />
                                                            <div className="text-sm font-medium text-white">
                                                                {category.name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {category.slug}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${category.bg_color} text-${category.text_color}`}
                                                        >
                                                            {category.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {category.sort_order}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleToggleStatus(category)}
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105 cursor-pointer ${category.is_active
                                                                ? 'bg-green-900/50 text-green-300 hover:bg-red-900/50 hover:text-red-300'
                                                                : 'bg-red-900/50 text-red-300 hover:bg-green-900/50 hover:text-green-300'
                                                                }`}
                                                            title={`클릭하여 ${category.is_active ? '비활성화' : '활성화'}`}
                                                        >
                                                            {category.is_active ? '활성' : '비활성'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-1">
                                                            <button
                                                                onClick={() => startEdit(category)}
                                                                className="p-2.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/15 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-yellow-500/20 backdrop-blur-sm"
                                                                title="수정"
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(category.id!)}
                                                                disabled={deletingId === category.id}
                                                                className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/15 disabled:text-red-600 disabled:bg-red-500/5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-500/20 backdrop-blur-sm"
                                                                title="삭제"
                                                            >
                                                                {deletingId === category.id ? (
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
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* 배경 오버레이 */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>

                    {/* 모달 컨텐츠 */}
                    <div className="relative bg-gray-900/95 rounded-xl border-0 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                {isEditing ? '카테고리 수정' : '새 카테고리 생성'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all duration-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">이름 *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
                                    placeholder="카테고리 이름"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => handleInputChange('slug', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
                                    placeholder="카테고리-slug"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">색상</label>
                                <select
                                    value={formData.color}
                                    onChange={(e) => {
                                        const color = e.target.value;
                                        const colorMap: Record<string, { bg_color: string, text_color: string }> = {
                                            red: { bg_color: 'bg-gradient-to-r from-red-500/20 to-red-600/20', text_color: 'white' },
                                            orange: { bg_color: 'bg-gradient-to-r from-orange-500/20 to-orange-600/20', text_color: 'white' },
                                            yellow: { bg_color: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20', text_color: 'white' },
                                            green: { bg_color: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20', text_color: 'white' },
                                            teal: { bg_color: 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20', text_color: 'white' },
                                            blue: { bg_color: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20', text_color: 'white' },
                                            indigo: { bg_color: 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20', text_color: 'white' },
                                            purple: { bg_color: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20', text_color: 'white' },
                                            pink: { bg_color: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20', text_color: 'white' },
                                            gray: { bg_color: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20', text_color: 'white' }
                                        };
                                        const colorConfig = colorMap[color];
                                        handleInputChange('color', color);
                                        handleInputChange('bg_color', colorConfig.bg_color);
                                        handleInputChange('text_color', colorConfig.text_color);
                                        handleInputChange('bg_opacity', '80');
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
                                >
                                    <option value="red" className="text-red-400">Red</option>
                                    <option value="orange" className="text-orange-400">Orange</option>
                                    <option value="yellow" className="text-yellow-400">Yellow</option>
                                    <option value="green" className="text-green-400">Green</option>
                                    <option value="teal" className="text-teal-400">Teal</option>
                                    <option value="blue" className="text-blue-400">Blue</option>
                                    <option value="indigo" className="text-indigo-400">Indigo</option>
                                    <option value="purple" className="text-purple-400">Purple</option>
                                    <option value="pink" className="text-pink-400">Pink</option>
                                    <option value="gray" className="text-gray-400">Gray</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">정렬 순서</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.sort_order || ''}
                                        onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 pr-12 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('sort_order', (formData.sort_order || 0) + 1)}
                                            className="p-1 text-gray-300 hover:text-white hover:bg-gray-600/70 rounded-t-sm transition-all duration-200"
                                        >
                                            <ChevronUp className="w-3 h-3 font-bold stroke-2" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('sort_order', Math.max(0, (formData.sort_order || 0) - 1))}
                                            className="p-1 text-gray-300 hover:text-white hover:bg-gray-600/70 rounded-b-sm transition-all duration-200"
                                        >
                                            <ChevronDown className="w-3 h-3 font-bold stroke-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-4">
                            <label className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                                />
                                <span className="text-sm text-gray-300">활성화</span>
                            </label>
                        </div>

                        <div className="flex items-center space-x-3 mt-6">
                            <button
                                onClick={isEditing ? () => handleUpdate(editingId!) : handleCreate}
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600/90 hover:bg-green-600 disabled:bg-green-600/50 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                <span>{isEditing ? '수정' : '생성'}</span>
                            </button>
                            <button
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-600/90 hover:bg-gray-600 disabled:bg-gray-600/50 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                                <span>취소</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 