import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-white/30 dark:border-white/10"
            title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-white transition-transform hover:rotate-12" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-300 transition-transform hover:rotate-45" />
            )}
        </button>
    );
}
