import React from 'react';

interface FormCardProps {
    children: React.ReactNode;
    className?: string;
}

export function FormCard({ children, className = '' }: FormCardProps) {
    return (
        <article className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8 ${className}`}>
            {children}
        </article>
    );
}
