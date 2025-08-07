'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCategoryStyleByName, CategoryStyle } from '@/lib/categories';

interface BlogCardProps {
    slug: string;
    title: string;
    summary: string;
    imageUrl: string;
    publishedDate: string;
    readTime: string;
    category?: string;
}

const BlogCard = ({
    slug,
    title,
    summary,
    imageUrl,
    publishedDate,
    readTime,
    category
}: BlogCardProps) => {
    const [categoryStyle, setCategoryStyle] = useState<CategoryStyle>({ bg: 'bg-gray-600/80', text: 'text-gray-100' });

    useEffect(() => {
        const loadCategoryStyle = async () => {
            const style = await getCategoryStyleByName(category || '');
            setCategoryStyle(style);
        };
        loadCategoryStyle();
    }, [category]);

    return (
        <Link href={`/posts/${slug}`}>
            <article className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg transition-all hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-gray-900/50">
                {/* Featured Image */}
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-gray-800">
                    {imageUrl && imageUrl !== '' ? (
                        <>
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    // 이미지 로드 실패시 기본 이미지로 변경
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/default-thumbnail.jpg';
                                }}
                            />

                        </>
                    ) : (
                        // 이미지가 없는 경우 기본 이미지 표시
                        <img
                            src="/images/default-thumbnail.jpg"
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <div className={`rounded-full ${categoryStyle.bg} px-3 py-1.5 text-xs font-medium ${categoryStyle.text} backdrop-blur-md border-0 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-200`}>
                            {category}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col px-4 pb-4">
                    {/* Title */}
                    <h2 className="mb-2 text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                        {title}
                    </h2>

                    {/* Summary */}
                    <p className="mb-4 flex-1 text-sm text-gray-300 line-clamp-2 leading-relaxed">
                        {summary}
                    </p>

                    {/* Date and Read Time */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{publishedDate}</span>
                            <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default BlogCard; 