import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Dog, Save } from 'lucide-react';
import { petsService } from '../../services/api/pets_service';
import { PhotoUpload } from '../../components/Common/PhotoUpload';

export default function PetEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        if (id) {
            fetchPet(Number(id));
        }
    }, [id]);

    const fetchPet = async (petId: number) => {
        try {
            const data = await petsService.getPetById(petId);
            setFormData({
                nome: data.nome,
                raca: data.raca,
                idade: String(data.idade),
                foto: data.foto || null,
            });
        } catch (err: any) {
            console.error('Error fetching pet:', err);
            setError('Erro ao carregar dados do pet.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoSelect = (file: File | null) => {
        setFormData(prev => ({ ...prev, foto: file }));
    };

    const handlePhotoDelete = async () => {
        if (!id) return;

        // Check if we have a persisted photo with an ID
        const photoId = (formData.foto as any)?.id;
        if (!photoId) return;

        try {
            if (confirm('Tem certeza que deseja remover a foto deste pet?')) {
                await petsService.deletePetPhoto(Number(id), photoId);
                setFormData(prev => ({ ...prev, foto: null }));
                // Optionally refresh pet data or just rely on state
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Erro ao deletar foto');
            // Revert preview if needed
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSaving(true);
        setError(null);

        try {
            const petData: any = {
                nome: formData.nome,
                raca: formData.raca,
                idade: Number(formData.idade),
                foto: formData.foto,
                // Add other fields as needed/supported by API
            };

            await petsService.updatePet(Number(id), petData);

            if (formData.foto instanceof File) {
                await petsService.uploadPetPhoto(Number(id), formData.foto);
            }

            navigate('/pets');
        } catch (err: any) {
            console.error('Error updating pet:', err);
            setError(err.message || 'Erro ao atualizar pet. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/pets')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
            </button>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Dog className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar Pet</h1>
                        <p className="text-gray-500 dark:text-gray-400">Atualize as informações do animal</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                        {error}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
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
                    </div>
                </form>
            </div>
        </div>
    );
}
