import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Save, Plus, Trash2, PawPrint, Dog } from 'lucide-react';
import { useTutor, useUpdateTutor, useAddPet, useRemovePet } from '../../hooks/queries/useTutor';
import { usePets } from '../../hooks/queries/usePet';
import { TutorService } from '../../services/api/tutors_service';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import { validarEmail } from '../../utils/validarEmail';
import { validarCpf } from '../../utils/validarCpf';
import { formatCPF } from '../../utils/formatCPF';
import { formatTelefone } from '../../utils/formatTelefone';
import { useForm } from 'react-hook-form';

interface TutorFormData {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    endereco: string;
    foto: File | null | { url: string; id?: number };
}

export default function TutorEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const numericId = id ? Number(id) : undefined;

    const { data: selectedTutor, isLoading: loadingDetails, error: loadError } = useTutor(numericId);
    const { mutateAsync: updateTutor, isPending: isUpdating, error: updateError } = useUpdateTutor();
    const { mutateAsync: addPet, isPending: isAdding } = useAddPet();
    const { mutateAsync: removePet, isPending: isRemoving } = useRemovePet();
    const [isSaving, setIsSaving] = useState(false);

    const { data: petsData } = usePets(1, '');

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        watch
    } = useForm<TutorFormData>({
        defaultValues: {
            nome: '',
            email: '',
            cpf: '',
            telefone: '',
            endereco: '',
            foto: null,
        }
    });

    const currentFoto = watch('foto');
    const [selectedPetId, setSelectedPetId] = useState<string>('');

    useEffect(() => {
        if (selectedTutor) {
            reset({
                nome: selectedTutor.nome,
                email: selectedTutor.email || '',
                cpf: formatCPF(selectedTutor.cpf || ''),
                telefone: formatTelefone(selectedTutor.telefone || ''),
                endereco: selectedTutor.endereco || '',
                foto: selectedTutor.foto ? { url: selectedTutor.foto.url, id: selectedTutor.foto.id } : null,
            });
        }
    }, [selectedTutor, reset]);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('cpf', formatCPF(e.target.value));
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('telefone', formatTelefone(e.target.value));
    };

    const handlePhotoSelect = (file: File | null) => {
        setValue('foto', file);
    };

    const handlePhotoDelete = async () => {
        if (!id) return;
        const photoId = (selectedTutor?.foto as any)?.id;
        if (!photoId) return;

        try {
            if (confirm('Tem certeza que deseja remover a foto deste tutor?')) {
                await TutorService.deleteTutorPhoto(Number(id), photoId);
                setValue('foto', null);
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Erro ao deletar foto');
        }
    };

    const onSubmit = async (data: TutorFormData) => {
        if (!id) return;

        try {
            const cleanCPF = data.cpf ? String(data.cpf).replace(/\D/g, '') : '';
            const cleanTelefone = data.telefone ? String(data.telefone).replace(/\D/g, '') : '';

            setIsSaving(true);
            await updateTutor({
                id: Number(id),
                data: {
                    id: Number(id),
                    nome: data.nome,
                    email: data.email,
                    cpf: cleanCPF,
                    telefone: cleanTelefone,
                    endereco: data.endereco,
                    foto: data.foto instanceof File ? data.foto : undefined
                }
            });

            navigate('/tutors');
        } catch (err: any) {
            console.error('Error updating tutor:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLinkPet = async () => {
        if (!id || !selectedPetId) return;

        try {
            await addPet({ tutorId: Number(id), petId: Number(selectedPetId) });
            setSelectedPetId('');
        } catch (err) {
            console.error('Error linking pet:', err);
        }
    };

    const handleUnlinkPet = async (petId: number) => {
        if (!id) return;
        if (!confirm('Desvincular este pet?')) return;

        try {
            await removePet({ tutorId: Number(id), petId });
        } catch (err) {
            console.error('Error unlinking pet:', err);
        }
    };

    const loading = loadingDetails || isUpdating || isSaving;

    if (loadingDetails) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <main className="max-w-2xl mx-auto space-y-6 animate-fade-in relative">
            <div className="absolute -top-20 -left-20 opacity-10 dark:opacity-5 animate-float pointer-events-none">
                <PawPrint className="w-32 h-32 text-orange-600" />
            </div>
            <div className="absolute -bottom-20 -right-20 opacity-10 dark:opacity-5 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
                <PawPrint className="w-40 h-40 text-cyan-600" />
            </div>

            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all font-medium group relative z-10"
                disabled={loading}
            >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar
            </button>

            <article className="glass rounded-2xl shadow-xl border-2 border-orange-200 dark:border-orange-900 p-8 relative z-10">
                <header className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-orange-200 to-cyan-200 dark:from-orange-900 dark:to-cyan-900">
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Editar Tutor</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Atualize as informações do tutor e gerencie pets 🐾</p>
                    </div>
                </header>

                {(updateError || loadError) && (
                    <div role="alert" className="mb-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl animate-fade-in">
                        {(updateError as any)?.message || (loadError as any)?.message || 'Erro ao processar solicitação'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <PhotoUpload
                            onPhotoSelect={handlePhotoSelect}
                            currentPhotoUrl={(currentFoto as any)?.url}
                            onPhotoDelete={(currentFoto as any)?.url ? handlePhotoDelete : undefined}
                            label="Foto do Tutor"
                        />
                    </div>

                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome do Tutor *
                            </label>
                            <input
                                type="text"
                                id="nome"
                                {...register('nome', { required: 'Nome é obrigatório', maxLength: 100 })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="Ex: João da Silva"
                            />
                            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register('email', {
                                    required: 'Email é obrigatório',
                                    validate: v => validarEmail(v) || 'Email inválido'
                                })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="joao@example.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                CPF *
                            </label>
                            <input
                                type="text"
                                id="cpf"
                                {...register('cpf', {
                                    required: 'CPF é obrigatório',
                                    validate: v => validarCpf(v) || 'CPF inválido',
                                    onChange: handleCpfChange
                                })}
                                maxLength={14}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cpf ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="000.000.000-00"
                            />
                            {errors.cpf && <p className="mt-1 text-xs text-red-500">{errors.cpf.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Telefone *
                            </label>
                            <input
                                type="text"
                                id="telefone"
                                {...register('telefone', {
                                    required: 'Telefone é obrigatório',
                                    onChange: handleTelefoneChange
                                })}
                                maxLength={15}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.telefone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="(00) 00000-0000"
                            />
                            {errors.telefone && <p className="mt-1 text-xs text-red-500">{errors.telefone.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Endereço *
                            </label>
                            <input
                                type="text"
                                id="endereco"
                                {...register('endereco', { required: 'Endereço é obrigatório', maxLength: 250 })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.endereco ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="Rua Exemplo, 123"
                            />
                            {errors.endereco && <p className="mt-1 text-xs text-red-500">{errors.endereco.message}</p>}
                        </div>
                    </fieldset>

                    <section className="border-t-2 border-orange-100 dark:border-orange-900 pt-6 mt-6">
                        <header className="flex items-center gap-2 mb-4">
                            <PawPrint className="h-5 w-5 text-orange-500" />
                            <h2 className="text-xl font-bold gradient-text">Pets Vinculados</h2>
                        </header>

                        <div className="flex gap-2 mb-6">
                            <select
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                value={selectedPetId}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                                disabled={loading || isAdding}
                            >
                                <option value="">Vincular novo pet...</option>
                                {petsData?.items?.filter(p => !selectedTutor?.pets.some((sp: any) => sp.id === p.id)).map((pet: any) => (
                                    <option key={pet.id} value={pet.id}>{pet.name} (ID: {pet.id})</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleLinkPet}
                                disabled={!selectedPetId || isAdding || loading}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {isAdding ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5 mr-1" />
                                        Vincular
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedTutor?.pets && selectedTutor.pets.length > 0 ? (
                                selectedTutor.pets.map((pet: any) => (
                                    <div key={pet.id} className="flex justify-between items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-100 dark:border-gray-700 animate-fade-in group hover:border-orange-200 dark:hover:border-orange-900 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-cyan-100 dark:from-orange-900/40 dark:to-cyan-900/40 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                                                {pet.foto?.url ? (
                                                    <img src={pet.foto.url} alt={pet.nome} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Dog className="h-6 w-6 text-orange-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-100">{pet.nome}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{pet.raca}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleUnlinkPet(pet.id)}
                                            disabled={isRemoving}
                                            className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                            title="Desvincular Pet"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="sm:col-span-2 text-center py-8 bg-gray-50 dark:bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <PawPrint className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm font-medium">Nenhum pet vinculado a este tutor.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <footer className="flex justify-center md:justify-end pt-8 border-t-2 border-orange-100 dark:border-orange-900">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-10 py-4 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5 mr-2" />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </article>
        </main>
    );
}
