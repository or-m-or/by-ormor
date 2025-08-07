'use client';

import { Home, Search, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const Navigation = () => {
    return (
        <TooltipProvider>
            <>
                {/* 데스크톱 네비게이션 - 좌측 */}
                <nav className="hidden md:flex fixed left-6 top-6 h-auto w-16 bg-gray-800/70 backdrop-blur-xl border-0 rounded-xl shadow-2xl shadow-black/40 flex-col items-center py-6 z-50">
                    <div className="flex flex-col items-center space-y-6">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                    <Home className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                                <p>전부 모아보기</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/search" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                    <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                                <p>블로그 검색</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/contact" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                    <Mail className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                                <p>개발자 문의</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/login" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                    <Shield className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                                <p>블로그 관리</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </nav>

                {/* 모바일 네비게이션 - 하단 */}
                <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-gray-900/60 backdrop-blur-xl border-0 rounded-xl shadow-2xl shadow-black/40 flex items-center justify-around px-4 z-50">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                <Home className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                            <p>전부 모아보기</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/search" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                            <p>블로그 검색</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/contact" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                <Mail className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                            <p>개발자 문의</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/login" className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                                <Shield className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8} className="bg-gray-900/95 backdrop-blur-xl border-0 text-white shadow-2xl shadow-black/50">
                            <p>블로그 관리</p>
                        </TooltipContent>
                    </Tooltip>
                </nav>
            </>
        </TooltipProvider>
    );
};

export default Navigation; 