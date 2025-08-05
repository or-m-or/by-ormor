'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from '@/components/badge/CategoryBadge';
import { Post } from '@/lib/supabase';

interface Props {
    post: Post;
}

export const PostHeader = ({ post }: Props) => {
    const { title, thumbnail, category, date, description } = post;

    // 날짜를 '2024년 1월 15일' 형식으로 변환
    const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // 썸네일 이미지 처리 (Supabase Storage URL 또는 fallback)
    const imageUrl = thumbnail.startsWith('http') ? thumbnail : '/api/placeholder/400/225';

    return (
        <header className="mt-0 mb-12 sm:mb-16 text-center">
            {/* 썸네일 */}
            <div className="relative mx-auto mb-6 sm:mb-8 aspect-video w-full max-w-full sm:max-w-4xl overflow-hidden rounded-lg sm:rounded-xl">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                        // 이미지 로드 실패 시 fallback
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/400/225';
                    }}
                />
            </div>

            {/* 카테고리 */}
            <div className="mb-4 sm:mb-6 max-w-full sm:max-w-4xl mx-auto text-left px-1">
                <CategoryBadge category={category} className="transition-transform hover:scale-105" />
            </div>

            {/* 제목 */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-left tracking-tight leading-tight text-white mb-4 sm:mb-6 px-1">
                {title}
            </h1>

            {/* 설명 */}
            {description && (
                <div className="mb-4 sm:mb-6 max-w-full sm:max-w-4xl mx-auto text-left px-1">
                    <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            )}

            {/* 날짜 */}
            <div className="mb-6 sm:mb-8 max-w-full sm:max-w-4xl mx-auto text-left px-1">
                <p className="text-xs sm:text-sm text-gray-400">{formattedDate}</p>
                <div className="mt-4 sm:mt-6 border-t border-gray-700" />
            </div>
        </header>
    );
}; 