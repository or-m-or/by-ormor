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
                    'block w-full rounded-md border px-4 py-2 pr-10',
                    'border-neutral-200 bg-white placeholder:text-neutral-400',
                    'dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-500',
                    'focus:outline-none focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-800',
                )}
                {...props}
            />
            <Search
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
                strokeWidth={2}
            />
        </div>
    );
} 