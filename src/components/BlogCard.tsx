'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';

interface BlogCardProps {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    publishedDate: string;
    readTime: string;
    category: string;
}

const getCategoryColor = (category: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
        '개발': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
        '기술': { bg: 'bg-green-500/20', text: 'text-green-400' },
        '일상': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
        '리뷰': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
        '튜토리얼': { bg: 'bg-pink-500/20', text: 'text-pink-400' },
        '프로젝트': { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
        '회고': { bg: 'bg-red-500/20', text: 'text-red-400' },
        '팁': { bg: 'bg-teal-500/20', text: 'text-teal-400' },
        '소개': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
        '경험': { bg: 'bg-cyan-500/20', text: 'text-cyan-400' }
    };

    return colorMap[category] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };
};

const BlogCard = ({
    id,
    title,
    summary,
    imageUrl,
    publishedDate,
    readTime,
    category
}: BlogCardProps) => {
    const categoryColor = getCategoryColor(category);

    return (
        <Link href={`/posts/${id}`}>
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
                                    // 이미지 로드 실패시 기본 이모지 표시
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                }}
                            />
                            <div className="fallback absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                                <div className="text-white text-4xl font-bold">📝</div>
                            </div>
                        </>
                    ) : (
                        // 이미지가 없는 경우 기본 이모지 표시
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-4xl font-bold">📝</div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <div className={`rounded-full ${categoryColor.bg} px-3 py-1 text-xs font-medium ${categoryColor.text} backdrop-blur-sm`}>
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