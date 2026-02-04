import { Save } from 'lucide-react';

interface ButtonFooterProps {
    loading?: boolean;
    label?: string;
}

export function ButtonFooter({ loading, label = 'Salvar Alterações' }: ButtonFooterProps) {
    return (
        <footer className="flex justify-center md:justify-end pt-8 border-t-2 border-gray-200 dark:border-gray-700">
            <button
                type="submit"
                disabled={loading}
                className="flex items-center px-10 py-4 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Salvando...
                    </>
                ) : (
                    <>
                        <Save className="h-5 w-5 mr-2" />
                        {label}
                    </>
                )}
            </button>
        </footer>
    );
}