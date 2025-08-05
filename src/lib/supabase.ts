import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Post {
    id: string;
    slug: string;
    title: string;
    thumbnail: string;
    category: string;
    date: string;
    description: string;
    content: string; // 기존 HTML 콘텐츠
    created_at?: string;
    updated_at?: string;
} 