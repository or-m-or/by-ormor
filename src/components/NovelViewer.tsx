'use client';

import { EditorContent } from 'novel';
import { defaultExtensions } from './editor/extensions';
import { slashCommand } from './editor/SlashCommand';

interface NovelViewerProps {
    content: any;
    className?: string;
}

const NovelViewer = ({ content, className = '' }: NovelViewerProps) => {
    // NovelEditor와 동일한 extensions 사용
    const extensions = [...defaultExtensions, slashCommand];

    return (
        <div className="relative">
            <EditorContent
                initialContent={content}
                extensions={extensions}
                editable={false}
                immediatelyRender={false}
                className={`prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full text-gray-300 text-lg sm:text-xl ${className}`}
                editorProps={{
                    attributes: {
                        class:
                            "prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full text-gray-300 text-lg sm:text-xl",
                    },
                }}
            />
        </div>
    );
};

export default NovelViewer; 