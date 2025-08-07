import { supabase, Post } from './supabase';
import type { Category } from './categories';

// 카테고리 타입 정의
export interface CategoryData {
  id?: number;
  name: string;
  slug: string;
  color: string;
  bg_color: string;
  bg_opacity: string;
  text_color: string;
  sort_order: number;
  is_active: boolean;
}

// SNS 링크 타입 정의
export interface SocialLink {
  id: number;
  platform: string;
  display_name: string;
  url: string;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// 모든 게시물 가져오기 (카테고리 join) - 활성화된 게시물만
export async function getAllPosts(): Promise<(Post & { category: Category })[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('게시물 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('게시물 조회 중 예외 발생:', error);
    return [];
  }
}

// 관리자용: 모든 게시물 가져오기 (활성화/비활성화 관계없이)
export async function getAllPostsForAdmin(): Promise<(Post & { category: Category })[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('관리자용 게시물 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('관리자용 게시물 조회 중 예외 발생:', error);
    return [];
  }
}

// 특정 게시물 가져오기 (slug로, 카테고리 join) - 활성화된 게시물만
export async function getPostBySlug(slug: string): Promise<(Post & { category: Category }) | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('게시물 조회 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('게시물 조회 중 예외 발생:', error);
    return null;
  }
}

// 관리자용: 특정 게시물 가져오기 (slug로, 카테고리 join) - 활성화/비활성화 관계없이
export async function getPostBySlugForAdmin(slug: string): Promise<(Post & { category: Category }) | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('관리자용 게시물 조회 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('관리자용 게시물 조회 중 예외 발생:', error);
    return null;
  }
}

// 게시물 생성
export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post | null> {
  try {
    // is_active가 설정되지 않은 경우 기본값으로 true 설정
    const postData = {
      ...post,
      is_active: post.is_active ?? true
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('게시물 생성 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('게시물 생성 중 예외 발생:', error);
    return null;
  }
}

// 게시물 업데이트 (slug로)
export async function updatePost(slug: string, updates: Partial<Post>): Promise<Post | null> {
  try {
    console.log('업데이트 시도:', { slug, updates });

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('게시물 업데이트 오류:', error);
      console.error('에러 객체 전체:', JSON.stringify(error, null, 2));
      console.error('에러 상세:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    console.log('업데이트 성공:', data);
    return data;
  } catch (error) {
    console.error('게시물 업데이트 중 예외 발생:', error);
    console.error('예외 객체 전체:', JSON.stringify(error, null, 2));
    return null;
  }
}

// 게시물 삭제
export async function deletePost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('게시물 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('게시물 삭제 중 예외 발생:', error);
    return false;
  }
}

// 게시물 활성화/비활성화 토글
export async function togglePostStatus(id: string): Promise<Post | null> {
  try {
    // 먼저 현재 게시물 상태를 확인
    const { data: currentPost, error: fetchError } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('게시물 상태 확인 오류:', fetchError);
      return null;
    }

    // 카테고리가 비활성화되어 있는지 확인
    if (currentPost.category && !currentPost.category.is_active) {
      throw new Error('CATEGORY_INACTIVE');
    }

    // 게시물 상태 토글
    const newStatus = !currentPost.is_active;
    const { data, error } = await supabase
      .from('posts')
      .update({ is_active: newStatus })
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) {
      console.error('게시물 상태 변경 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message === 'CATEGORY_INACTIVE') {
      throw error;
    }
    console.error('게시물 상태 변경 중 예외 발생:', error);
    return null;
  }
}

// 카테고리별 게시물 가져오기 (category_id) - 활성화된 게시물만
export async function getPostsByCategoryId(category_id: string): Promise<(Post & { category: Category })[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('category_id', category_id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('카테고리별 게시물 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('카테고리별 게시물 조회 중 예외 발생:', error);
    return [];
  }
}

// 검색 기능 (카테고리 join) - 활성화된 게시물만
export async function searchPosts(query: string): Promise<(Post & { category: Category })[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('게시물 검색 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('게시물 검색 중 예외 발생:', error);
    return [];
  }
}

// 카테고리 관리 함수들

// 모든 카테고리 가져오기
export async function getAllCategories(): Promise<CategoryData[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('카테고리 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('카테고리 조회 중 예외 발생:', error);
    return [];
  }
}

// 카테고리 생성
export async function createCategory(category: Omit<CategoryData, 'id'>): Promise<CategoryData | null> {
  try {
    // id 필드를 명시적으로 제거
    const categoryData = { ...category };
    delete (categoryData as { id?: number;[key: string]: unknown }).id;
    console.log('카테고리 생성 시도:', categoryData);

    // 먼저 기존 카테고리들을 확인
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('기존 카테고리 조회 오류:', fetchError);
    } else {
      console.log('기존 카테고리들:', existingCategories);
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('카테고리 생성 오류:', error);
      console.error('에러 객체 전체:', JSON.stringify(error, null, 2));
      console.error('에러 상세:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    console.log('카테고리 생성 성공:', data);
    return data;
  } catch (error) {
    console.error('카테고리 생성 중 예외 발생:', error);
    console.error('예외 객체 전체:', JSON.stringify(error, null, 2));
    return null;
  }
}

// 카테고리 업데이트
export async function updateCategory(id: number, updates: Partial<CategoryData>): Promise<CategoryData | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('카테고리 업데이트 오류:', error);
      return null;
    }

    // 카테고리 비활성화 시에만 해당 카테고리의 모든 게시물 상태도 함께 변경
    if (updates.hasOwnProperty('is_active') && !updates.is_active) {
      const { error: postsUpdateError } = await supabase
        .from('posts')
        .update({ is_active: false })
        .eq('category_id', id);

      if (postsUpdateError) {
        console.error('연관 게시물 상태 업데이트 오류:', postsUpdateError);
        // 카테고리 업데이트는 성공했지만 게시물 업데이트가 실패한 경우
        // 사용자에게 알림을 주거나 롤백을 고려할 수 있습니다
      } else {
        console.log(`카테고리 ID ${id}의 비활성화와 함께 연관 게시물들도 비활성화되었습니다.`);
      }
    }

    return data;
  } catch (error) {
    console.error('카테고리 업데이트 중 예외 발생:', error);
    return null;
  }
}

