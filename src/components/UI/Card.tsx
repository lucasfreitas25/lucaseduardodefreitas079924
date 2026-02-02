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
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 ${className}`}>
            {image && (
                <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-orange-100 to-cyan-100 dark:from-gray-700 dark:to-gray-600 relative group">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/imagem_pet_sem_foto.png';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            )}
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{title}</h3>
                {subtitle && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5 font-medium">{subtitle}</p>}
                {children && <div className="mt-4">{children}</div>}
            </div>
            {footer && (
                <div className="bg-gradient-to-r from-orange-50 to-cyan-50 dark:from-gray-700 dark:to-gray-700 px-5 py-3 border-t-2 border-gray-200 dark:border-gray-600">
                    {footer}
                </div>
            )}
        </div>
    );
}
