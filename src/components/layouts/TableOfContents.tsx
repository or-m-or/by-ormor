'use client';

import { useState, useEffect } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isClient, setIsClient] = useState(false);

    // 클라이언트 사이드에서만 실행
    useEffect(() => {
        setIsClient(true);
    }, []);

    // HTML 콘텐츠에서 헤딩 태그를 추출하여 목차 생성
    useEffect(() => {
        if (!isClient) return;

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

            const items: TocItem[] = Array.from(headings).map((heading, index) => {
                const level = parseInt(heading.tagName.charAt(1));
                const text = heading.textContent || '';
                const id = heading.id || `heading-${index}`;

                return { id, text, level };
            });

            setTocItems(items);
        } catch (error) {
            console.error('목차 생성 중 오류:', error);
        }
    }, [content, isClient]);

    // 스크롤 위치에 따라 활성 헤딩 업데이트
    useEffect(() => {
        if (!isClient || tocItems.length === 0) return;

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;

            // 현재 보이는 헤딩 찾기
            let activeItem = '';
            for (let i = tocItems.length - 1; i >= 0; i--) {
                const element = document.getElementById(tocItems[i].id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= windowHeight * 0.3) {
                        activeItem = tocItems[i].id;
                        break;
                    }
                }
            }

            setActiveId(activeItem);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 초기 실행

        return () => window.removeEventListener('scroll', handleScroll);
    }, [tocItems, isClient]);

    // 목차 클릭 시 해당 헤딩으로 스크롤
    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!isClient || tocItems.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
            <nav className="space-y-1">
                {tocItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${activeId === item.id
                                ? 'text-purple-400 bg-purple-400/10'
                                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                        style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
                    >
                        {item.text}
                    </button>
                ))}
            </nav>
        </div>
    );
}; 