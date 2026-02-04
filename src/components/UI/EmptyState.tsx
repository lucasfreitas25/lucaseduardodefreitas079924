import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
    return (
        <section className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="flex justify-center mb-4">
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Icon className="w-16 h-16 text-orange-500 dark:text-orange-400" />
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">{title}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{description}</p>
        </section>
    );
}
