-- Drop existing tables if exist
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50) NOT NULL, -- Tailwind CSS color class (e.g., 'blue', 'green')
    bg_color VARCHAR(100) NOT NULL, -- Background color class (e.g., 'bg-blue-600')
    bg_opacity VARCHAR(10) DEFAULT '80', -- Background opacity (e.g., '80' for /80)
    text_color VARCHAR(50) DEFAULT '100', -- Text color variant (e.g., '100' for text-blue-100)
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table with category_id as foreign key
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content JSONB NOT NULL, -- JSONB for Novel editor content
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    thumbnail VARCHAR(500),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_content ON posts USING GIN (content); -- JSONB 검색용
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (모든 사용자가 게시물을 볼 수 있음)
CREATE POLICY "Public posts are viewable by everyone" ON posts
    FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

-- Create policy for authenticated users to insert posts
CREATE POLICY "Authenticated users can insert posts" ON posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Create policy for authenticated users to manage categories
CREATE POLICY "Authenticated users can manage categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to update their own posts
CREATE POLICY "Authenticated users can update posts" ON posts
    FOR UPDATE USING (auth.role() = 'authenticated');
-- Create policy for authenticated users to delete posts
CREATE POLICY "Authenticated users can delete posts" ON posts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터는 supabase/sample-data.sql 파일에서 별도로 실행하세요

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON posts TO anon, authenticated;
GRANT ALL ON categories TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create storage bucket for blog images (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies (drop if exists first)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Create storage policy for public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');

-- Create storage policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload images" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Create storage policy for authenticated users to update
CREATE POLICY "Authenticated users can update images" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Create storage policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete images" ON storage.objects 
    FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated'); 