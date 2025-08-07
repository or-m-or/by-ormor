import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: 모든 카테고리 조회
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: '카테고리 조회 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// POST: 새 카테고리 생성
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, color, bg_color, bg_opacity = '80', text_color = '100', sort_order = 0 } = body;

        // 필수 필드 검증
        if (!name || !slug || !color || !bg_color) {
            return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('categories')
            .insert({
                name,
                slug,
                color,
                bg_color,
                bg_opacity,
                text_color,
                sort_order,
                is_active: true
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: '카테고리 생성 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// PUT: 카테고리 수정
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, slug, color, bg_color, bg_opacity, text_color, sort_order, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: '카테고리 ID가 필요합니다.' }, { status: 400 });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug;
        if (color !== undefined) updateData.color = color;
        if (bg_color !== undefined) updateData.bg_color = bg_color;
        if (bg_opacity !== undefined) updateData.bg_opacity = bg_opacity;
        if (text_color !== undefined) updateData.text_color = text_color;
        if (sort_order !== undefined) updateData.sort_order = sort_order;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', parseInt(id))
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: '카테고리 수정 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// DELETE: 카테고리 삭제 (실제 삭제 대신 비활성화)
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: '카테고리 ID가 필요합니다.' }, { status: 400 });
        }

        // 실제 삭제 대신 비활성화
        const { data, error } = await supabase
            .from('categories')
            .update({ is_active: false })
            .eq('id', parseInt(id))
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: '카테고리가 비활성화되었습니다.' });
    } catch (error) {
        return NextResponse.json({ error: '카테고리 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 