import { createImageUpload } from "novel";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const onUpload = (file: File) => {
    return new Promise((resolve, reject) => {
        const uploadToSupabase = async () => {
            try {
                // 파일명 생성 (중복 방지)
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                // Supabase Storage에 업로드
                const { data, error } = await supabase.storage
                    .from('blog-images') // 버킷 이름 변경
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    throw error;
                }

                // 공개 URL 생성
                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(fileName);

                // 이미지 프리로드
                const image = new Image();
                image.src = publicUrl;
                image.onload = () => {
                    resolve(publicUrl);
                };
                image.onerror = () => {
                    reject(new Error('Failed to load image'));
                };

            } catch (error) {
                reject(error);
            }
        };

        toast.promise(
            uploadToSupabase(),
            {
                loading: "Uploading image...",
                success: "Image uploaded successfully.",
                error: (e) => {
                    return e.message || "Error uploading image. Please try again.";
                },
            },
        );
    });
};

export const uploadFn = createImageUpload({
    onUpload,
    validateFn: (file) => {
        if (!file.type.includes("image/")) {
            toast.error("File type not supported.");
            return false;
        }
        if (file.size / 1024 / 1024 > 20) {
            toast.error("File size too big (max 20MB).");
            return false;
        }
        return true;
    },
});