import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dog, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../UI/ThemeToggle';

export function MainLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-gray-100 flex flex-col">
            <header className="bg-white dark:bg-[#1a1a1a] shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Dog className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">PetManager</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/pets" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                Pets
                            </Link>
                            <Link to="/tutors" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                Tutores
                            </Link>
                        </nav>

                        {/* Theme Toggle & Mobile Menu Button */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                Sair
                            </Link>

                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                                >
                                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] absolute w-full shadow-lg">
                        <div className="pt-2 pb-4 space-y-1 px-4">
                            <Link
                                to="/pets"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Pets
                            </Link>
                            <Link
                                to="/tutors"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Tutores
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <footer className="bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        &copy; 2026 Governo do Estado de Mato Grosso - SEPLAG
                    </p>
                </div>
            </footer>
        </div>
    );
}
