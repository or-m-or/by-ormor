'use client';

import { useState, useEffect, useCallback } from 'react';
import BlogCard from './BlogCard';
import { getAllPosts } from '@/lib/database';
import { Post } from '@/lib/supabase';

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('게시물 로드 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 무한스크롤 로드 함수
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 실제 API 호출을 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 현재는 모든 포스트를 한 번에 로드하므로 더 이상 로드할 것이 없음
    setHasMore(false);
    setLoading(false);
  }, [loading, hasMore]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            summary={post.description}
            imageUrl={post.thumbnail}
            publishedDate={new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            readTime="5 min read"
            category={post.category}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 포스트를 불러왔습니다.
        </div>
      )}
    </div>
  );
};

export default BlogList; 