'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PostForm from '@/components/PostForm';
import { getPostBySlugForAdmin, updatePost } from '@/lib/database';
import type { JSONContent } from 'novel';
import { defaultEditorContent } from '@/lib/content';

interface PostFormData {
    title: string;
    slug: string;
    description: string;
    category: string;
    category_id: number;
    thumbnail: string;
}

export default function EditPostPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [loadingPost, setLoadingPost] = useState(true);
    const [initialData, setInitialData] = useState<PostFormData | undefined>();
    const [initialContent, setInitialContent] = useState<JSONContent | null>(null);

    // loadPost를 useCallback으로 감싸서 의존성 문제 해결
    const loadPost = useCallback(async () => {
        try {
            setLoadingPost(true);
            const post = await getPostBySlugForAdmin(slug);

            if (post) {
                setInitialData({
                    title: post.title || '',
                    slug: post.slug || '',
                    description: post.description || '',
                    category: post.category?.name || '',
                    category_id: post.category_id || 0,
                    thumbnail: post.thumbnail || ''
                });

                // content가 JSONContent 형태인지 확인하고 설정
                if (post.content) {
                    try {
                        const parsedContent = typeof post.content === 'string'
                            ? JSON.parse(post.content)
                            : post.content;
                        setInitialContent(parsedContent && typeof parsedContent === 'object' ? parsedContent : defaultEditorContent);
                    } catch (error) {
                        console.error('Content parsing error:', error);
                        setInitialContent(defaultEditorContent);
                    }
                } else {
                    setInitialContent(defaultEditorContent);
                }
            } else {
                console.error('게시물을 찾을 수 없습니다:', slug);
                alert('게시물을 찾을 수 없습니다.');
                router.push('/dashboard/posts');
            }
        } catch (error) {
            console.error('게시물 로드 중 오류:', error);
            alert('게시물을 불러오는 중 오류가 발생했습니다.');
            router.push('/dashboard/posts');
        } finally {
            setLoadingPost(false);
        }
    }, [slug, router]);

    useEffect(() => {
        if (slug) {
            loadPost();
        }
    }, [slug, loadPost]);

    const handleSave = async (formData: PostFormData, content: JSONContent | null) => {
        try {
            await updatePost(slug, {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                category_id: formData.category_id,
                thumbnail: formData.thumbnail,
                content: content || '',
                date: new Date().toISOString().split('T')[0]
            });

            alert('게시물이 성공적으로 수정되었습니다!');
            router.push('/dashboard/posts');
        } catch (error) {
            console.error('게시물 수정 중 오류:', error);
            throw error; // PostForm에서 처리하도록 에러를 다시 던짐
        }
    };

    if (loading || loadingPost) {
        console.log('로딩 상태 렌더링');
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (!user) {
        console.log('사용자 없음 - 로그인 페이지로 이동');
        router.push('/login');
        return null;
    }

    console.log('PostForm 렌더링 시작');
    return (
        <PostForm
            initialData={initialData}
            initialContent={initialContent || defaultEditorContent}
            onSave={handleSave}
            isEditing={true}
            loading={loadingPost}
        />
    );
} 