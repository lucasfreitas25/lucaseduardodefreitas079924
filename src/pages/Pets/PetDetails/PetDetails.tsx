import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, PawPrint, Dog, Mail, Phone, Info } from 'lucide-react';
import { usePet } from '../../../hooks/queries/usePet';
import { BackButton } from '../../../components/UI/BackButton';
import { FormCard } from '../../../components/UI/FormCard';

export default function PetDetails() {
    const { id } = useParams<{ id: string }>();

    const petId = id ? Number(id) : undefined;
    const { data: selectedPet, isLoading, error } = usePet(petId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error || !selectedPet) {
        return (
            <section className="text-center py-12 animate-fade-in">
                <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border-2 border-red-100 dark:border-red-900/30 inline-block">
                    <p className="text-red-600 dark:text-red-400 mb-6 font-medium text-lg">
                        {error ? 'Erro ao carregar detalhes' : 'Pet não encontrado'}
                    </p>
                    <Link to="/pets" className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:orange-700 font-bold transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        Voltar para lista
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <main className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <BackButton to="/pets" />

            <FormCard className="p-0 overflow-hidden">
                <figure className="relative h-64 sm:h-96 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30 dark:opacity-40"
                        style={{ backgroundImage: `url(${selectedPet.foto?.url || '/assets/imagem_pet_sem_foto.png'})` }}
                    />

                    <img
                        src={selectedPet.foto?.url || '/assets/imagem_pet_sem_foto.png'}
                        alt={selectedPet.nome}
                        className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/imagem_pet_sem_foto.png';
                        }}
                    />

                    <figcaption className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <header className="p-8 text-white w-full">
                            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{selectedPet.nome}</h1>
                        </header>
                    </figcaption>
                </figure>

                <section className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-center sm:text-left">
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-900/30 transition-all hover:shadow-md">
                            <div className="h-12 w-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider font-bold opacity-70">Idade</p>
                                <p className="text-xl font-black">{selectedPet.idade} anos</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900/30 transition-all hover:shadow-md">
                            <div className="h-12 w-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                <PawPrint className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider font-bold opacity-70">Raça</p>
                                <p className="text-xl font-black">{selectedPet.raca}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <section>
                            <header className="flex items-center gap-2 mb-4">
                                <Info className="h-5 w-5 text-orange-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Sobre {selectedPet.nome}</h2>
                            </header>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                {selectedPet.nome} é um(a) {selectedPet.raca} encantador(a). Está com {selectedPet.idade} {selectedPet.idade === 1 ? 'ano' : 'anos'} de idade e traz muita alegria para todos ao seu redor.
                            </p>
                        </section>

                        {selectedPet.tutores && selectedPet.tutores.length > 0 && (
                            <section>
                                <header className="flex items-center gap-2 mb-6">
                                    <Dog className="h-5 w-5 text-cyan-500" />
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Tutores Responsáveis</h2>
                                </header>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedPet.tutores.map((tutor) => (
                                        <li key={tutor.id} className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900 transition-all bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-xl group">
                                            <figure className="h-16 w-16 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white dark:border-gray-600 shadow-inner transition-transform group-hover:scale-110">
                                                {tutor.foto ? (
                                                    <img src={tutor.foto.url} alt={tutor.nome} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-orange-600 dark:text-orange-400 font-black text-2xl">
                                                        {tutor.nome.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </figure>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                    {tutor.nome}
                                                </h3>
                                                <div className="mt-1 space-y-1">
                                                    <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                                        <Phone className="h-3.5 w-3.5 text-cyan-500" />
                                                        <span className="truncate">{tutor.telefone}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                                        <Mail className="h-3.5 w-3.5 text-cyan-500" />
                                                        <span className="truncate">{tutor.email}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </section>
            </FormCard>
        </main>
    );
}
