'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PostForm from '@/components/PostForm';
import { createPost } from '@/lib/database';
import type { JSONContent } from 'novel';

interface PostFormData {
    title: string;
    slug: string;
    description: string;
    category: string;
    category_id: number;
    thumbnail: string;
}

export default function NewPostPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleSave = async (formData: PostFormData, content: JSONContent | null) => {
        try {
            await createPost({
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                category_id: formData.category_id,
                thumbnail: formData.thumbnail,
                content: content || '',
                date: new Date().toISOString().split('T')[0]
            });

            alert('게시물이 성공적으로 저장되었습니다!');
            router.push('/dashboard/posts');
        } catch (error) {
            console.error('게시물 저장 중 오류:', error);
            throw error; // PostForm에서 처리하도록 에러를 다시 던짐
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <PostForm
            onSave={handleSave}
            isEditing={false}
            loading={false}
        />
    );
} 