'use client';

import { useState, useEffect } from 'react';

interface TableOfContentsProps {
    content: unknown; // Changed from string to unknown for Novel JSON
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);

    useEffect(() => {
        if (!content) return;

        try {
            // Novel JSON에서 제목 태그들을 직접 추출
            const extractHeadings = (content: unknown): TocItem[] => {
                if (!content || !(content as { content: unknown }).content) return [];

                const headings: TocItem[] = [];

                const traverse = (nodes: unknown[]) => {
                    nodes.forEach((node, index) => {
                        const nodeObj = node as { type?: string; attrs?: { level?: number }; content?: unknown[] };
                        if (nodeObj.type === 'heading') {
                            const level = nodeObj.attrs?.level || 1;
                            const content = nodeObj.content?.[0] as { text?: string };
                            const text = content?.text || '';
                            // 제목 텍스트와 순서를 기반으로 고유한 ID 생성
                            const baseId = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                            const id = `heading-${baseId}-${headings.length + 1}-${Date.now()}`;

                            headings.push({ id, text, level });
                        }

                        // 재귀적으로 자식 노드들도 탐색
                        if (nodeObj.content && Array.isArray(nodeObj.content)) {
                            traverse(nodeObj.content);
                        }
                    });
                };

                traverse((content as { content: unknown[] }).content);
                return headings;
            };

            const items = extractHeadings(content);
            setTocItems(items);
        } catch (error) {
            console.error('TOC generation error:', error);
            setTocItems([]);
        }
    }, [content]);

    if (tocItems.length === 0) {
        return null;
    }

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // 네비게이션 바와 목차를 고려한 오프셋
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className="sticky top-8">
            <div className="p-4">
                <h3 className="text-sm font-medium text-white mb-3 border-b border-gray-700/50 pb-2">목차</h3>
                <div className="space-y-0.5">
                    {tocItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToHeading(item.id)}
                            className={`block w-full text-left px-2 py-1.5 rounded text-sm transition-colors hover:bg-gray-700/20 hover:text-white ${item.level === 1
                                ? 'font-medium text-white'
                                : item.level === 2
                                    ? 'text-gray-300 ml-2'
                                    : 'text-gray-400 ml-4'
                                }`}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
} 