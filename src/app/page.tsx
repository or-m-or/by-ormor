'use client';

import Navigation from '@/components/Navigation';
import BlogList from '@/components/BlogList';
import Image from 'next/image';
import Link from 'next/link';
import { ShootingStars } from '@/components/common/ShootingStars';
import { StarsBackground } from '@/components/common/StarsBackground';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* 고정된 배경 애니메이션 */}
      <div className="fixed inset-0 z-0">
        <ShootingStars />
        <StarsBackground />
      </div>

      {/* 스크롤되는 내용 */}
      <div className="relative z-10">
        <Navigation />

        <main className="md:ml-28 pb-16 md:pb-0 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center justify-between mb-2">
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

            {/* Blog Posts */}
            <BlogList />
          </div>
        </main>
      </div>
    </div>
  );
}
