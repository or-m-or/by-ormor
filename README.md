# by-ormor Blog

Next.js와 Supabase를 기반으로 한 개인 블로그 프로젝트입니다.

## 🚀 프로젝트 개요

- **프레임워크**: Next.js 15.3.4 (App Router)
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase (PostgreSQL)
- **이미지 저장소**: Supabase Storage
- **인증**: Supabase Authentication
- **패키지 매니저**: pnpm
- **폰트**: Pretendard (한글), DungGeunMo (로고용)

## ✨ 주요 기능

### 📝 블로그 기능
- **게시물 목록**: 메인 페이지에서 모든 게시물 표시
- **게시물 상세**: 개별 게시물 상세 페이지
- **검색 기능**: 제목과 내용 기반 검색 (`/search`)
- **카테고리 필터링**: 카테고리별 게시물 필터링
- **연관 게시물**: 동일 카테고리의 다른 게시물 추천
- **목차(TOC)**: 게시물 내용의 자동 목차 생성

### 🔐 관리자 기능
- **관리자 로그인**: Supabase Auth를 통한 이메일/비밀번호 로그인
- **관리자 대시보드**: 인증된 사용자만 접근 가능한 관리 페이지
- **세션 관리**: 자동 로그인 상태 유지 및 로그아웃 기능

### 🎨 UI/UX
- **다크 테마**: 검은색 배경의 모던한 디자인
- **반응형 디자인**: 모바일부터 데스크톱까지 완벽 대응
- **배경 애니메이션**: 별과 유성 효과
- **로딩 스피너**: 보라색 테마의 로딩 인디케이터
- **호버 효과**: 카드와 버튼의 인터랙티브 효과

### 📧 연락처 기능
- **연락처 폼**: 이메일 전송 기능 (`/contact`)
- **SMTP 연동**: 네이버 SMTP를 통한 이메일 전송

### 🔍 검색 및 필터링
- **실시간 검색**: 제목과 설명 기반 검색
- **카테고리 필터**: 개발, 기술, 일상 등 카테고리별 필터링
- **검색 결과**: 클릭 가능한 검색 결과 카드

## 🗄️ 데이터베이스 구조

### posts 테이블
```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 인덱스
- `idx_posts_slug`: slug 기반 빠른 조회
- `idx_posts_category`: 카테고리별 필터링
- `idx_posts_date`: 날짜순 정렬
- `idx_posts_created_at`: 생성일 기준 정렬

## 🚀 시작하기

### 1. 환경 설정

```bash
# 프로젝트 클론
git clone <repository-url>
cd by-ormor

# 의존성 설치
pnpm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 이메일 설정 (선택사항)
EMAIL_USER=your_email@naver.com
EMAIL_PASS=your_email_app_password
```

### 3. Supabase 설정

#### 3.1 데이터베이스 스키마 적용

1. Supabase 대시보드에서 SQL Editor 열기
2. `supabase-schema.sql` 파일의 내용을 복사하여 실행

```sql
-- 기존 테이블 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS posts;

-- posts 테이블 재생성
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 인덱스 생성
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_date ON posts(date);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- RLS 설정
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 정책 설정
CREATE POLICY "Allow public read access" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON posts FOR ALL USING (true) WITH CHECK (true);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

#### 3.2 Supabase Storage 설정

1. Storage에서 `blog-images` 버킷 생성
2. RLS 정책 설정 (공개 읽기 허용)
3. 이미지 파일 업로드

#### 3.3 Supabase Authentication 설정

1. **Authentication 활성화**:
   - Supabase 대시보드 → Authentication → Settings
   - "Enable email confirmations" 비활성화 (개발용)
   - "Enable email change confirmations" 비활성화 (개발용)
   - "Enable phone confirmations" 비활성화 (선택사항)

2. **관리자 계정 생성**:
   - Supabase 대시보드 → Authentication → Users
   - "Add user" 클릭
   - 이메일과 비밀번호 입력 (예: admin@example.com)
   - "Auto-confirm" 체크하여 즉시 활성화

3. **RLS 정책 설정 (선택사항)**:
   ```sql
   -- 인증된 사용자만 posts 테이블에 쓰기 가능하도록 설정
   DROP POLICY IF EXISTS "Allow public write access" ON posts;
   
   CREATE POLICY "Allow authenticated write access" ON posts
     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
   ```

#### 3.4 샘플 데이터 마이그레이션

개발 서버 실행 후 다음 API 호출:

```bash
curl -X POST http://localhost:3000/api/migrate
```

