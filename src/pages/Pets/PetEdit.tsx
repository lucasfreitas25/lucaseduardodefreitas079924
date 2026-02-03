import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Dog, Save } from 'lucide-react';
import { usePet, useUpdatePet } from '../../hooks/queries/usePet';
import { petsService } from '../../services/api/pets_service';
import { PhotoUpload } from '../../components/Common/PhotoUpload';

export default function PetEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const numericId = id ? Number(id) : undefined;
    const { data: selectedPet, isLoading: loadingDetails, error: loadError } = usePet(numericId);
    const { mutateAsync: updatePet, isPending: isUpdating, error: updateError } = useUpdatePet();

    const [formData, setFormData] = useState<{
        nome: string;
        raca: string;
        idade: string;
        foto: File | null | { url: string; id?: number };
    }>({
        nome: '',
        raca: '',
        idade: '',
        foto: null,
    });

    useEffect(() => {
        if (selectedPet) {
            setFormData({
                nome: selectedPet.nome,
                raca: selectedPet.raca,
                idade: String(selectedPet.idade),
                foto: selectedPet.foto || null,
            });
        }
    }, [selectedPet]);

    const handlePhotoSelect = (file: File | null) => {
        setFormData(prev => ({ ...prev, foto: file }));
    };

    const handlePhotoDelete = async () => {
        if (!id) return;

        const photoId = (selectedPet?.foto as any)?.id;
        if (!photoId) return;

        try {
            if (confirm('Tem certeza que deseja remover a foto deste pet?')) {
                await petsService.deletePetPhoto(Number(id), photoId);
                setFormData(prev => ({ ...prev, foto: null }));
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Erro ao deletar foto');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            await updatePet({
                id: Number(id),
                data: {
                    id: Number(id),
                    nome: formData.nome,
                    raca: formData.raca,
                    idade: Number(formData.idade),
                    foto: formData.foto instanceof File ? formData.foto : undefined
                }
            });

            navigate('/pets');
        } catch (err: any) {
            console.error('Error updating pet:', err);
        }
    };

    if (loadingDetails) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <main className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                disabled={isUpdating}
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
            </button>

            <article className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                <header className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Dog className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar Pet</h1>
                        <p className="text-gray-500 dark:text-gray-400">Atualize as informações do animal</p>
                    </div>
                </header>

                {(updateError || loadError) && (
                    <div role="alert" className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                        {(updateError as any)?.message || (loadError as any)?.message || 'Erro ao processar solicitação'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="flex justify-center mb-8">
                        <PhotoUpload
                            onPhotoSelect={handlePhotoSelect}
                            currentPhotoUrl={(formData.foto as any)?.url}
                            onPhotoDelete={(formData.foto as any)?.url ? handlePhotoDelete : undefined}
                            label="Foto do Pet"
                        />
                    </div>
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome do Pet *
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                disabled={isUpdating}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="raca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Raça *
                            </label>
                            <input
                                type="text"
                                id="raca"
                                name="raca"
                                value={formData.raca}
                                onChange={handleChange}
                                required
                                disabled={isUpdating}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="idade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Idade (anos) *
                            </label>
                            <input
                                type="number"
                                id="idade"
                                name="idade"
                                value={formData.idade}
                                onChange={handleChange}
                                required
                                min="0"
                                disabled={isUpdating}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                    </fieldset>

                    <footer className="flex justify-center md:justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    {formData.foto instanceof File ? 'Enviando Foto...' : 'Salvando...'}
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
