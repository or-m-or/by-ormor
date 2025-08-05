import React from 'react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

export const Alert = ({ type, message }: AlertProps) => {
  const baseStyle =
    'rounded-md px-4 py-3 text-sm font-medium text-center transition-all duration-300 backdrop-blur-md border border-white/10 shadow-sm';
  const typeStyle =
    type === 'success' ? 'bg-green-300/10 text-green-200' : 'bg-red-300/10 text-red-300';

  return <div className={`${baseStyle} ${typeStyle}`}>{message}</div>;
}; 