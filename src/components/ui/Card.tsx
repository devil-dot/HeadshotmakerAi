import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
}

export default function Card({ children, className = '', glass = true }: CardProps) {
    const glassStyles = glass
        ? 'bg-white/5 backdrop-blur-xl border border-white/10'
        : 'bg-gray-800/50 border border-gray-700/50';

    return (
        <div className={`rounded-2xl p-6 shadow-2xl ${glassStyles} ${className}`}>
            {children}
        </div>
    );
}
