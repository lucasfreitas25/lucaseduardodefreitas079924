import { useState } from 'react';
import { Search, Trash } from 'lucide-react';
import { usePets, useDeletePet } from '../../hooks/queries/usePet';
import { Card } from '../../components/UI/Card';
import { Pagination } from '../../components/UI/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

export default function PetList() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading, error, refetch } = usePets(page, debouncedSearch);
    const { mutateAsync: deletePet } = useDeletePet();

    const navigate = useNavigate();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este pet?')) return;
        try {
            await deletePet(id);
        } catch (err) {
            console.error('Error deleting pet:', err);
            alert('Erro ao excluir pet.');
        }
    };

    return (
        <section className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pets Disponíveis</h1>

                <button
                    onClick={() => navigate('/pets/new')}
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
                    <span>Novo Pet</span>
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

            {error ? (
                <section className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
                    <p>Erro ao carregar pets.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-2 text-sm font-medium underline hover:text-red-700 dark:hover:text-red-300"
                    >
                        Tentar novamente
                    </button>
                </section>
            ) : null}

            {isLoading ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a1a1a] h-80 rounded-xl shadow-sm animate-pulse" />
                    ))}
                </section>
            ) : (
                <>
                    {data?.items && data.items.length > 0 ? (
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.items.map((pet) => (
                                <article key={pet.id} className="relative group">
                                    <Link to={`/pets/${pet.id}`}>
                                        <Card
                                            title={pet.name}
                                            subtitle={`${pet.breed} ${pet.age} anos`}
                                            image={pet.photo_url || 'src/assets/imagem_pet_sem_foto.png'}
                                            className="h-full hover:shadow-lg transition-all duration-300"
                                        >
                                        </Card>
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/pets/${pet.id}/edit`);
                                        }}
                                        className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-black/50 rounded-full shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                                        title="Editar Pet"
                                    >
                                        <img src={"/src/assets/edit.svg"} alt={"Editar"} className='w-4 h-4 dark:invert brightness-0 ' />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(pet.id);
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-black/50 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                                        title="Deletar Pet"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </article>
                            ))}
                        </section>
                    ) : (
                        <section className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum pet encontrado.</p>
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
