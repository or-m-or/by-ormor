'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface CustomPopoverProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: ReactNode;
    children: ReactNode;
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
    className?: string;
    style?: React.CSSProperties;
}

export const CustomPopover = ({
    open,
    onOpenChange,
    trigger,
    children,
    sideOffset = 8,
    align = 'start',
    className = '',
    style = {}
}: CustomPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onOpenChange(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onOpenChange]);

    const handleTriggerClick = () => {
        const newOpenState = !isOpen;
        setIsOpen(newOpenState);
        onOpenChange(newOpenState);
    };

    return (
        <div className="relative">
            <div
                ref={triggerRef}
                onClick={handleTriggerClick}
                className="cursor-pointer"
            >
                {trigger}
            </div>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className={`fixed z-50 ${className}`}
                    style={{
                        top: triggerRef.current ? triggerRef.current.getBoundingClientRect().bottom + sideOffset : 0,
                        left: triggerRef.current ? triggerRef.current.getBoundingClientRect().left : 0,
                        ...style
                    }}
                >
                    {children}
                </div>
                , document.body)}
        </div>
    );
};

export default CustomPopover;