또는 브라우저에서 직접 호출:
```
POST http://localhost:3000/api/migrate
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 📁 프로젝트 구조

```
by-ormor/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 라우트
│   │   │   ├── contact/       # 연락처 이메일 전송
│   │   │   └── migrate/       # 샘플 데이터 마이그레이션
│   │   ├── contact/           # 연락처 페이지
│   │   ├── dashboard/         # 관리자 대시보드
│   │   ├── login/             # 관리자 로그인 페이지
│   │   ├── posts/             # 게시물 상세 페이지
│   │   ├── search/            # 검색 페이지
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── components/            # React 컴포넌트
│   │   ├── badge/            # 카테고리 뱃지
│   │   ├── common/           # 공통 컴포넌트 (배경 애니메이션)
│   │   ├── contact/          # 연락처 폼
│   │   ├── layouts/          # 레이아웃 컴포넌트
│   │   ├── search/           # 검색 관련 컴포넌트
│   │   ├── BlogCard.tsx      # 블로그 카드
│   │   ├── BlogList.tsx      # 블로그 목록
│   │   └── Navigation.tsx    # 네비게이션
│   ├── contexts/             # React Context
│   │   └── AuthContext.tsx   # 인증 상태 관리
│   └── lib/                  # 유틸리티 함수
│       ├── database.ts       # Supabase 데이터베이스 함수
│       ├── storage.ts        # Supabase Storage 함수
│       └── supabase.ts       # Supabase 클라이언트
├── supabase-schema.sql       # 데이터베이스 스키마
└── README.md                 # 프로젝트 문서
```

## 🎨 스타일링 가이드

### 색상 테마
- **배경**: 검은색 (`#0a0a0a`)
- **텍스트**: 흰색 (`#f9fafb`)
- **강조색**: 보라색 (`#8b5cf6`)
- **카드 배경**: 회색 투명도 (`bg-gray-800/30`)

### 폰트
- **본문**: Pretendard (한글 최적화)
- **로고**: DungGeunMo (레트로 스타일)

### 반응형 브레이크포인트
- **모바일**: 320px ~ 640px
- **태블릿**: 640px ~ 1024px
- **데스크톱**: 1024px 이상

## 🔧 개발 가이드

### 새 게시물 추가

1. Supabase 대시보드에서 직접 추가
2. 또는 API를 통한 프로그래밍 방식 추가

```typescript
import { createPost } from '@/lib/database';

const newPost = {
  id: 'unique-post-id',
  slug: 'post-slug',
  title: '게시물 제목',
  thumbnail: 'https://supabase.co/storage/v1/object/public/blog-images/image.jpg',
  category: '개발',
  date: '2024-01-01',
  description: '게시물 설명',
  content: '<h1>HTML 콘텐츠</h1><p>내용...</p>'
};

await createPost(newPost);
```

### 이미지 업로드

1. Supabase Storage의 `blog-images` 버킷에 이미지 업로드
2. 공개 URL 복사하여 `thumbnail` 필드에 설정

### 카테고리 추가

새 카테고리를 추가하려면 다음 파일들을 수정:

1. `src/components/badge/CategoryBadge.tsx` - 색상 매핑 추가
2. `src/app/search/page.tsx` - 카테고리 옵션 추가

### 관리자 인증

#### 로그인 방법
1. 메인 페이지의 "🔐 관리자" 버튼 클릭
2. Supabase에서 생성한 관리자 계정으로 로그인
3. 로그인 성공 시 자동으로 대시보드로 이동

#### 새 관리자 계정 생성
```sql
-- Supabase SQL Editor에서 실행
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'newadmin@example.com',
  crypt('your_password', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

## 🚀 배포

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포

### 환경 변수 설정 (배포 시)

Vercel 대시보드에서 다음 환경 변수 설정:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `EMAIL_USER` (선택사항)
- `EMAIL_PASS` (선택사항)

## 🔍 문제 해결

### 이미지 로드 실패
- Supabase Storage 버킷의 RLS 정책 확인
- 이미지 URL이 올바른지 확인
- `next.config.ts`에서 이미지 도메인 설정 확인

### 데이터베이스 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성 상태인지 확인
- RLS 정책이 올바르게 설정되었는지 확인

### 인증 오류
- Supabase Authentication이 활성화되었는지 확인
- 관리자 계정이 올바르게 생성되었는지 확인
- 이메일 확인이 필요하지 않은지 확인

### 이메일 전송 실패
- SMTP 설정 확인
- 네이버 앱 비밀번호 설정 확인
- 환경 변수 설정 확인

## 📝 개발 노트

### 주요 개발 이력
- ✅ Pretendard 폰트 적용
- ✅ Supabase 연동 완료
- ✅ 반응형 디자인 구현
- ✅ 검색 기능 구현
- ✅ 연락처 폼 구현
- ✅ 배경 애니메이션 추가
- ✅ 목차(TOC) 기능 구현
- ✅ 연관 게시물 기능 구현
- ✅ 이미지 fallback 처리
- ✅ 에러 처리 개선
- ✅ Supabase Authentication 구현
- ✅ 관리자 로그인/대시보드 구현

### 향후 개선 사항
- [ ] SEO 최적화
- [ ] 댓글 시스템
- [ ] 소셜 미디어 공유
- [ ] 다크/라이트 모드 토글
- [ ] 게시물 태그 시스템
- [ ] 관리자 대시보드 기능 확장
- [ ] 게시물 편집 기능
- [ ] 이미지 업로드 기능
- [🔄] **블로그 설정 페이지** (개발 중 - 기본 UI 완성, 실제 저장 기능 미구현)
- [🔄] **프로필 관리 페이지** (개발 중 - 기본 UI 완성, 실제 저장 기능 미구현)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
