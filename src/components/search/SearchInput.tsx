'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface SearchInputProps extends React.ComponentProps<'input'> {
    className?: string;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
    return (
        <div className={cn('relative mb-4 w-full', className)}>
            <input
                type="text"
                className={cn(
                    'block w-full rounded-xl border-0 px-4 py-3 pr-12',
                    'bg-gray-800/50 text-white placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                    'backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl',
                )}
                {...props}
            />
            <Search
                className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none"
                strokeWidth={2}
            />
        </div>
    );
} 