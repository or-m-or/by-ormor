'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createPortal } from 'react-dom';

interface SelectOption {
    id: number;
    name: string;
    color?: string;
    [key: string]: string | number | undefined;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    loading?: boolean;
    className?: string;
    disabled?: boolean;
}

export default function Select({
    options,
    value,
    onChange,
    placeholder = '선택하세요',
    loading = false,
    className = '',
    disabled = false
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.select-dropdown')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionName: string) => {
        onChange(optionName);
        setIsOpen(false);
    };

    return (
        <div className={`relative select-dropdown ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full px-3 py-2 bg-gray-800/50 border-0 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-between disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className={value ? 'text-white' : 'text-gray-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && buttonRef.current && createPortal(
                <div
                    className="fixed bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl z-50"
                    style={{
                        top: buttonRef.current.getBoundingClientRect().bottom + 8,
                        left: buttonRef.current.getBoundingClientRect().left,
                        width: buttonRef.current.offsetWidth,
                        maxHeight: '200px'
                    }}
                >
                    <ScrollArea className="h-48">
                        <div className="p-2">
                            {loading ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">로딩 중...</div>
                            ) : options.length === 0 ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">옵션이 없습니다.</div>
                            ) : (
                                options.map(option => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleSelect(option.name)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${value === option.name
                                            ? 'bg-gray-600/50 text-white shadow-sm'
                                            : `text-white hover:bg-gray-700/50 hover:text-white`
                                            }`}
                                    >
                                        <span className={option.color || 'text-white'}>
                                            {option.name}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>,
                document.body
            )}
        </div>
    );
}
