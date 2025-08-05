'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { User, ArrowLeft, Save, Mail, Lock } from 'lucide-react';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        website: '',
        location: ''
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            // 실제로는 여기서 사용자 프로필 정보를 가져옴
            setProfile({
                displayName: user.user_metadata?.display_name || '',
                bio: user.user_metadata?.bio || '',
                website: user.user_metadata?.website || '',
                location: user.user_metadata?.location || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        // 실제로는 여기서 API 호출하여 프로필을 저장
        setTimeout(() => {
            setSaving(false);
            alert('프로필이 저장되었습니다!');
        }, 1000);
    };

    const handleInputChange = (key: string, value: string) => {
        setProfile(prev => ({
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

                        {/* 프로필 폼 */}
                        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                {/* 계정 정보 */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-4">계정 정보</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-400">이메일</p>
                                                    <p className="text-white">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                                                <Lock className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-400">계정 생성일</p>
                                                    <p className="text-white">
                                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '알 수 없음'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 프로필 정보 */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-4">프로필 정보</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                                                    표시 이름
                                                </label>
                                                <input
                                                    id="displayName"
                                                    type="text"
                                                    value={profile.displayName}
                                                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder="표시할 이름을 입력하세요"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                                                    자기소개
                                                </label>
                                                <textarea
                                                    id="bio"
                                                    value={profile.bio}
                                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder="자기소개를 입력하세요"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                                                    웹사이트
                                                </label>
                                                <input
                                                    id="website"
                                                    type="url"
                                                    value={profile.website}
                                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder="https://example.com"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                                                    위치
                                                </label>
                                                <input
                                                    id="location"
                                                    type="text"
                                                    value={profile.location}
                                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder="도시, 국가"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 보안 설정 */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-4">보안 설정</h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                    <div>
                                                        <h4 className="text-yellow-400 font-medium mb-1">비밀번호 변경</h4>
                                                        <p className="text-yellow-300 text-sm">
                                                            비밀번호 변경은 Supabase 대시보드에서 직접 변경하거나, 
                                                            로그아웃 후 비밀번호 재설정을 통해 변경할 수 있습니다.
                                                        </p>
                                                    </div>
                                                </div>
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