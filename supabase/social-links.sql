-- SNS 링크 관리를 위한 테이블 생성
CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL UNIQUE, -- 'github', 'instagram', 'email'
    display_name VARCHAR(100) NOT NULL, -- 'GitHub', 'Instagram', 'Email'
    url VARCHAR(500) NOT NULL, -- 실제 링크 URL
    icon_name VARCHAR(50) NOT NULL, -- 'Github', 'Instagram', 'Mail'
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 데이터 삽입
INSERT INTO social_links (platform, display_name, url, icon_name, sort_order) VALUES
    ('github', 'GitHub', 'https://github.com/or-m-or', 'Github', 1),
    ('instagram', 'Instagram', 'https://www.instagram.com/or.m.or/', 'Instagram', 2),
    ('email', 'Email', 'hth815@naver.com', 'Mail', 3)
ON CONFLICT (platform) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    url = EXCLUDED.url,
    icon_name = EXCLUDED.icon_name,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- RLS (Row Level Security) 활성화
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Allow public read access to social_links" ON social_links
    FOR SELECT USING (true);

-- 관리자만 수정 가능하도록 정책 설정 (auth.users 테이블이 있다고 가정)
CREATE POLICY "Allow admin write access to social_links" ON social_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'hth815@naver.com'
        )
    );

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_social_links_updated_at 
    BEFORE UPDATE ON social_links 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성
CREATE INDEX idx_social_links_platform ON social_links(platform);
CREATE INDEX idx_social_links_active ON social_links(is_active);
CREATE INDEX idx_social_links_sort_order ON social_links(sort_order); 