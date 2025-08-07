import { supabase } from './supabase';

export interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    bg_color: string;
    bg_opacity: string;
    text_color: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CategoryStyle {
    bg: string;
    text: string;
}

// 카테고리 스타일을 생성하는 함수
export const getCategoryStyle = (category: Category): CategoryStyle => {
    return {
        bg: category.bg_color, // 그라데이션은 opacity를 포함하므로 그대로 사용
        text: `text-${category.text_color} font-medium`
    };
};

// 카테고리 이름으로 스타일을 가져오는 함수 (동적)
export const getCategoryStyleByName = async (categoryName: string): Promise<CategoryStyle> => {
    // ALL 또는 전체는 기본 스타일 반환
    if (categoryName === 'ALL' || categoryName === '전체') {
        return { bg: 'bg-white/10', text: 'text-white/80' };
    }

    try {
        // 먼저 활성화된 카테고리에서 찾기
        let category = await getCategoryByName(categoryName);

        // 활성화된 카테고리가 없으면 비활성화된 카테고리도 확인
        if (!category) {
            category = await getCategoryByNameForAdmin(categoryName);
            if (category && !category.is_active) {
                // 카테고리가 비활성화되어 있으면 기본 스타일 반환
                return { bg: 'bg-gray-600/80', text: 'text-gray-100' };
            }
        }

        if (category) {
            return getCategoryStyle(category);
        }
    } catch (error) {
        console.error('카테고리 스타일 로드 중 오류:', error);
    }

    // 기본값 반환
    return { bg: 'bg-gray-600/80', text: 'text-gray-100' };
};

// 동기 버전 (기존 코드 호환성을 위해)
export const getCategoryStyleByNameSync = (categoryName: string): CategoryStyle => {
    if (categoryName === 'ALL' || categoryName === '전체') {
        return { bg: 'bg-white/10', text: 'text-white/80' };
    }
    return { bg: 'bg-gray-600/80', text: 'text-gray-100' };
};

// 모든 활성 카테고리를 가져오는 함수
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('카테고리 로드 중 오류:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('카테고리 로드 중 오류:', error);
        return [];
    }
};

// 카테고리 이름으로 카테고리를 찾는 함수
export const getCategoryByName = async (name: string): Promise<Category | null> => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('name', name)
            .eq('is_active', true)
            .maybeSingle();

        if (error) {
            console.error('카테고리 검색 중 오류:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('카테고리 검색 중 오류:', error);
        return null;
    }
};

// 카테고리 이름으로 카테고리를 찾는 함수 (모든 카테고리, 관리자용)
export const getCategoryByNameForAdmin = async (name: string): Promise<Category | null> => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('name', name)
            .maybeSingle();

        if (error) {
            console.error('카테고리 검색 중 오류:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('카테고리 검색 중 예외 발생:', error);
        return null;
    }
};

// 카테고리 slug로 카테고리를 찾는 함수
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .maybeSingle();

        if (error) {
            console.error('카테고리 검색 중 오류:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('카테고리 검색 중 오류:', error);
        return null;
    }
};

// 카테고리별 게시물 수를 가져오는 함수
export const getCategoryPostCount = async (categoryName: string, searchQuery?: string): Promise<number> => {
    try {
        let query = supabase
            .from('posts')
            .select('id', { count: 'exact' });

        if (categoryName !== 'ALL' && categoryName !== '전체') {
            // 카테고리 이름으로 카테고리 ID를 찾아서 필터링
            const category = await getCategoryByName(categoryName);
            if (category) {
                query = query.eq('category_id', category.id);
            } else {
                return 0; // 카테고리를 찾을 수 없으면 0 반환
            }
        }

        if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { count, error } = await query;

        if (error) {
            console.error('카테고리별 게시물 수 조회 중 오류:', error);
            return 0;
        }

        return count || 0;
    } catch (error) {
        console.error('카테고리별 게시물 수 조회 중 오류:', error);
        return 0;
    }
};

// 새 카테고리 생성
export const createCategory = async (categoryData: {
    name: string;
    slug: string;
    color: string;
    bg_color: string;
    bg_opacity?: string;
    text_color?: string;
    sort_order?: number;
}): Promise<Category | null> => {
    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
            throw new Error('카테고리 생성 실패');
        }

        return await response.json();
    } catch (error) {
        console.error('카테고리 생성 중 오류:', error);
        return null;
    }
};

// 카테고리 수정
export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category | null> => {
    try {
        const response = await fetch('/api/categories', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...categoryData }),
        });

        if (!response.ok) {
            throw new Error('카테고리 수정 실패');
        }

        return await response.json();
    } catch (error) {
        console.error('카테고리 수정 중 오류:', error);
        return null;
    }
};

// 카테고리 삭제 (비활성화)
export const deleteCategory = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`/api/categories?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('카테고리 삭제 실패');
        }

        return true;
    } catch (error) {
        console.error('카테고리 삭제 중 오류:', error);
        return false;
    }
}; 