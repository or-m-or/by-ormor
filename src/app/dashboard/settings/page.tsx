'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink, SocialLink } from '@/lib/database';
import { Settings, ArrowLeft, Save, Github, Instagram, Mail, Globe, User, Plus, Trash2, X } from 'lucide-react';

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingPlatform, setDeletingPlatform] = useState<string | null>(null);

    // 새 SNS 링크 폼 상태
    const [newLink, setNewLink] = useState({
        platform: '',
        display_name: '',
        url: '',
        icon_name: '',
        is_active: false, // 기본값을 비활성으로 설정
        sort_order: 0
    });

    // 기본 블로그 정보 (현재는 하드코딩, 나중에 설정 테이블 추가 가능)
    const [blogInfo, setBlogInfo] = useState({
        siteTitle: 'By Ormor',
        siteDescription: '개발과 기술에 대한 생각을 나누는 공간',
        authorName: 'ormor',
        authorEmail: 'hth815@naver.com'
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                setLoadingLinks(true);
                const links = await getAllSocialLinks(); // 모든 링크 가져오기 (관리용)
                setSocialLinks(links);
            } catch (error) {
                console.error('SNS 링크 로드 중 오류:', error);
            } finally {
                setLoadingLinks(false);
            }
        };

        if (user) {
            fetchSocialLinks();
        }
    }, [user]);

    const handleSocialLinkUpdate = async (platform: string, field: keyof SocialLink, value: string | boolean) => {
        try {
            const updatedLink = await updateSocialLink(platform, { [field]: value });
            if (updatedLink) {
                setSocialLinks(prev =>
                    prev.map(link =>
                        link.platform === platform ? updatedLink : link
                    )
                );

                // Footer 새로고침을 위한 이벤트 발생
                if (field === 'is_active') {
                    window.dispatchEvent(new CustomEvent('socialLinksUpdated'));
                }
            }
        } catch (error) {
            console.error('SNS 링크 업데이트 중 오류:', error);
        }
    };

    const handleAddSocialLink = async () => {
        if (!newLink.platform || !newLink.display_name || !newLink.url || !newLink.icon_name) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const createdLink = await createSocialLink(newLink);
            if (createdLink) {
                setSocialLinks(prev => [...prev, createdLink]);
                setNewLink({
                    platform: '',
                    display_name: '',
                    url: '',
                    icon_name: '',
                    is_active: false,
                    sort_order: 0
                });
                setShowAddForm(false);
                alert('SNS 링크가 추가되었습니다!');

                // Footer 새로고침을 위한 이벤트 발생
                window.dispatchEvent(new CustomEvent('socialLinksUpdated'));
            }
        } catch (error) {
            console.error('SNS 링크 추가 중 오류:', error);
            alert('SNS 링크 추가에 실패했습니다.');
        }
    };

    const handleDeleteSocialLink = async (platform: string) => {
        if (!confirm('정말로 이 SNS 링크를 삭제하시겠습니까?')) {
            return;
        }

        try {
            setDeletingPlatform(platform);
            const success = await deleteSocialLink(platform);
            if (success) {
                setSocialLinks(prev => prev.filter(link => link.platform !== platform));
                alert('SNS 링크가 삭제되었습니다!');

                // Footer 새로고침을 위한 이벤트 발생
                window.dispatchEvent(new CustomEvent('socialLinksUpdated'));
            }
        } catch (error) {
            console.error('SNS 링크 삭제 중 오류:', error);
            alert('SNS 링크 삭제에 실패했습니다.');
        } finally {
            setDeletingPlatform(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        // 실제로는 여기서 블로그 정보 API 호출하여 설정을 저장
        setTimeout(() => {
            setSaving(false);
            alert('설정이 저장되었습니다!');
        }, 1000);
    };

    const handleBlogInfoChange = (key: string, value: string) => {
        setBlogInfo(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const getIconComponent = (iconName: string) => {
        switch (iconName.toLowerCase()) {
            case 'github':
                return <Github className="w-5 h-5" />;
            case 'instagram':
                return <Instagram className="w-5 h-5" />;
            case 'mail':
                return <Mail className="w-5 h-5" />;
            default:
                return <Globe className="w-5 h-5" />;
        }
    };

    const availablePlatforms = [
        { value: 'github', label: 'GitHub', icon: 'github' },
        { value: 'instagram', label: 'Instagram', icon: 'instagram' },
        { value: 'twitter', label: 'Twitter', icon: 'twitter' },
        { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
        { value: 'youtube', label: 'YouTube', icon: 'youtube' },
        { value: 'facebook', label: 'Facebook', icon: 'facebook' },
        { value: 'email', label: 'Email', icon: 'mail' },
        { value: 'website', label: 'Website', icon: 'globe' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black relative">
            {/* 고정된 배경 애니메이션 */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/20 to-gray-800/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]"></div>
            </div>

            {/* 스크롤되는 내용 */}
            <div className="relative z-10">
                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* 헤더 */}
                        <header className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="font-dunggeunmo flex items-center space-x-2 text-2xl font-bold text-white">
                                    <Image
                                        src="/icons/asterisk.png"
                                        alt="Logo"
                                        width={24}
                                        height={24}
                                        className="rounded-sm"
                                    />
                                    <span>ormor</span>
                                </div>

                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/70 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="text-sm">대시보드로</span>
                                </Link>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">블로그 설정</h1>
                        </header>

                        {/* 설정 섹션들 */}
                        <div className="space-y-6">
                            {/* 기본 정보 설정 */}
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-blue-600/20 rounded-lg">
                                        <Globe className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">기본 정보</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">사이트 제목</label>
                                        <input
                                            type="text"
                                            value={blogInfo.siteTitle}
                                            onChange={(e) => handleBlogInfoChange('siteTitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">작성자 이름</label>
                                        <input
                                            type="text"
                                            value={blogInfo.authorName}
                                            onChange={(e) => handleBlogInfoChange('authorName', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">사이트 설명</label>
                                        <textarea
                                            value={blogInfo.siteDescription}
                                            onChange={(e) => handleBlogInfoChange('siteDescription', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">작성자 이메일</label>
                                        <input
                                            type="email"
                                            value={blogInfo.authorEmail}
                                            onChange={(e) => handleBlogInfoChange('authorEmail', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SNS 링크 설정 */}
                            <div className="bg-gray-800/20 rounded-xl border-0 p-6 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-600/20 rounded-lg">
                                            <Settings className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">SNS 링크 관리</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/30 backdrop-blur-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-sm">새 링크 추가</span>
                                    </button>
                                </div>

                                {loadingLinks ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {socialLinks.map((link) => (
                                            <div key={link.id} className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm border-0">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-gray-600/50 rounded-lg">
                                                        {getIconComponent(link.icon_name)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className="text-sm font-medium text-gray-300">{link.display_name}</span>
                                                            <button
                                                                onClick={() => handleSocialLinkUpdate(link.platform, 'is_active', !link.is_active)}
                                                                className={`px-2 py-1 text-xs rounded-full transition-all duration-300 ${link.is_active
                                                                    ? 'bg-green-900/50 text-green-300 hover:bg-red-900/50 hover:text-red-300'
                                                                    : 'bg-red-900/50 text-red-300 hover:bg-green-900/50 hover:text-green-300'
                                                                    }`}
                                                                title={link.is_active ? '비활성화하려면 클릭' : '활성화하려면 클릭'}
                                                            >
                                                                {link.is_active ? '활성' : '비활성'}
                                                            </button>
                                                            <span className="text-xs text-gray-400">({link.platform})</span>
                                                        </div>
                                                        <input
                                                            type="url"
                                                            value={link.url}
                                                            onChange={(e) => handleSocialLinkUpdate(link.platform, 'url', e.target.value)}
                                                            placeholder="URL을 입력하세요"
                                                            className="w-full px-3 py-2 bg-gray-600/50 border-0 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteSocialLink(link.platform)}
                                                        disabled={deletingPlatform === link.platform}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/15 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-500/20 backdrop-blur-sm disabled:opacity-50"
                                                        title="삭제"
                                                    >
                                                        {deletingPlatform === link.platform ? (
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 새 SNS 링크 추가 폼 */}
                                {showAddForm && (
                                    <div className="mt-6 bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm border-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-white">새 SNS 링크 추가</h4>
                                            <button
                                                onClick={() => setShowAddForm(false)}
                                                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 rounded-xl transition-all duration-300"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">플랫폼</label>
                                                <select
                                                    value={newLink.platform}
                                                    onChange={(e) => {
                                                        const platform = e.target.value;
                                                        const selectedPlatform = availablePlatforms.find(p => p.value === platform);
                                                        setNewLink(prev => ({
                                                            ...prev,
                                                            platform,
                                                            display_name: selectedPlatform?.label || '',
                                                            icon_name: selectedPlatform?.icon || ''
                                                        }));
                                                    }}
                                                    className="w-full px-3 py-2 bg-gray-600/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                                >
                                                    <option value="">플랫폼 선택</option>
                                                    {availablePlatforms.map(platform => (
                                                        <option key={platform.value} value={platform.value}>
                                                            {platform.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">표시 이름</label>
                                                <input
                                                    type="text"
                                                    value={newLink.display_name}
                                                    onChange={(e) => setNewLink(prev => ({ ...prev, display_name: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-gray-600/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                                                <input
                                                    type="url"
                                                    value={newLink.url}
                                                    onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                                                    placeholder="https://example.com"
                                                    className="w-full px-3 py-2 bg-gray-600/50 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">상태</label>
                                                <div className="flex items-center space-x-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="is_active"
                                                            value="true"
                                                            checked={newLink.is_active === true}
                                                            onChange={() => setNewLink(prev => ({ ...prev, is_active: true }))}
                                                            className="w-4 h-4 text-purple-600 bg-gray-600/50 border-gray-500 focus:ring-purple-500/50"
                                                        />
                                                        <span className="text-sm text-gray-300">활성</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="is_active"
                                                            value="false"
                                                            checked={newLink.is_active === false}
                                                            onChange={() => setNewLink(prev => ({ ...prev, is_active: false }))}
                                                            className="w-4 h-4 text-purple-600 bg-gray-600/50 border-gray-500 focus:ring-purple-500/50"
                                                        />
                                                        <span className="text-sm text-gray-300">비활성</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-3 mt-4">
                                            <button
                                                onClick={() => setShowAddForm(false)}
                                                className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
                                            >
                                                취소
                                            </button>
                                            <button
                                                onClick={handleAddSocialLink}
                                                className="px-4 py-2 bg-green-600/90 hover:bg-green-600 text-white rounded-lg transition-all duration-300"
                                            >
                                                추가
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 저장 버튼 */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center space-x-2 px-6 py-3 bg-purple-600/90 hover:bg-purple-600 disabled:bg-purple-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 backdrop-blur-sm disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>저장 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>설정 저장</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 