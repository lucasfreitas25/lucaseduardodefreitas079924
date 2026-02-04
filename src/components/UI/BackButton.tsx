import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    disabled?: boolean;
    className?: string;
    to?: string;
}

export function BackButton({ disabled, className = '', to }: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => to ? navigate(to) : navigate(-1)}
            className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all font-medium group ${className}`}
            disabled={disabled}
        >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar
        </button>
    );
}
