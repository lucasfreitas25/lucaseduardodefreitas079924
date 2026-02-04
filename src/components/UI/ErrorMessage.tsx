interface ErrorMessageProps {
    message: string;
    className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div
            role="alert"
            className={`mb-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl animate-fade-in ${className}`}
        >
            {message}
        </div>
    );
}
