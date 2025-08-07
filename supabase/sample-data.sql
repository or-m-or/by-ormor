-- 기존 데이터 삭제 (테이블 재생성을 위해)
DELETE FROM posts;
DELETE FROM categories;

-- Insert default categories (샘플)
INSERT INTO categories (id, name, slug, color, bg_color, bg_opacity, text_color, sort_order) VALUES
    (1, '회고', 'retrospect', 'red', 'bg-gradient-to-r from-red-500/20 to-red-600/20', '80', 'white', 1),
    (2, '프로젝트', 'project', 'indigo', 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20', '80', 'white', 2),
    (3, '어셈블리어', 'assembly', 'blue', 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20', '80', 'white', 3),
    (4, 'C++', 'cpp', 'green', 'bg-gradient-to-r from-green-500/20 to-emerald-500/20', '80', 'white', 4),
    (5, '컴퓨터구조', 'computer-architecture', 'purple', 'bg-gradient-to-r from-purple-500/20 to-violet-500/20', '80', 'white', 5),
    (6, '운영체제', 'operating-system', 'yellow', 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20', '80', 'white', 6),
    (7, '네트워크', 'network', 'pink', 'bg-gradient-to-r from-pink-500/20 to-rose-500/20', '80', 'white', 7),
    (8, '알고리즘', 'algorithm', 'teal', 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20', '80', 'white', 8),
    (9, 'ETC', 'etc', 'orange', 'bg-gradient-to-r from-orange-500/20 to-amber-500/20', '80', 'white', 9);

-- Insert sample posts (category_id 사용)
INSERT INTO posts (title, slug, description, content, category_id, thumbnail, date, created_at) VALUES
-- 1. Novel 에디터 마크다운/리치 텍스트 테스트
('Novel 에디터 마크다운/리치 텍스트 테스트', 'novel-editor-markdown-test', '모든 마크다운/리치 텍스트 요소를 테스트합니다.', '{
  "type": "doc",
  "content": [
    {"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "제목(H1)"}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "제목(H2)"}]},
    {"type": "paragraph", "content": [
      {"type": "text", "text": "굵게", "marks": [{"type": "bold"}]},
      {"type": "text", "text": ", "},
      {"type": "text", "text": "이탤릭", "marks": [{"type": "italic"}]},
      {"type": "text", "text": ", "},
      {"type": "text", "text": "밑줄", "marks": [{"type": "underline"}]},
      {"type": "text", "text": ", "},
      {"type": "text", "text": "취소선", "marks": [{"type": "strike"}]},
      {"type": "text", "text": ", "},
      {"type": "text", "text": "코드", "marks": [{"type": "code"}]}
    ]},
    {"type": "paragraph", "content": [
      {"type": "text", "text": "링크", "marks": [{"type": "link", "attrs": {"href": "https://www.naver.com", "target": "_blank"}}]},
      {"type": "text", "text": " | 수식: "},
      {"type": "math", "attrs": {"content": "E=mc^2"}}
    ]},
    {"type": "bulletList", "content": [
      {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "불릿 리스트 1"}]}]},
      {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "불릿 리스트 2"}]}]}
    ]},
    {"type": "orderedList", "attrs": {"order": 1}, "content": [
      {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "번호 리스트 1"}]}]},
      {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "번호 리스트 2"}]}]}
    ]},
    {"type": "codeBlock", "attrs": {"language": "javascript"}, "content": [
      {"type": "text", "text": "console.log(''Hello, world!'');"}
    ]},
    {"type": "image", "attrs": {"src": "/images/default-thumbnail.jpg", "alt": "샘플 이미지"}},
    {"type": "blockquote", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "인용문 테스트"}]}]}
  ]
}', 9, 'https://lgqktvsmaqeexvywkmxf.supabase.co/storage/v1/object/public/blog-images/novel-editor-test.jpg', '2024-01-01', '2024-01-01'),
-- 2~12. 간단한 게시물들
('프로젝트 소개', 'project-intro', '간단한 프로젝트 소개', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"이 프로젝트는 ..."}]}]}', 2, NULL, '2024-01-05', '2024-01-05'),
('회고록', 'retrospect-2024', '2024년 회고', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"2024년을 돌아보며..."}]}]}', 1, NULL, '2024-01-10', '2024-01-10'),
('어셈블리어 기초', 'assembly-basic', '어셈블리어 입문', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"MOV, ADD, JMP 명령어"}]}]}', 3, NULL, '2024-01-15', '2024-01-15'),
('C++ STL 활용', 'cpp-stl', 'C++ STL 예제', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"vector, map, set 활용"}]}]}', 4, NULL, '2024-01-20', '2024-01-20'),
('컴퓨터구조 요약', 'computer-arch-summary', '컴퓨터구조 핵심', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"CPU, 메모리, 버스"}]}]}', 5, NULL, '2024-01-25', '2024-01-25'),
('운영체제란?', 'os-what', '운영체제 개념', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"프로세스, 스레드"}]}]}', 6, NULL, '2024-02-01', '2024-02-01'),
('네트워크 계층', 'network-layer', '네트워크 계층 설명', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"OSI 7계층"}]}]}', 7, NULL, '2024-02-05', '2024-02-05'),
('알고리즘 기초', 'algorithm-basic', '알고리즘 입문', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"정렬, 탐색"}]}]}', 8, NULL, '2024-02-10', '2024-02-10'),
('ETC 테스트', 'etc-test', '기타 테스트', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"기타 내용"}]}]}', 9, NULL, '2024-02-15', '2024-02-15'),
('C++ 템플릿', 'cpp-template', 'C++ 템플릿 예시', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"template<typename T>"}]}]}', 4, NULL, '2024-02-20', '2024-02-20'),
('운영체제 스케줄링', 'os-scheduling', '스케줄링 알고리즘', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"FCFS, RR, SJF"}]}]}', 6, NULL, '2024-02-22', '2024-02-22'),
('네트워크 보안', 'network-security', '네트워크 보안 개요', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"암호화, 인증"}]}]}', 7, NULL, '2024-02-25', '2024-02-25'),
-- ETC 카테고리 추가 게시물
('ETC 샘플 1', 'etc-sample-1', 'ETC 카테고리 샘플 게시물 1', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"ETC 샘플 1 내용"}]}]}', 9, NULL, '2024-02-26', '2024-02-26'),
('ETC 샘플 2', 'etc-sample-2', 'ETC 카테고리 샘플 게시물 2', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"ETC 샘플 2 내용"}]}]}', 9, NULL, '2024-02-27', '2024-02-27'),
('ETC 샘플 3', 'etc-sample-3', 'ETC 카테고리 샘플 게시물 3', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"ETC 샘플 3 내용"}]}]}', 9, NULL, '2024-02-28', '2024-02-28'); 