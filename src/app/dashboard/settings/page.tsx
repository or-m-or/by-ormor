'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, ArrowLeft, Save } from 'lucide-react';

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteTitle: 'By Ormor',
        siteDescription: '개발과 기술에 대한 생각을 나누는 공간',
        postsPerPage: 10,
        enableComments: false,
        enableSearch: true,
        enableCategories: true
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSave = async () => {
        setSaving(true);
        // 실제로는 여기서 API 호출하여 설정을 저장
        setTimeout(() => {
            setSaving(false);
            alert('설정이 저장되었습니다!');
        }, 1000);
    };

    const handleInputChange = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

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
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>대시보드로</span>
                                </Link>
                            </div>
                        </header>

                        {/* 설정 폼 */}
                        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                {/* 기본 설정 */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-4">기본 설정</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-300 mb-2">
                                                    사이트 제목
                                                </label>
                                                <input
                                                    id="siteTitle"
                                                    type="text"
                                                    value={settings.siteTitle}
                                                    onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300 mb-2">
                                                    사이트 설명
                                                </label>
                                                <textarea
                                                    id="siteDescription"
                                                    value={settings.siteDescription}
                                                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="postsPerPage" className="block text-sm font-medium text-gray-300 mb-2">
                                                    페이지당 게시물 수
                                                </label>
                                                <input
                                                    id="postsPerPage"
                                                    type="number"
                                                    min="5"
                                                    max="50"
                                                    value={settings.postsPerPage}
                                                    onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 기능 설정 */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-4">기능 설정</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-300">댓글 기능</label>
                                                    <p className="text-xs text-gray-400">게시물에 댓글을 달 수 있도록 허용</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('enableComments', !settings.enableComments)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableComments ? 'bg-purple-600' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableComments ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-300">검색 기능</label>
                                                    <p className="text-xs text-gray-400">게시물 검색 기능 활성화</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('enableSearch', !settings.enableSearch)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableSearch ? 'bg-purple-600' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableSearch ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-300">카테고리 기능</label>
                                                    <p className="text-xs text-gray-400">게시물 카테고리 분류 기능</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('enableCategories', !settings.enableCategories)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableCategories ? 'bg-purple-600' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableCategories ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 저장 버튼 */}
                                <div className="mt-8 flex justify-end space-x-4">
                                    <Link
                                        href="/dashboard"
                                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                    >
                                        취소
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>저장 중...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>저장</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 