import { supabase } from './supabase';

// 이미지 업로드 함수
export const uploadImage = async (file: File, fileName: string): Promise<string> => {
    try {
        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('이미지 업로드 오류:', error);
            throw error;
        }

        // 공개 URL 생성
        const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('이미지 업로드 중 오류:', error);
        throw error;
    }
};

// 이미지 URL 생성 함수 (기존 파일이 있는 경우)
export const getImageUrl = (fileName: string): string => {
    const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

    return publicUrl;
};

// 이미지 삭제 함수
export const deleteImage = async (fileName: string): Promise<void> => {
    try {
        const { error } = await supabase.storage
            .from('blog-images')
            .remove([fileName]);

        if (error) {
            console.error('이미지 삭제 오류:', error);
            throw error;
        }
    } catch (error) {
        console.error('이미지 삭제 중 오류:', error);
        throw error;
    }
};

// 버킷의 모든 이미지 목록 가져오기
export const listImages = async (): Promise<string[]> => {
    try {
        const { data, error } = await supabase.storage
            .from('blog-images')
            .list();

        if (error) {
            console.error('이미지 목록 조회 오류:', error);
            throw error;
        }

        return data.map(file => file.name);
    } catch (error) {
        console.error('이미지 목록 조회 중 오류:', error);
        throw error;
    }
}; 