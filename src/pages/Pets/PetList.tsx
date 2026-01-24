import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { petsService } from '../../services/api/pets_service';
import type { Pet } from '../../types';
import { Card } from '../../components/UI/Card';
import { Pagination } from '../../components/UI/Pagination';
import { Link } from 'react-router-dom';
export default function PetList() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);



    useEffect(() => {
        fetchPets();
    }, [page, searchTerm]);

    const fetchPets = async () => {
        setLoading(true);
        setError(null);
        try {

            const response = await petsService.getPets({
                name: searchTerm,
                page,
                limit: 10
            });
            setPets(response.items);
            setTotalPages(response.total_pages || Math.ceil(response.total / response.per_page) || 1);
        } catch (error: any) {
            console.error('Error fetching pets:', error);
            setError(error.message || 'Erro ao carregar pets. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pets Disponíveis</h1>

                <div className="relative w-full sm:w-72">
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
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
                    <p>{error}</p>
                    <button
                        onClick={fetchPets}
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
                    {pets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pets.map((pet) => (
                                <Link to={`/pets/${pet.id}`}>
                                    <Card
                                        key={pet.id}
                                        title={pet.name}
                                        subtitle={`${pet.breed} • ${pet.age} anos`}
                                        image={pet.photo_url}
                                        className="h-full"
                                    >
                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                Disponível
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum pet encontrado.</p>
                        </div>
                    )}

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