// 카테고리 삭제 (관련 게시물들을 ETC로 변경 후 삭제)
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    // 1. ETC 카테고리 ID 찾기
    const { data: etcCategory, error: etcError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'ETC')
      .single();

    if (etcError) {
      console.error('ETC 카테고리 조회 오류:', etcError);
      return false;
    }

    // 2. 해당 카테고리를 사용하는 모든 게시물을 ETC로 변경
    const { error: updateError } = await supabase
      .from('posts')
      .update({ category_id: etcCategory.id })
      .eq('category_id', id);

    if (updateError) {
      console.error('게시물 카테고리 업데이트 오류:', updateError);
      return false;
    }

    // 3. 카테고리 삭제
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('카테고리 삭제 오류:', deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('카테고리 삭제 중 예외 발생:', error);
    return false;
  }
}

// SNS 링크 조회
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('SNS 링크 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('SNS 링크 조회 중 예외 발생:', error);
    return [];
  }
}

// SNS 링크 생성
export async function createSocialLink(link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>): Promise<SocialLink | null> {
  try {
    console.log('SNS 링크 생성 시도:', link);

    const { data, error } = await supabase
      .from('social_links')
      .insert([link])
      .select()
      .single();

    if (error) {
      console.error('SNS 링크 생성 오류:', error);
      console.error('에러 객체 전체:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('SNS 링크 생성 성공:', data);
    return data;
  } catch (error) {
    console.error('SNS 링크 생성 중 예외 발생:', error);
    console.error('예외 객체 전체:', JSON.stringify(error, null, 2));
    return null;
  }
}

// SNS 링크 업데이트
export async function updateSocialLink(platform: string, updates: Partial<SocialLink>): Promise<SocialLink | null> {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .update(updates)
      .eq('platform', platform)
      .select()
      .single();

    if (error) {
      console.error('SNS 링크 업데이트 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('SNS 링크 업데이트 중 예외 발생:', error);
    return null;
  }
}

// SNS 링크 삭제
export async function deleteSocialLink(platform: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('platform', platform);

    if (error) {
      console.error('SNS 링크 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('SNS 링크 삭제 중 예외 발생:', error);
    return false;
  }
}

// 모든 SNS 링크 조회 (관리용 - 비활성 포함)
export async function getAllSocialLinks(): Promise<SocialLink[]> {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('SNS 링크 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('SNS 링크 조회 중 예외 발생:', error);
    return [];
  }
} 