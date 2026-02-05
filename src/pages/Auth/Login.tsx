import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Dog, PawPrint } from 'lucide-react';
import type { LoginCredentials } from '../../types/auth';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginCredentials>();

    const onSubmit = async (data: LoginCredentials) => {
        setError('');
        setLoading(true);

        try {
            await login(data);
            navigate('/pets', { replace: true });
        } catch (err) {
            console.error(err);
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-screen h-[100dvh] flex items-center justify-center p-4 sm:p-6 lg:p-8 paw-pattern relative overflow-hidden">
            <div className="absolute top-10 left-10 opacity-10 dark:opacity-5 animate-float hidden sm:block">
                <PawPrint className="w-24 h-24 text-orange-600" />
            </div>
            <div className="absolute bottom-20 right-20 opacity-10 dark:opacity-5 animate-float hidden sm:block" style={{ animationDelay: '1s' }}>
                <PawPrint className="w-32 h-32 text-cyan-600" />
            </div>
            <div className="absolute top-1/3 right-10 opacity-10 dark:opacity-5 animate-float hidden sm:block" style={{ animationDelay: '2s' }}>
                <PawPrint className="w-20 h-20 text-purple-600" />
            </div>

            <article className="max-w-md w-full space-y-4 sm:space-y-8 glass p-6 sm:p-10 rounded-2xl shadow-2xl border-2 border-orange-200 dark:border-orange-900 animate-fade-in relative z-10">
                <header className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 animate-wiggle">
                        <Dog className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl font-extrabold gradient-text">
                        Pet Manager
                    </h2>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                        <PawPrint className="w-4 h-4 text-orange-500" />
                        Faça login para acessar o sistema
                        <PawPrint className="w-4 h-4 text-orange-500" />
                    </p>
                </header>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div role="alert" className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl text-sm text-center border-2 border-red-300 dark:border-red-800 animate-fade-in">
                            {error}
                        </div>
                    )}

                    <fieldset className="space-y-4">
                        <div className="relative">
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Usuário
                            </label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                {...register('username', { required: 'Usuário é obrigatório' })}
                                className={`appearance-none relative block w-full px-4 py-3 border-2 ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm`}
                                placeholder="Digite seu usuário (admin)"
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-500 font-medium">{errors.username.message}</p>
                            )}
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password', { required: 'Senha é obrigatória' })}
                                className={`appearance-none relative block w-full px-4 py-3 border-2 ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm`}
                                placeholder="Digite sua senha"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>
                    </fieldset>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <PawPrint className="w-5 h-5" />
                                    Entrar
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            🐾 Credenciais padrão: <span className="font-semibold">admin</span>
                        </p>
                    </div>
                </form>
            </article>
        </main>
    );
}
