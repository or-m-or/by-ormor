'use client';

import { FiPhone, FiMail } from 'react-icons/fi';
import { ContactForm } from '@/components/contact/ContactForm';
import { ShootingStars } from '@/components/common/ShootingStars';
import { StarsBackground } from '@/components/common/StarsBackground';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            {/* 고정된 배경 애니메이션 */}
            <div className="fixed inset-0 z-0">
                <ShootingStars />
                <StarsBackground />
            </div>

            {/* 스크롤되는 내용 */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />

                <main className="flex-1 md:ml-28 pb-16 md:pb-0 p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <header className="mb-8">
                            <div className="flex items-center mb-2">
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
                            </div>
                        </header>

                        {/* 페이지 제목 */}
                        <div className="text-center mb-8 pt-20">
                            <h1 className="text-4xl font-bold text-white mb-4">CONTACT</h1>
                            <p className="text-gray-300 mb-2">
                                저에게 관심이 있으시다면, 아래 연락처로 언제든지 편하게 연락 부탁드립니다.
                            </p>
                            <p className="text-gray-300">
                                또는 아래 폼을 통해 바로 메일을 보내실 수 있습니다.
                            </p>
                        </div>

                        {/* 연락처 정보 */}
                        <div className="mb-8 flex justify-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/20 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-lg">
                                <FiPhone className="text-purple-400" />
                                <span className="text-white">010-4844-7192</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/20 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-lg">
                                <FiMail className="text-purple-400" />
                                <span className="text-white">hth815@naver.com</span>
                            </div>
                        </div>

                        {/* 연락 폼 */}
                        <ContactForm />
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
} 