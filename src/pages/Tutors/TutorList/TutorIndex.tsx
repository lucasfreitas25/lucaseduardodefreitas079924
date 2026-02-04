import { useState, useEffect } from 'react';
import { Plus, Search, Trash, Users } from 'lucide-react';
import { useTutors, useDeleteTutor } from '../../../hooks/queries/useTutor';
import { Card } from '../../../components/UI/Card';
import { Pagination } from '../../../components/UI/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import { PageHeader } from '../../../components/UI/PageHeader';
import { SearchInput } from '../../../components/UI/SearchInput';
import { EmptyState } from '../../../components/UI/EmptyState';

export default function TutorList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page')) || 1;
    const urlSearch = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(urlSearch);
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading, error, refetch } = useTutors(page, debouncedSearch);
    const { mutateAsync: deleteTutor } = useDeleteTutor();

    const navigate = useNavigate();

    useEffect(() => {
        if (debouncedSearch !== urlSearch) {
            const newParams = new URLSearchParams(searchParams);
            if (debouncedSearch) {
                newParams.set('search', debouncedSearch);
            } else {
                newParams.delete('search');
            }
            newParams.set('page', '1');
            setSearchParams(newParams);
        }
    }, [debouncedSearch, urlSearch, searchParams, setSearchParams]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(newPage));
        setSearchParams(newParams);
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

    const renderLoading = () => (
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
    );

    const renderError = () => (
        <section className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
            <p className="font-semibold">Erro ao carregar tutores.</p>
            <button
                onClick={() => refetch()}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
                Tentar novamente
            </button>
        </section>
    );

    const renderTutorGrid = () => (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.items.map((tutor) => (
                <article key={tutor.id} className="relative group">
                    <Card
                        title={tutor.name}
                        subtitle={`${tutor.email} • ${tutor.phone}`}
                        image={tutor.photo_url || '/assets/imagem_tutor_sem_foto.png'}
                        className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                    </Card>
                    <div className="flex gap-2 absolute top-2 right-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/tutors/${tutor.id}/edit`, { state: { from: `/tutors?${searchParams.toString()}` } });
                            }}
                            className="p-2.5 bg-white/95 dark:bg-gray-900/95 rounded-full shadow-lg hover:bg-orange-50 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 transition-all transform hover:scale-110"
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
                            className="p-2.5 bg-white/95 dark:bg-gray-900/95 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all transform hover:scale-110"
                            title="Deletar Tutor"
                        >
                            <Trash className="h-4 w-4" />
                        </button>
                    </div>
                </article>
            ))}
        </section>
    );

    return (
        <section className="space-y-6">
            <PageHeader
                title="Tutores Disponíveis"
                subtitle="Gerencie todos os tutores cadastrados"
                icon={Users}
                action={{
                    label: "Novo Tutor",
                    icon: Plus,
                    onClick: () => navigate('/tutors/new')
                }}
            />

            <SearchInput
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar por nome..."
            />

            {error && renderError()}
            {isLoading ? renderLoading() : (
                <>
                    {data?.items && data.items.length > 0 ? (
                        renderTutorGrid()
                    ) : (
                        <EmptyState
                            title="Nenhum tutor encontrado."
                            description="Adicione um novo tutor para começar!"
                            icon={Search}
                        />
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
