import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    const handleReload = () => {
        if (resetErrorBoundary) {
            resetErrorBoundary();
        } else {
            window.location.reload();
        }
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-8 text-center">
                    <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Ops! Algo deu errado.
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                        Desculpe pelo inconveniente. Ocorreu um erro inesperado na aplicação.
                        Nossa equipe técnica foi notificada.
                    </p>

                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg text-left mb-6 overflow-auto max-h-32">
                        <p className="font-mono text-xs text-red-600 dark:text-red-400 break-words">
                            {error.message || 'Erro desconhecido'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleReload}
                            className="flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Tentar Novamente
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="flex items-center justify-center px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Ir para Início
                        </button>
                    </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center">
                    <p className="text-xs text-gray-400">
                        Código do erro: {import.meta.env.PROD ? 'PROD_ERR' : 'DEV_ERR'}
                    </p>
                </div>
            </div>
        </div>
    );
};
