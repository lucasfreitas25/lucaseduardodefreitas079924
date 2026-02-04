import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dog, Save } from 'lucide-react';
import { useCreatePet } from '../../hooks/queries/usePet';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import { useForm } from 'react-hook-form';

interface PetFormData {
    nome: string;
    raca: string;
    idade: string;
    foto: File | null;
}

export default function PetAdd() {
    const navigate = useNavigate();
    const { mutateAsync: createPet, isPending, error: mutationError } = useCreatePet();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<PetFormData>({
        defaultValues: {
            nome: '',
            raca: '',
            idade: '',
            foto: null
        }
    });

    const loading = isPending || isSaving;

    const handlePhotoSelect = (file: File | null) => {
        setValue('foto', file);
    };

    const onSubmit = async (data: PetFormData) => {
        try {
            setIsSaving(true);
            await createPet({
                nome: data.nome,
                raca: data.raca,
                idade: Number(data.idade),
                foto: data.foto || undefined
            } as any);

            navigate('/pets');
        } catch (err: any) {
            console.error('Error creating pet:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all font-medium group"
                disabled={loading}
            >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar
            </button>

            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <header className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-orange-200 to-cyan-200 dark:from-orange-900 dark:to-cyan-900">
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                        <Dog className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 dark:from-orange-400 dark:to-cyan-400 bg-clip-text text-transparent">Adicionar Novo Pet</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Preencha as informações do animal 🐾</p>
                    </div>
                </header>

                {(mutationError) && (
                    <div role="alert" className="mb-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl animate-fade-in">
                        {(mutationError as any)?.message || 'Erro ao criar pet'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <PhotoUpload
                            onPhotoSelect={handlePhotoSelect}
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

                    <footer className="flex justify-center md:justify-end pt-6 border-t-2 border-gray-200 dark:border-gray-700">
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
                                    Salvar Pet
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </article>
        </main>
    );
}
