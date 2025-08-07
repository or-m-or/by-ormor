import { useState, useEffect } from 'react';
import { getCategoryStyleByName, CategoryStyle, getCategoryByNameForAdmin } from '@/lib/categories';
import { toast } from 'sonner';

interface Props {
  category: string;
  className?: string;
}

export const CategoryBadge = ({ category, className }: Props) => {
  const [categoryStyle, setCategoryStyle] = useState<CategoryStyle>({ bg: 'bg-gray-600/80', text: 'text-gray-100' });

  useEffect(() => {
    const loadCategoryStyle = async () => {
      try {
        // 먼저 활성화된 카테고리에서 찾기
        const activeCategory = await getCategoryStyleByName(category);
        setCategoryStyle(activeCategory);

        // 카테고리가 비활성화되어 있는지 확인
        const categoryData = await getCategoryByNameForAdmin(category);
        if (categoryData && !categoryData.is_active) {
          toast.warning(`'${category}' 카테고리가 비활성화되어 있습니다.`, {
            description: '카테고리 관리 페이지에서 활성화할 수 있습니다.',
            duration: 4000,
          });
        }
      } catch (error) {
        console.error('카테고리 스타일 로드 중 오류:', error);
        setCategoryStyle({ bg: 'bg-gray-600/80', text: 'text-gray-100' });
      }
    };
    loadCategoryStyle();
  }, [category]);

  return (
    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${categoryStyle.bg} ${categoryStyle.text} border-0 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-200 ${className ?? ''}`}>
      {category}
    </span>
  );
}; 