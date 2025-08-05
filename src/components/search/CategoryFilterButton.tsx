interface CategoryFilterButtonProps {
    category: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}

const categoryStyles: Record<string, string> = {
    'ALL': 'bg-white/10 text-white/80',
    '개발': 'bg-blue-500/10 text-blue-400',
    '기술': 'bg-green-500/10 text-green-400',
    '일상': 'bg-purple-500/10 text-purple-400',
    '리뷰': 'bg-yellow-500/10 text-yellow-400',
    '튜토리얼': 'bg-pink-500/10 text-pink-400',
    '프로젝트': 'bg-indigo-500/10 text-indigo-400',
    '회고': 'bg-red-500/10 text-red-400',
    '팁': 'bg-teal-500/10 text-teal-400',
    '소개': 'bg-orange-500/10 text-orange-400',
    '경험': 'bg-cyan-500/10 text-cyan-400',
};

export const CategoryFilterButton = ({
    category,
    count,
    isActive,
    onClick,
}: CategoryFilterButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all hover:opacity-80 ${categoryStyles[category] || 'bg-gray-500/10 text-gray-400'
                } ${isActive ? 'ring-2 ring-white/20' : ''}`}
        >
            <span className='text-sm font-medium'>{category}</span>
            <span className='rounded-full bg-white/10 px-2 py-0.5 text-xs'>{count}</span>
        </button>
    );
}; 