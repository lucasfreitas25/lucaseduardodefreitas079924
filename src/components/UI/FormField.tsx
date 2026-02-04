import React from 'react';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormField({ label, htmlFor, error, children, className = "" }: FormFieldProps) {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
