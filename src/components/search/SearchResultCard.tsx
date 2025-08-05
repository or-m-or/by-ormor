'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';

interface SearchResultCardProps {
    id: string;
    title: string;
    summary: string;
    publishedDate: string;
    readTime: string;
    category: string;
    slug: string;
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

export function SearchResultCard({
    title,
    summary,
    publishedDate,
    readTime,
    category,
    slug
}: SearchResultCardProps) {
    const categoryColor = getCategoryColor(category);

    return (
        <Link href={`/posts/${slug}`} className="block">
            <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg transition-all hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-gray-900/50 border border-gray-800/30 p-4">
                {/* Title */}
                <h3 className="mb-2 text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                    {title}
                </h3>

                {/* Summary */}
                <p className="mb-3 flex-1 text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    {summary}
                </p>

                {/* Date, Read Time and Category */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>{publishedDate}</span>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{readTime}</span>
                        </div>
                    </div>
                    <div className={`rounded-full ${categoryColor.bg} px-3 py-1 text-xs font-medium ${categoryColor.text}`}>
                        {category}
                    </div>
                </div>
            </div>
        </Link>
    );
} 