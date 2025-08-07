import { useState, useEffect } from 'react';
import { getCategoryStyleByName, CategoryStyle } from '@/lib/categories';

interface CategoryFilterButtonProps {
    category: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}

export const CategoryFilterButton = ({
    category,
    count,
    isActive,
    onClick,
}: CategoryFilterButtonProps) => {
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
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-200 backdrop-blur-md shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:scale-105 ${categoryStyle.bg} ${categoryStyle.text} ${isActive ? 'ring-2 ring-white/40 shadow-xl shadow-black/40' : ''}`}
        >
            <span className='text-sm font-medium'>{category}</span>
            <span className='rounded-full bg-white/10 px-2 py-0.5 text-xs'>{count}</span>
        </button>
    );
}; 