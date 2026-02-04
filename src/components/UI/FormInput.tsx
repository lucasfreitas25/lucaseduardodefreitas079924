import React from 'react';
import { FormField } from './FormField';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: string;
    containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, id, error, containerClassName, className = "", ...props }, ref) => {
        return (
            <FormField label={label} htmlFor={id} error={error} className={containerClassName}>
                <input
                    ref={ref}
                    id={id}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 ${className}`}
                    {...props}
                />
            </FormField>
        );
    }
);

FormInput.displayName = 'FormInput';
