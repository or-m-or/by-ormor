'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCategoryStyleByName, CategoryStyle } from '@/lib/categories';

interface SearchResultCardProps {
    id: string;
    title: string;
    summary: string;
    publishedDate: string;
    readTime: string;
    category: string;
    slug: string;
    imageUrl?: string;
}

export function SearchResultCard({
    title,
    summary,
    publishedDate,
    readTime,
    category,
    slug,
    imageUrl
}: SearchResultCardProps) {
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
        <Link href={`/posts/${slug}`} className="block">
            <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl transition-all duration-300 hover:bg-gray-800/20 hover:shadow-xl hover:shadow-purple-500/20 border-0 p-6 backdrop-blur-sm shadow-lg">
                {/* Background Image with Gradient */}
                {imageUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-300"
                        style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundPosition: 'right center'
                        }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10">
                    {/* Title */}
                    <h3 className="mb-3 text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                        {title}
                    </h3>

                    {/* Summary */}
                    <p className="mb-4 flex-1 text-sm text-gray-300 line-clamp-2 leading-relaxed">
                        {summary}
                    </p>

                    {/* Date, Read Time and Category */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                            <span>{publishedDate}</span>
                            <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{readTime}</span>
                            </div>
                        </div>
                        <div className={`rounded-full ${categoryStyle.bg} px-3 py-1.5 text-xs font-medium ${categoryStyle.text} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
                            {category}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
} 