interface Props {
  category: string;
  className?: string;
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

export const CategoryBadge = ({ category, className }: Props) => {
  const categoryColor = getCategoryColor(category);

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${categoryColor.bg} ${categoryColor.text} ${className ?? ''}`}>
      {category}
    </span>
  );
}; 