'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Instagram, Mail, Twitter, Linkedin, Youtube, Facebook, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSocialLinks, type SocialLink } from '@/lib/database';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [copied, setCopied] = useState(false);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

    // SNS 링크 데이터 가져오기
    const fetchSocialLinks = async () => {
        try {
            const links = await getSocialLinks();
            setSocialLinks(links);
        } catch (error) {
            console.error('SNS 링크 로딩 실패:', error);
        }
    };

    useEffect(() => {
        fetchSocialLinks();

        // SNS 링크 업데이트 이벤트 리스너
        const handleSocialLinksUpdate = () => {
            fetchSocialLinks();
        };

        window.addEventListener('socialLinksUpdated', handleSocialLinksUpdate);

        return () => {
            window.removeEventListener('socialLinksUpdated', handleSocialLinksUpdate);
        };
    }, []);

    const handleEmailCopy = async () => {
        try {
            await navigator.clipboard.writeText('hth815@naver.com');
            setCopied(true);
            toast.success('이메일이 클립보드에 복사되었습니다!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('이메일 복사 실패:', err);
            toast.error('이메일 복사에 실패했습니다.');
        }
    };

    // 아이콘 컴포넌트 매핑
    const getIconComponent = (iconName: string) => {
        switch (iconName.toLowerCase()) {
            case 'github':
                return <Github className="w-5 h-5" />;
            case 'instagram':
                return <Instagram className="w-5 h-5" />;
            case 'mail':
                return <Mail className="w-5 h-5" />;
            case 'twitter':
                return <Twitter className="w-5 h-5" />;
            case 'linkedin':
                return <Linkedin className="w-5 h-5" />;
            case 'youtube':
                return <Youtube className="w-5 h-5" />;
            case 'facebook':
                return <Facebook className="w-5 h-5" />;
            case 'globe':
            case 'website':
                return <Globe className="w-5 h-5" />;
            default:
                return <Globe className="w-5 h-5" />;
        }
    };

    return (
        <footer className="bg-gray-800/20 backdrop-blur-sm border-0 mt-20 mx-6 mb-6 rounded-xl shadow-lg">
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* 로고 */}
                    <Link href="/" className="font-dunggeunmo flex items-center space-x-2 text-lg font-bold text-white mb-4 md:mb-0 hover:text-purple-400 transition-colors duration-300">
                        <Image
                            src="/icons/asterisk.png"
                            alt="Logo"
                            width={18}
                            height={18}
                            className="rounded-sm"
                        />
                        <span>ormor</span>
                    </Link>

                    {/* SNS 링크들 */}
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        {socialLinks.map((link) => {
                            if (link.platform === 'email') {
                                return (
                                    <button
                                        key={link.id}
                                        onClick={handleEmailCopy}
                                        className={`p-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm ${copied
                                            ? 'text-green-400 bg-green-500/20'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                            }`}
                                        title={copied ? "복사됨!" : "이메일 복사"}
                                    >
                                        {getIconComponent(link.icon_name)}
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                                    title={link.display_name}
                                >
                                    {getIconComponent(link.icon_name)}
                                </Link>
                            );
                        })}
                    </div>

                    {/* 저작권 */}
                    <p className="text-gray-300 text-sm">
                        © {currentYear} ormor. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
} 