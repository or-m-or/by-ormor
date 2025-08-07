'use client';

import { Home, Search, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

const Navigation = () => {
    return (
        <>
            {/* 데스크톱 네비게이션 - 좌측 */}
            <nav className="hidden md:flex fixed left-6 top-6 h-auto w-16 backdrop-blur-xl border-0 rounded-2xl shadow-2xl shadow-black/50 flex-col items-center py-6 z-50" style={{ background: 'linear-gradient(180deg, rgba(55, 65, 81, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%)' }}>
                <div className="flex flex-col items-center space-y-6">
                    <Link href="/" className="p-3 rounded-xl hover:bg-white/15 hover:scale-110 transition-all duration-300 group transform" style={{ transform: 'scale(1)' }}>
                        <Home className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                    </Link>

                    <Link href="/search" className="p-3 rounded-xl hover:bg-white/15 hover:scale-110 transition-all duration-300 group transform" style={{ transform: 'scale(1)' }}>
                        <Search className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                    </Link>

                    <Link href="/contact" className="p-3 rounded-xl hover:bg-white/15 hover:scale-110 transition-all duration-300 group transform" style={{ transform: 'scale(1)' }}>
                        <Mail className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                    </Link>

                    <Link href="/login" className="p-3 rounded-xl hover:bg-white/15 hover:scale-110 transition-all duration-300 group transform" style={{ transform: 'scale(1)' }}>
                        <Shield className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </nav>

            {/* 모바일 네비게이션 - 하단 */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-gray-900/60 backdrop-blur-xl border-0 rounded-xl shadow-2xl shadow-black/40 flex items-center justify-around px-4 z-50">
                <Link href="/" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                    <Home className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </Link>

                <Link href="/search" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                    <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </Link>

                <Link href="/contact" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                    <Mail className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </Link>

                <Link href="/login" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                    <Shield className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </Link>
            </nav>
        </>
    );
};

export default Navigation; 