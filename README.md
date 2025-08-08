# by-ormor Blog

Next.js와 Supabase를 기반으로 한 개인 블로그 프로젝트입니다.

## 🚀 프로젝트 개요

- **프레임워크**: Next.js 15.3.4 (App Router)
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Authentication
- **에디터**: Novel Editor (Rich Text Editor)
- **패키지 매니저**: pnpm

## ✨ 주요 기능

### 📝 블로그 기능
- **게시물 관리**: Novel Editor를 통한 리치 텍스트 편집
- **카테고리 시스템**: 카테고리별 게시물 분류 및 관리
- **검색 기능**: 제목과 내용 기반 검색
- **상태 관리**: 게시물 활성화/비활성화 기능
- **목차(TOC)**: 게시물 내용의 자동 목차 생성

### 🔐 관리자 기능
- **관리자 대시보드**: 게시물, 카테고리, 설정 관리
- **게시물 편집**: Novel Editor를 통한 직관적인 편집
- **카테고리 관리**: 카테고리 생성, 수정, 활성화/비활성화
- **설정 관리**: 블로그 설정 및 SNS 링크 관리

### 🎨 UI/UX
- **다크 테마**: 모던한 다크 모드 디자인
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **트렌디한 디자인**: 그라데이션과 투명도 효과
- **직관적인 인터페이스**: 모달과 드롭다운을 활용한 사용자 친화적 UI

## 🗄️ 데이터베이스 구조

### 주요 테이블
- **posts**: 게시물 정보 (제목, 내용, 카테고리, 상태 등)
- **categories**: 카테고리 정보 (이름, 색상, 정렬순서, 상태 등)
- **social_links**: SNS 링크 정보
- **users**: 사용자 정보 (Supabase Auth)

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
```

### 3. Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/supabase-schema.sql` 실행
3. Authentication에서 관리자 계정 생성
4. Storage 버킷 생성 (이미지 업로드용)

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
│   │   ├── dashboard/         # 관리자 대시보드
│   │   ├── posts/             # 게시물 상세 페이지
│   │   ├── search/            # 검색 페이지
│   │   └── contact/           # 연락처 페이지
│   ├── components/            # React 컴포넌트
│   │   ├── editor/           # Novel Editor 관련
│   │   ├── ui/               # UI 컴포넌트
│   │   ├── common/           # 공통 컴포넌트
│   │   └── badge/            # 카테고리 뱃지
│   ├── contexts/             # React Context
│   └── lib/                  # 유틸리티 함수
├── supabase/                 # Supabase 설정 파일
└── public/                   # 정적 파일
```

## 🎨 주요 컴포넌트

### Novel Editor
- **리치 텍스트 편집**: 마크다운과 HTML 지원
- **버블 메뉴**: 텍스트 선택 시 편집 도구 표시
- **슬래시 명령어**: `/` 입력으로 블록 삽입
- **이미지 업로드**: 드래그 앤 드롭 지원

### 카테고리 시스템
- **그라데이션 태그**: 트렌디한 카테고리 디자인
- **상태 관리**: 활성화/비활성화 기능
- **색상 선택**: 10가지 색상 옵션

### 관리자 대시보드
- **모달 기반 편집**: 직관적인 카테고리 관리
- **상태 토글**: 게시물과 카테고리 활성화/비활성화
- **실시간 피드백**: Toast 알림 시스템

## 🔧 개발 가이드

### 새 게시물 작성
1. 관리자 대시보드 → 게시물 → 새 게시물
2. Novel Editor로 내용 작성
3. 카테고리 선택 및 설정
4. 저장 및 발행

### 카테고리 관리
1. 관리자 대시보드 → 카테고리
2. 모달을 통한 생성/수정
3. 색상 및 정렬순서 설정
4. 활성화/비활성화 관리

### 이미지 업로드
- Novel Editor에서 드래그 앤 드롭
- Supabase Storage에 자동 저장
- 최적화된 이미지 처리

## 🚀 배포

### Vercel 배포 (권장)
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포

## 🔍 문제 해결

### 빌드 오류
- `pnpm build` 실행하여 오류 확인
- ESLint 규칙 준수
- TypeScript 타입 체크

### 데이터베이스 연결
- Supabase 프로젝트 상태 확인
- 환경 변수 설정 확인
- RLS 정책 설정 확인

## 📝 개발 노트

### 최근 업데이트
- ✅ Novel Editor 통합
- ✅ 카테고리 시스템 개선
- ✅ 관리자 대시보드 UI/UX 개선
- ✅ 게시물 상태 관리 기능
- ✅ 반응형 디자인 최적화
- ✅ 다크 테마 완성

### 기술 스택
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Editor**: Novel Editor
- **UI Components**: shadcn/ui
- **State Management**: React Context

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
