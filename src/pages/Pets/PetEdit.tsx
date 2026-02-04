import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Dog, Save, PawPrint } from 'lucide-react';
import { usePet, useUpdatePet } from '../../hooks/queries/usePet';
import { petsService } from '../../services/api/pets_service';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import { useForm } from 'react-hook-form';

interface PetFormData {
    nome: string;
    raca: string;
    idade: string;
    foto: File | null | { url: string; id?: number };
}

export default function PetEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const petId = id ? Number(id) : undefined;
    const { data: selectedPet, isLoading: loadingDetails, error: loadError } = usePet(petId);
    const { mutateAsync: updatePet, isPending: isUpdating, error: updateError } = useUpdatePet();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        watch
    } = useForm<PetFormData>({
        defaultValues: {
            nome: '',
            raca: '',
            idade: '',
            foto: null
        }
    });

    const currentFoto = watch('foto');

    useEffect(() => {
        if (selectedPet) {
            reset({
                nome: selectedPet.nome,
                raca: selectedPet.raca,
                idade: String(selectedPet.idade),
                foto: selectedPet.foto || null,
            });
        }
    }, [selectedPet, reset]);

    const handlePhotoSelect = (file: File | null) => {
        setValue('foto', file);
    };

    const handlePhotoDelete = async () => {
        if (!id) return;

        const photoId = (selectedPet?.foto as any)?.id;
        if (!photoId) return;

        try {
            if (confirm('Tem certeza que deseja remover a foto deste pet?')) {
                await petsService.deletePetPhoto(Number(id), photoId);
                setValue('foto', null);
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Erro ao deletar foto');
        }
    };

    const onSubmit = async (data: PetFormData) => {
        if (!id) return;

        try {
            setIsSaving(true);
            await updatePet({
                id: Number(id),
                data: {
                    id: Number(id),
                    nome: data.nome,
                    raca: data.raca,
                    idade: Number(data.idade),
                    foto: data.foto instanceof File ? data.foto : undefined
                }
            });

            navigate('/pets');
        } catch (err: any) {
            console.error('Error updating pet:', err);
        } finally {
            setIsSaving(false);
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
                        <Dog className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Editar Pet</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Atualize as informações do animal 🐾</p>
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
                            label="Foto do Pet"
                        />
                    </div>

                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome do Pet *
                            </label>
                            <input
                                type="text"
                                id="nome"
                                {...register('nome', { required: 'Nome é obrigatório', maxLength: 50 })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="Ex: Rex"
                            />
                            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="raca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Raça *
                            </label>
                            <input
                                type="text"
                                id="raca"
                                {...register('raca', { required: 'Raça é obrigatória', maxLength: 30 })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.raca ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="Ex: Golden Retriever"
                            />
                            {errors.raca && <p className="mt-1 text-xs text-red-500">{errors.raca.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="idade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Idade (anos) *
                            </label>
                            <input
                                type="number"
                                id="idade"
                                {...register('idade', { required: 'Idade é obrigatória', min: { value: 0, message: 'Idade não pode ser negativa' } })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.idade ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="Ex: 3"
                            />
                            {errors.idade && <p className="mt-1 text-xs text-red-500">{errors.idade.message}</p>}
                        </div>
                    </fieldset>

                    <footer className="flex justify-center md:justify-end pt-6 border-t-2 border-orange-100 dark:border-orange-900">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-8 py-3.5 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
