'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import NovelEditor from '@/components/editor/NovelEditor';
import { uploadImage, validateImageFile } from '@/lib/storage';
import { getAllCategories, Category } from '@/lib/categories';
import { getPostBySlug } from '@/lib/database';
import Select from '@/components/common/Select';
import type { JSONContent } from 'novel';

interface PostFormData {
    title: string;
    slug: string;
    description: string;
    category: string;
    category_id: number;
    thumbnail: string;
}

interface PostFormProps {
    initialData?: PostFormData;
    initialContent?: JSONContent | null;
    onSave: (formData: PostFormData, content: JSONContent | null) => Promise<void>;
    isEditing?: boolean;
    loading?: boolean;
}

export default function PostForm({
    initialData,
    initialContent,
    onSave,
    isEditing = false,
    loading = false
}: PostFormProps) {

    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        slug: '',
        description: '',
        category: '',
        category_id: 0,
        thumbnail: ''
    });
    const [content, setContent] = useState<JSONContent | null>(initialContent || null);
    const [uploadingImage, setUploadingImage] = useState(false);




    // 카테고리 로드
    useEffect(() => {
        const loadCategories = async () => {
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

        loadCategories();
    }, []);

    // 초기 데이터 설정 (카테고리 로드 후)
    useEffect(() => {
        if (initialData && categories.length > 0) {
            setFormData(initialData);
        }
    }, [initialData, categories]);

    // 초기 콘텐츠 설정 (별도 useEffect로 분리)
    useEffect(() => {
        if (initialContent !== undefined && initialContent !== null) {
            setContent(initialContent);
        }
    }, [initialContent]);



    const handleInputChange = (key: string, value: string) => {
        console.log('handleInputChange 호출:', key, value);
        if (key === 'category') {
            const selectedCategory = categories.find(cat => cat.name === value);
            console.log('선택된 카테고리:', selectedCategory);
            setFormData(prev => ({
                ...prev,
                category: value,
                category_id: selectedCategory?.id || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const validateSlug = (slug: string) => {
        // 영문, 숫자, 하이픈만 허용
        const slugRegex = /^[a-z0-9-]+$/;
        return slugRegex.test(slug);
    };

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title
            // 자동 슬러그 생성 비활성화
        }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!validateImageFile(file)) {
            event.target.value = '';
            alert('유효하지 않은 이미지 파일입니다. JPG, PNG, GIF 파일만 업로드 가능합니다.');
            return;
        }

        try {
            setUploadingImage(true);
            const fileName = `${formData.slug || 'temp'}-${Date.now()}`;
            const imageUrl = await uploadImage(file, fileName);
            setFormData(prev => ({
                ...prev,
                thumbnail: imageUrl || ''
            }));
        } catch (error) {
            console.error('이미지 업로드 중 오류:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploadingImage(false);
            event.target.value = '';
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({
            ...prev,
            thumbnail: ''
        }));
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!formData.slug.trim()) {
            alert('슬러그를 입력해주세요.');
            return;
        }

        // 슬러그 형식 검증
        if (!validateSlug(formData.slug)) {
            alert('슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.');
            return;
        }

        if (!formData.category.trim()) {
            alert('카테고리를 선택해주세요.');
            return;
        }

        // 슬러그 중복 검증 (새 게시물 작성 시에만)
        if (!isEditing) {
            try {
                const existingPost = await getPostBySlug(formData.slug);
                if (existingPost) {
                    alert('이미 존재하는 슬러그입니다. 다른 슬러그를 사용해주세요.');
                    return;
                }
            } catch (error) {
                console.error('슬러그 중복 검증 중 오류:', error);
                // 검증 실패 시에도 진행 (네트워크 오류 등)
            }
        }

        try {
            setSaving(true);

            // 저장 전에 에디터의 최신 콘텐츠를 강제로 가져오기
            const editorElement = document.querySelector('[data-testid="editor-content"]');
            if (editorElement) {
                const proseMirrorElement = editorElement.querySelector('.ProseMirror');
                if (proseMirrorElement) {
                    // ProseMirror의 내부 상태에서 JSON 추출
                    const view = (proseMirrorElement as any).__vue__?.view ||
                        (proseMirrorElement as any).view;

                    if (view && view.state) {
                        // ProseMirror 상태를 JSON으로 변환
                        const latestContent = view.state.doc.toJSON();
                        await onSave(formData, latestContent);
                    } else {
                        await onSave(formData, content);
                    }
                } else {
                    await onSave(formData, content);
                }
            } else {
                await onSave(formData, content);
            }
        } catch (error) {
            console.error('저장 중 오류:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    console.log('PostForm 렌더링 상태 - formData:', formData, 'content:', content, 'loadingCategories:', loadingCategories);

    if (loading || loadingCategories) {
        console.log('PostForm 로딩 상태 렌더링');
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    console.log('PostForm 메인 렌더링 시작');

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
                            <div className="max-w-4xl mx-auto">
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

                                    <h1 className="text-lg font-medium text-gray-300">
                                        {isEditing ? '게시물 수정' : '새 게시물 작성'}
                                    </h1>
                                </div>
                            </div>
                        </header>

                        {/* 썸네일 업로드 */}
                        <div className="mb-8">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-end space-x-4">
                                    {/* 이미지 미리보기 또는 업로드 박스 */}
                                    <div className="flex-shrink-0 w-full">
                                        {formData.thumbnail ? (
                                            <div className="relative w-full h-[394px] rounded-lg overflow-hidden">
                                                <Image
                                                    src={formData.thumbnail}
                                                    alt="썸네일 미리보기"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <label className="w-full h-[394px] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-800/20 hover:bg-gray-800/40 transition-colors duration-200 cursor-pointer">
                                                <div className="text-center">
                                                    <div className="text-6xl text-gray-500 mb-2">+</div>
                                                    <div className="text-gray-400 text-sm">썸네일 이미지를 선택하세요</div>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploadingImage}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {/* 버튼들 - 이미지가 있을 때만 표시 */}
                                    {formData.thumbnail && (
                                        <div className="flex flex-col space-y-3">
                                            <label className="flex items-center justify-center w-12 h-12 bg-purple-600/90 hover:bg-purple-600 text-white rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 backdrop-blur-sm">
                                                <Upload className="w-5 h-5" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploadingImage}
                                                    className="hidden"
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={removeThumbnail}
                                                className="flex items-center justify-center w-12 h-12 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/25 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/20 backdrop-blur-sm"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 제목 입력 */}
                        <div className="mb-6">
                            <div className="max-w-4xl mx-auto">
                                <input
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-400 resize-none"
                                    placeholder="제목을 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 설명 입력 */}
                        <div className="mb-4">
                            <div className="max-w-4xl mx-auto">
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={2}
                                    className="w-full text-lg sm:text-xl bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 resize-none"
                                    placeholder="게시물에 대한 간단한 설명을 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 메타데이터 입력 */}
                        <div className="mb-8">
                            <div className="max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* 슬러그 */}
                                    <div>
                                        <input
                                            id="slug"
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => handleInputChange('slug', e.target.value)}
                                            className="w-full text-lg bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 resize-none font-mono"
                                            placeholder="URL 슬러그를 입력하세요"
                                        />
                                        <div className="text-xs text-gray-500 mt-1">
                                            영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다. (예: my-post-title)
                                        </div>
                                    </div>

                                    {/* 카테고리 */}
                                    <Select
                                        options={categories.map(cat => ({
                                            id: cat.id,
                                            name: cat.name,
                                            color: undefined
                                        }))}
                                        value={formData.category}
                                        onChange={(value) => handleInputChange('category', value)}
                                        placeholder="카테고리를 선택하세요"
                                        loading={loadingCategories}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 게시물 내용 작성 */}
                        <div className="mb-8">
                            <div className="max-w-4xl mx-auto">
                                {/* 구분선 */}
                                <div className="mb-6">
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-500/60 to-transparent"></div>
                                </div>

                                <NovelEditor
                                    initialContent={content}
                                    onUpdate={setContent}
                                    placeholder="게시물 내용을 작성하세요..."
                                    className="min-h-[600px] text-lg sm:text-xl"
                                    showToolbar={false}
                                    showStatus={false}
                                />
                            </div>
                        </div>

                        {/* 하단 여백 (고정 메뉴바 공간 확보) */}
                        <div className="h-24"></div>
                    </div>
                </main>
            </div>

            {/* 하단 고정 액션 메뉴바 */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl shadow-2xl">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        {/* 왼쪽: 게시물 목록으로 버튼 */}
                        <Link
                            href="/dashboard/posts"
                            className="flex items-center space-x-2 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 font-medium group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>게시물 목록으로</span>
                        </Link>

                        {/* 오른쪽: 액션 버튼들 */}
                        <div className="flex items-center space-x-3">
                            {/* 취소 버튼 */}
                            <Link
                                href="/dashboard/posts"
                                className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 font-medium"
                            >
                                취소
                            </Link>

                            {/* 저장 버튼 */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-300 font-medium disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                        <span>저장 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>{isEditing ? '게시물 수정' : '게시물 저장'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 