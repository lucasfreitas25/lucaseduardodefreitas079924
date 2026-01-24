import React from 'react';

interface CardProps {
    title: string;
    subtitle?: string;
    image?: string;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export function Card({ title, subtitle, image, footer, children, className = '' }: CardProps) {
    return (
        <div className={`bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
            {image && (
                <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/400x300?text=No+Image'; // Fallback
                        }}
                    />
                </div>
            )}
            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
                {children && <div className="mt-4">{children}</div>}
            </div>
            {footer && (
                <div className="bg-gray-50 dark:bg-[#242424] px-5 py-3 border-t border-gray-100 dark:border-gray-800">
                    {footer}
                </div>
            )}
        </div>
    );
}
