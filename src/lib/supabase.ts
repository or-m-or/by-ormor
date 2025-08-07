import { createClient } from '@supabase/supabase-js';
import type { JSONContent } from 'novel';
import type { Category } from './categories';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Post {
    id: string;
    slug: string;
    title: string;
    thumbnail?: string;
    category_id: number;
    category?: Category; // join 시 포함
    date: string;
    description?: string;
    content: JSONContent | string; // Novel 에디터의 JSONContent 또는 기존 HTML 문자열
    created_at?: string;
    updated_at?: string;
} 