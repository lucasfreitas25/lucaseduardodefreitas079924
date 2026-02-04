import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
        icon: LucideIcon;
    };
}

export function PageHeader({ title, subtitle, icon: Icon, action }: PageHeaderProps) {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 dark:from-orange-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
                </div>
            </div>

            {action && (
                <button
                    onClick={action.onClick}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                    <action.icon className="w-5 h-5" />
                    <span>{action.label}</span>
                </button>
            )}
        </header>
    );
}
