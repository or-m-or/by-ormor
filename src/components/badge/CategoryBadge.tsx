import { useState, useEffect } from 'react';
import { getCategoryStyleByName, CategoryStyle } from '@/lib/categories';

interface Props {
  category: string;
  className?: string;
}

export const CategoryBadge = ({ category, className }: Props) => {
  const [categoryStyle, setCategoryStyle] = useState<CategoryStyle>({ bg: 'bg-gray-600/80', text: 'text-gray-100' });

  useEffect(() => {
    const loadCategoryStyle = async () => {
      const style = await getCategoryStyleByName(category);
      setCategoryStyle(style);
    };
    loadCategoryStyle();
  }, [category]);

  return (
    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${categoryStyle.bg} ${categoryStyle.text} backdrop-blur-md border border-white/30 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-200 ${className ?? ''}`}>
      {category}
    </span>
  );
}; 