import { useState } from 'react';
import { Search, Trash } from 'lucide-react';
import { useTutors, useDeleteTutor } from '../../hooks/queries/useTutor';
import { Card } from '../../components/UI/Card';
import { Pagination } from '../../components/UI/Pagination';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

export default function TutorList() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading, error, refetch } = useTutors(page, debouncedSearch);
    const { mutateAsync: deleteTutor } = useDeleteTutor();

    const navigate = useNavigate();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este tutor?')) return;
        try {
            await deleteTutor(id);
        } catch (err) {
            console.error('Error deleting tutor:', err);
            alert('Erro ao excluir tutor.');
        }
    };

    return (
        <section className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 dark:from-orange-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        Tutores Disponíveis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie todos os tutores cadastrados</p>
                </div>

                <button
                    onClick={() => navigate('/tutors/new')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </section>

            {error ? (
                <section className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
                    <p className="font-semibold">Erro ao carregar tutores.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Tentar novamente
                    </button>
                </section>
            ) : null}

            {isLoading ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 h-80 rounded-2xl shadow-md animate-pulse border-2 border-gray-200 dark:border-gray-700">
                            <div className="h-48 bg-gradient-to-br from-orange-200 to-cyan-200 dark:from-orange-900 dark:to-cyan-900 rounded-t-2xl"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                <>
                    {data?.items && data.items.length > 0 ? (
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.items.map((tutor) => (
                                <article key={tutor.id} className="relative group">
                                    <Card
                                        title={tutor.name}
                                        subtitle={`${tutor.email} • ${tutor.phone}`}
                                        image={tutor.photo_url || '/assets/imagem_pet_sem_foto.png'}
                                        className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                    >
                                    </Card>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/tutors/${tutor.id}/edit`);
                                        }}
                                        className="absolute bottom-2 right-2 p-2.5 bg-white/95 dark:bg-gray-900/95 rounded-full shadow-lg hover:bg-orange-50 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 transition-all transform hover:scale-110"
                                        title="Editar Tutor"
                                    >
                                        <img src={"/assets/edit.svg"} alt={"Editar"} className='w-4 h-4 dark:invert brightness-0' />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(tutor.id);
                                        }}
                                        className="absolute top-2 right-2 p-2.5 bg-white/95 dark:bg-gray-900/95 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all transform hover:scale-110"
                                        title="Deletar Tutor"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </article>
                            ))}
                        </section>
                    ) : (
                        <section className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                    <svg className="w-16 h-16 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Nenhum tutor encontrado.</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Adicione um novo tutor para começar!</p>
                        </section>
                    )}

                    {data && (
                        <Pagination
                            currentPage={page}
                            totalPages={data.total_pages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </section>
    );
}
