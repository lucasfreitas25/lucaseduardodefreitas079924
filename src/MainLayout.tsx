import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dog, Menu, X, PawPrint } from 'lucide-react';
import { ThemeToggle } from './components/UI/ThemeToggle';

export function MainLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col paw-pattern">
            <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-cyan-500 dark:from-orange-700 dark:via-orange-800 dark:to-cyan-700 shadow-lg sticky top-0 z-50 border-b-4 border-orange-300 dark:border-orange-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3 animate-slide-in">
                            <div className="bg-white dark:bg-gray-900 p-2.5 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                                <Dog className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl tracking-tight text-white drop-shadow-md">PetManager</span>
                                <span className="text-xs text-orange-100 dark:text-orange-200 hidden sm:block">Cuidando com amor 🐾</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-2">
                            <Link
                                to="/pets"
                                className="px-4 py-2 text-white hover:bg-white/20 dark:hover:bg-black/20 font-medium transition-all rounded-lg backdrop-blur-sm flex items-center gap-2 group"
                            >
                                <PawPrint className="w-4 h-4 group-hover:animate-wiggle" />
                                Pets
                            </Link>
                            <Link
                                to="/tutors"
                                className="px-4 py-2 text-white hover:bg-white/20 dark:hover:bg-black/20 font-medium transition-all rounded-lg backdrop-blur-sm flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Tutores
                            </Link>
                        </nav>

                        {/* Theme Toggle & Mobile Menu Button */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link
                                to="/login"
                                className="hidden sm:block px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 text-white font-medium transition-all rounded-lg backdrop-blur-sm"
                            >
                                Sair
                            </Link>

                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 rounded-lg text-white hover:bg-white/20 dark:hover:bg-black/20 focus:outline-none transition-all"
                                >
                                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-white/20 dark:border-black/20 bg-orange-600/95 dark:bg-orange-900/95 backdrop-blur-sm absolute w-full shadow-xl animate-fade-in">
                        <div className="pt-2 pb-4 space-y-1 px-4">
                            <Link
                                to="/pets"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/20 dark:hover:bg-black/20 transition-all"
                            >
                                <PawPrint className="w-5 h-5" />
                                Pets
                            </Link>
                            <Link
                                to="/tutors"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/20 dark:hover:bg-black/20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Tutores
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/20 dark:hover:bg-black/20 transition-all sm:hidden"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sair
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <Outlet />
            </main>

            <footer className="bg-white dark:bg-gray-900 border-t-4 border-orange-300 dark:border-orange-800 mt-auto shadow-inner">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <PawPrint className="w-4 h-4 text-orange-500" />
                            &copy; 2026 Governo do Estado de Mato Grosso - SEPLAG
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <span>Feito com</span>
                            <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span>para os pets</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
