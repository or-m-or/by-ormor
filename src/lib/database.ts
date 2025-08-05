import { supabase, Post } from './supabase';

// 모든 게시물 가져오기
export async function getAllPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

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

// 특정 게시물 가져오기 (slug로)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
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

// 게시물 생성
export async function createPost(post: Omit<Post, 'created_at' | 'updated_at'>): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
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

// 게시물 업데이트
export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('게시물 업데이트 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('게시물 업데이트 중 예외 발생:', error);
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

// 카테고리별 게시물 가져오기
export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });

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

// 검색 기능
export async function searchPosts(query: string): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('date', { ascending: false });

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