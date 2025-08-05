'use client';

import { Home, Search, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    publishedDate: string;
    readTime: string;
    category: string;
}

interface NavigationProps {
    posts?: BlogPost[];
}

const Navigation = ({ posts = [] }: NavigationProps) => {
    return (
        <>
            {/* 데스크톱 네비게이션 - 좌측 */}
            <nav className="hidden md:flex fixed left-0 top-0 h-full w-16 bg-black/90 backdrop-blur-sm border-r border-gray-800/50 flex-col items-center justify-center space-y-8 z-50">
                <div className="flex flex-col items-center space-y-6">
                    <Link href="/" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                        <Home className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                    </Link>

                    <Link href="/search" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                        <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                    </Link>

                    <Link href="/contact" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                        <Mail className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </nav>

            {/* 모바일 네비게이션 - 하단 */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-sm border-t border-gray-800/50 flex items-center justify-around px-4 z-50">
                <Link href="/" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                    <Home className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </Link>

                <Link href="/search" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                    <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </Link>

                <Link href="/contact" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                    <Mail className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </Link>
            </nav>
        </>
    );
};

export default Navigation; 