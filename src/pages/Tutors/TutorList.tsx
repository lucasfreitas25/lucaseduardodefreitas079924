import { useState, useEffect, useRef } from 'react';
import { Search, Trash } from 'lucide-react';
import { TutorService } from '../../services/api/tutors_service';
import type { Tutor } from '../../types';
import { Card } from '../../components/UI/Card';
import { Pagination } from '../../components/UI/Pagination';
import { useNavigate } from 'react-router-dom';

export default function TutorList() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const isFirstLoad = useRef(true);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchTutors();
    }, [page, debouncedSearchTerm]);

    const fetchTutors = async () => {
        // Only show loading skeleton on first load, not on searches
        if (isFirstLoad.current) {
            setLoading(true);
            isFirstLoad.current = false;
        }
        setError(null);
        try {
            const response = await TutorService.getTutors({
                name: debouncedSearchTerm,
                page,
                limit: 10
            });
            setTutors(response.items);
            setTotalPages(response.total_pages || Math.ceil(response.total / response.per_page) || 1);
        } catch (error: any) {
            console.error('Error fetching Tutors:', error);
            setError(error.message || 'Erro ao carregar Tutores. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este tutor?')) return;
        try {
            await TutorService.deleteTutor(id);
            setTutors(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting tutor:', err);
            alert('Erro ao excluir tutor.');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    return (
        <main className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tutores Disponíveis</h1>

                <button
                    onClick={() => navigate('/tutors/new')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    <span>Novo Tutor</span>
                </button>
            </header>

            <section className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </section>

            {error && (
                <div role="alert" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
                    <p>{error}</p>
                    <button
                        onClick={fetchTutors}
                        className="mt-2 text-sm font-medium underline hover:text-red-700 dark:hover:text-red-300"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a1a1a] h-80 rounded-xl shadow-sm animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {tutors.length > 0 ? (
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {tutors.map((tutor) => (
                                <article key={tutor.id} className="relative group">
                                    <Card
                                        title={tutor.name}
                                        subtitle={`${tutor.email} • ${tutor.phone}`}
                                        image={tutor.photo_url || 'https://placehold.co/400x300?text=No+Image'}
                                        className="h-full hover:shadow-lg transition-all duration-300"
                                    >
                                    </Card>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/tutors/${tutor.id}/edit`);
                                        }}
                                        className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-black/50 rounded-full shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                                        title="Editar Tutor"
                                    >
                                        <img src={"/src/assets/edit.svg"} alt={"Editar"} className='w-4 h-4 invert brightness-0' />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(tutor.id);
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-black/50 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                                        title="Deletar Tutor"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </article>
                            ))}
                        </section>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum tutor encontrado.</p>
                        </div>
                    )}

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </main>
    );
}
