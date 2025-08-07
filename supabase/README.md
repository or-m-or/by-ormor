# Supabase 데이터베이스 설정

이 폴더에는 블로그 시스템에 필요한 모든 데이터베이스 스키마와 샘플 데이터가 포함되어 있습니다.

## SQL 파일 목록

### 1. `supabase-schema.sql` - 메인 스키마
블로그의 핵심 테이블들을 생성합니다:
- `categories`: 카테고리 관리
- `posts`: 게시물 관리
- 기타 관련 테이블들

### 2. `sample-data.sql` - 샘플 데이터
기본 카테고리와 샘플 게시물 데이터를 추가합니다.

### 3. `social-links.sql` - SNS 링크 관리
Footer에 표시되는 SNS 링크들을 관리하는 테이블을 생성합니다:
- `social_links`: GitHub, Instagram, Email 등 SNS 링크 관리

## 실행 순서

### Supabase Dashboard에서:
1. Supabase 프로젝트 대시보드 접속
2. SQL Editor로 이동
3. 다음 순서로 SQL 파일들을 실행:

```sql
-- 1. 메인 스키마 생성
-- supabase/supabase-schema.sql 파일의 내용을 복사하여 실행

-- 2. 샘플 데이터 추가 (선택사항)
-- supabase/sample-data.sql 파일의 내용을 복사하여 실행

-- 3. SNS 링크 테이블 생성
-- supabase/social-links.sql 파일의 내용을 복사하여 실행
```

### 또는 Supabase CLI 사용:
```bash
supabase db push
```

## 테이블 구조

### 1. categories (카테고리 테이블)
- `id`: 고유 식별자 (UUID)
- `name`: 카테고리 이름 (한국어)
- `slug`: URL용 슬러그
- `color`: Tailwind CSS 색상 클래스
- `bg_color`: 배경색 클래스
- `bg_opacity`: 배경 투명도
- `text_color`: 텍스트 색상 변형
- `sort_order`: 정렬 순서
- `is_active`: 활성화 여부

### 2. posts (게시물 테이블)
- `id`: 고유 식별자 (UUID)
- `title`: 게시물 제목
- `slug`: URL용 슬러그
- `description`: 게시물 요약
- `content`: Novel 에디터 JSONB 콘텐츠
- `category_id`: 카테고리 외래키 (categories.id 참조)
- `thumbnail`: 썸네일 이미지 URL
- `date`: 게시 날짜
- `created_at`, `updated_at`: 타임스탬프

### 3. social_links (SNS 링크 테이블)
- `id`: 고유 식별자 (SERIAL)
- `platform`: 플랫폼 식별자 ('github', 'instagram', 'email')
- `display_name`: 표시 이름 ('GitHub', 'Instagram', 'Email')
- `url`: 실제 링크 URL (이메일의 경우 이메일 주소만 저장)
- `icon_name`: Lucide 아이콘 이름 ('Github', 'Instagram', 'Mail')
- `is_active`: 활성화 여부
- `sort_order`: 정렬 순서
- `created_at`, `updated_at`: 타임스탬프

## 기본 데이터

### 카테고리 (sample-data.sql)
다음 카테고리들이 자동으로 생성됩니다:
- 개발, 기술, 일상, 리뷰, 튜토리얼, 프로젝트, 회고, 팁, 소개, 경험

### SNS 링크 (social-links.sql)
다음 SNS 링크들이 기본으로 설정됩니다:
- GitHub: `https://github.com/or-m-or`
- Instagram: `https://www.instagram.com/or.m.or/`
- Email: `hth815@naver.com` (클릭 시 클립보드에 복사)

## 보안 설정

### RLS (Row Level Security)
모든 테이블에 RLS가 활성화되어 있습니다:
- **categories**: 관리자만 수정 가능, 모든 사용자 읽기 가능
- **posts**: 관리자만 수정 가능, 모든 사용자 읽기 가능
- **social_links**: 관리자만 수정 가능, 모든 사용자 읽기 가능

### 관리자 권한
`hth815@naver.com` 이메일을 가진 사용자만 데이터 수정이 가능합니다.

## 사용 예시

### 카테고리 관리
```typescript
// 새 카테고리 생성
const newCategory = await createCategory({
    name: '새카테고리',
    slug: 'new-category',
    color: 'emerald',
    bg_opacity: '80',
    text_color: '100'
});

// 카테고리 수정
await updateCategory(categoryId, {
    name: '수정된카테고리',
    color: 'rose'
});

// 카테고리 삭제 (ETC로 이동 후 삭제)
await deleteCategory(categoryId);
```

### SNS 링크 관리
```typescript
// SNS 링크 조회
const socialLinks = await getSocialLinks();

// SNS 링크 수정
await updateSocialLink('github', {
    url: 'https://github.com/newusername',
    display_name: 'GitHub'
});

// 이메일 복사 기능 (Frontend)
const handleEmailCopy = async () => {
    try {
        await navigator.clipboard.writeText('hth815@naver.com');
        // 복사 성공 시 시각적 피드백
    } catch (err) {
        console.error('이메일 복사 실패:', err);
    }
};
```

## 주의사항

1. **실행 순서**: 반드시 `supabase-schema.sql` → `sample-data.sql` → `social-links.sql` 순서로 실행하세요.
2. **기존 데이터**: 기존 데이터가 있다면 백업 후 실행하세요.
3. **관리자 이메일**: RLS 정책에서 사용하는 이메일 주소를 실제 관리자 이메일로 변경하세요.
4. **SNS 링크**: `social-links.sql`의 기본 URL들을 실제 계정 정보로 수정하세요. 