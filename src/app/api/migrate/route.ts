import { NextResponse } from 'next/server';
import { createPost } from '@/lib/database';

// 샘플 게시물 데이터
const samplePosts = [
  {
    id: 'getting-started-with-nextjs',
    slug: 'getting-started-with-nextjs',
    title: 'Next.js 시작하기',
    thumbnail: 'https://lgqktvsmaqeexvywkmxf.supabase.co/storage/v1/object/public/blog-images/nextjs-start.jpg',
    category: '개발',
    date: '2024-01-15',
    description: 'Next.js 프레임워크를 사용하여 웹 애플리케이션을 개발하는 방법을 알아봅니다.',
    content: `
            <h1>Next.js 시작하기</h1>
            <p>Next.js는 React 기반의 풀스택 웹 프레임워크입니다. 이 글에서는 Next.js의 기본 개념과 설치 방법에 대해 알아보겠습니다.</p>
            
            <h2>Next.js란?</h2>
            <p>Next.js는 React 애플리케이션을 위한 프레임워크로, 다음과 같은 기능들을 제공합니다:</p>
            <ul>
                <li>서버 사이드 렌더링 (SSR)</li>
                <li>정적 사이트 생성 (SSG)</li>
                <li>자동 코드 분할</li>
                <li>API 라우트</li>
            </ul>
            
            <h2>설치 방법</h2>
            <p>Next.js 프로젝트를 시작하는 방법은 다음과 같습니다:</p>
            <pre><code>npx create-next-app@latest my-app
cd my-app
npm run dev</code></pre>
            
            <h2>기본 구조</h2>
            <p>Next.js 프로젝트의 기본 구조는 다음과 같습니다:</p>
            <ul>
                <li><code>pages/</code>: 라우팅을 위한 디렉토리</li>
                <li><code>public/</code>: 정적 파일들</li>
                <li><code>styles/</code>: CSS 파일들</li>
            </ul>
        `
  },
  {
    id: 'typescript-best-practices',
    slug: 'typescript-best-practices',
    title: 'TypeScript 모범 사례',
    thumbnail: 'https://lgqktvsmaqeexvywkmxf.supabase.co/storage/v1/object/public/blog-images/typescript-best-practices.jpg',
    category: '개발',
    date: '2024-01-20',
    description: 'TypeScript를 효과적으로 사용하기 위한 모범 사례와 팁들을 정리했습니다.',
    content: `
            <h1>TypeScript 모범 사례</h1>
            <p>TypeScript는 JavaScript에 타입 안전성을 추가한 언어입니다. 이 글에서는 TypeScript를 효과적으로 사용하는 방법에 대해 알아보겠습니다.</p>
            
            <h2>타입 정의의 중요성</h2>
            <p>TypeScript에서 타입을 명시적으로 정의하는 것은 코드의 안정성과 가독성을 높이는 데 도움이 됩니다.</p>
            
            <h3>인터페이스 사용하기</h3>
            <pre><code>interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}</code></pre>
            
            <h2>제네릭 활용하기</h2>
            <p>제네릭을 사용하면 재사용 가능한 타입 안전한 컴포넌트를 만들 수 있습니다.</p>
            <pre><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}</code></pre>
            
            <h2>유니온 타입과 타입 가드</h2>
            <p>유니온 타입을 사용하여 다양한 타입을 처리할 수 있습니다.</p>
            <pre><code>type Status = 'loading' | 'success' | 'error';

function handleStatus(status: Status) {
  switch (status) {
    case 'loading':
      return '로딩 중...';
    case 'success':
      return '성공!';
    case 'error':
      return '오류 발생';
  }
}</code></pre>
        `
  },
  {
    id: 'tailwind-css-tips',
    slug: 'tailwind-css-tips',
    title: 'Tailwind CSS 유용한 팁',
    thumbnail: 'https://lgqktvsmaqeexvywkmxf.supabase.co/storage/v1/object/public/blog-images/tailwind-css-tips.jpg',
    category: '개발',
    date: '2024-01-25',
    description: 'Tailwind CSS를 더 효율적으로 사용하기 위한 유용한 팁들을 모았습니다.',
    content: `
            <h1>Tailwind CSS 유용한 팁</h1>
            <p>Tailwind CSS는 유틸리티 퍼스트 CSS 프레임워크로, 빠른 UI 개발을 가능하게 합니다. 이 글에서는 Tailwind CSS를 더 효율적으로 사용하는 방법에 대해 알아보겠습니다.</p>
            
            <h2>반응형 디자인</h2>
            <p>Tailwind CSS의 반응형 접두사를 사용하여 다양한 화면 크기에 대응할 수 있습니다.</p>
            <pre><code>&lt;div class="w-full md:w-1/2 lg:w-1/3"&gt;
  반응형 컨테이너
&lt;/div&gt;</code></pre>
            
            <h2>커스텀 클래스 만들기</h2>
            <p>@apply 지시어를 사용하여 커스텀 클래스를 만들 수 있습니다.</p>
            <pre><code>.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}</code></pre>
            
            <h2>다크 모드 지원</h2>
            <p>dark: 접두사를 사용하여 다크 모드를 쉽게 구현할 수 있습니다.</p>
            <pre><code>&lt;div class="bg-white dark:bg-gray-800 text-black dark:text-white"&gt;
  다크 모드 지원 요소
&lt;/div&gt;</code></pre>
            
            <h2>애니메이션과 트랜지션</h2>
            <p>Tailwind CSS는 다양한 애니메이션과 트랜지션 클래스를 제공합니다.</p>
            <pre><code>&lt;button class="transform hover:scale-105 transition-transform duration-200"&gt;
  호버 효과
&lt;/button&gt;</code></pre>
            
            <h2>그리드 시스템</h2>
            <p>CSS Grid와 Flexbox를 쉽게 사용할 수 있습니다.</p>
            <pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"&gt;
  &lt;div class="bg-gray-200 p-4"&gt;아이템 1&lt;/div&gt;
  &lt;div class="bg-gray-200 p-4"&gt;아이템 2&lt;/div&gt;
  &lt;div class="bg-gray-200 p-4"&gt;아이템 3&lt;/div&gt;
&lt;/div&gt;</code></pre>
        `
  }
];

export async function POST() {
  try {
    // 기존 데이터 삭제
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('posts').delete().neq('id', '');

    // 샘플 게시물 생성
    const createdPosts = [];
    for (const post of samplePosts) {
      const createdPost = await createPost(post);
      if (createdPost) {
        createdPosts.push(createdPost);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdPosts.length}개의 게시물이 성공적으로 생성되었습니다.`,
      posts: createdPosts
    });
  } catch (error) {
    console.error('마이그레이션 중 오류:', error);
    return NextResponse.json(
      { success: false, message: '마이그레이션 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 