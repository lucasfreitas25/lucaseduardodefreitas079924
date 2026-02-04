import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormSectionProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
    iconColor?: string;
}

export function FormSection({
    title,
    icon: Icon,
    children,
    className = '',
    iconColor = 'text-orange-500'
}: FormSectionProps) {
    return (
        <section className={`pt-6 border-t border-gray-100 dark:border-gray-700 ${className}`}>
            <header className="flex items-center gap-2 mb-4">
                {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
            </header>
            {children}
        </section>
    );
}
