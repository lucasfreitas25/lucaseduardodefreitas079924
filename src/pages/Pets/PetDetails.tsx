import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, PawPrint } from 'lucide-react';
import { usePet } from '../../hooks/queries/usePet';

export default function PetDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const numericId = id ? Number(id) : undefined;
    const { data: selectedPet, isLoading, error } = usePet(numericId);

    if (isLoading) {
        return (
            <section className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </section>
        );
    }

    if (error || !selectedPet) {
        return (
            <section className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">{error ? 'Erro ao carregar detalhes' : 'Pet não encontrado'}</p>
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
                <figure className="relative h-64 sm:h-96 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    {/* Background Blurred Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30 dark:opacity-40"
                        style={{ backgroundImage: `url(${selectedPet.foto?.url || '/assets/imagem_pet_sem_foto.png'})` }}
                    />

                    {/* Main Clear Image */}
                    <img
                        src={selectedPet.foto?.url || '/assets/imagem_pet_sem_foto.png'}
                        alt={selectedPet.nome}
                        className="relative z-10 max-h-full max-w-full object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/imagem_pet_sem_foto.png';
                        }}
                    />

                    <figcaption className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <header className="p-8 text-white w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{selectedPet.nome}</h1>
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
                                <p className="font-semibold">{selectedPet.idade} anos</p>
                            </div>
                        </div>


                        <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                            <PawPrint className="h-6 w-6" />
                            <div>
                                <p className="text-xs opacity-70">Raça</p>
                                <p className="font-semibold">{selectedPet.raca}</p>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Sobre</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {selectedPet.nome} é um {selectedPet.raca} muito dócil e brincalhão. Está com {selectedPet.idade} anos de idade e adora passear.
                            </p>
                        </section>

                        {selectedPet.tutores && selectedPet.tutores.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tutores Responsáveis</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedPet.tutores.map((tutor) => (
                                        <li key={tutor.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-gray-50 dark:bg-gray-800/50">
                                            <figure className="h-14 w-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-700">
                                                {tutor.foto ? (
                                                    <img src={tutor.foto.url} alt={tutor.nome} className="h-full w-full object-contain" />
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
