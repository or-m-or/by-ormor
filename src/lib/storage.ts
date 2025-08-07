import { supabase } from './supabase';

// 이미지 업로드 함수
export async function uploadImage(file: File, fileName: string): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${fileName}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('이미지 업로드 오류:', error);
            return null;
        }

        // 공개 URL 반환
        const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('이미지 업로드 중 예외 발생:', error);
        return null;
    }
}

// 이미지 삭제 함수
export async function deleteImage(fileName: string): Promise<boolean> {
    try {
        const { error } = await supabase.storage
            .from('blog-images')
            .remove([fileName]);

        if (error) {
            console.error('이미지 삭제 오류:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('이미지 삭제 중 예외 발생:', error);
        return false;
    }
}

// 이미지 URL에서 파일명 추출
export function getFileNameFromUrl(url: string): string | null {
    try {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
    } catch (error) {
        console.error('URL에서 파일명 추출 오류:', error);
        return null;
    }
}

// 파일 크기 검증 (5MB 이하)
export function validateImageFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        alert('지원되는 이미지 형식: JPEG, PNG, WebP');
        return false;
    }

    return true;
} 