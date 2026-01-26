import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { petsService } from '../../services/api/pets_service';
import type { PetDetailsDTO } from '../../types/dtos';

export default function PetDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pet, setPet] = useState<PetDetailsDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchPetDetails(Number(id));
        }
    }, [id]);

    const fetchPetDetails = async (petId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await petsService.getPetById(petId);
            setPet(data);
        } catch (err: any) {
            console.error('Error fetching pet details:', err);
            setError(err.message || 'Erro ao carregar detalhes do pet.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </section>
        );
    }

    if (error || !pet) {
        return (
            <section className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Pet não encontrado'}</p>
                <Link to="/pets" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para lista
                </Link>
            </section>
        );
    }

    return (
        <main className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
            </button>

            <article className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
                <figure className="aspect-w-16 aspect-h-9 relative h-64 sm:h-96">
                    <img
                        src={pet.foto?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000'}
                        alt={pet.nome}
                        className="w-full h-full object-cover"
                    />
                    <figcaption className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <header className="p-8 text-white w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{pet.nome}</h1>
                                    <p className="text-xl opacity-90">{pet.raca}</p>
                                </div>

                            </div>
                        </header>
                    </figcaption>
                </figure>

                <section className="p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                            <Calendar className="h-6 w-6" />
                            <div>
                                <p className="text-xs opacity-70">Idade</p>
                                <p className="font-semibold">{pet.idade} anos</p>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Sobre</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {pet.nome} é um {pet.raca} muito dócil e brincalhão. Está com {pet.idade} anos de idade e adora passear.
                            </p>
                        </section>

                        {pet.tutores && pet.tutores.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tutores Responsáveis</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pet.tutores.map((tutor) => (
                                        <li key={tutor.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-gray-50 dark:bg-gray-800/50">
                                            <figure className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                                {tutor.foto ? (
                                                    <img src={tutor.foto.url} alt={tutor.nome} className="h-full w-full rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-blue-600 dark:text-blue-300 font-bold text-lg">
                                                        {tutor.nome.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </figure>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                    {tutor.nome}
                                                </h3>
                                                <address className="mt-1 space-y-1 not-italic">
                                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                                        <span className="truncate">Telefone: {tutor.telefone}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                                        <span className="truncate">Email: {tutor.email}</span>
                                                    </div>
                                                </address>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </section>
            </article>
        </main>
    );
}
