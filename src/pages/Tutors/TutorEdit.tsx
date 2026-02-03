import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Dog, Save, Plus, Trash2 } from 'lucide-react';
import { useTutor, useUpdateTutor, useAddPet, useRemovePet } from '../../hooks/queries/useTutor';
import { usePets } from '../../hooks/queries/usePet';
import { TutorService } from '../../services/api/tutors_service';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import { formatCPF, formatTelefone } from '../../utils/formatters';

export default function TutorEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const numericId = id ? Number(id) : undefined;

    const { data: selectedTutor, isLoading: loadingDetails, error: loadError } = useTutor(numericId);
    const { mutateAsync: updateTutor, isPending: isUpdating, error: updateError } = useUpdateTutor();
    const { mutateAsync: addPet, isPending: isAdding } = useAddPet();
    const { mutateAsync: removePet, isPending: isRemoving } = useRemovePet();

    const { data: petsData } = usePets(1, '');

    const [formData, setFormData] = useState<{
        nome: string;
        email: string;
        cpf: string;
        telefone: string;
        endereco: string;
        foto: File | null | { url: string; id?: number };
    }>({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        endereco: '',
        foto: null,
    });

    const [selectedPetId, setSelectedPetId] = useState<string>('');

    useEffect(() => {
        if (selectedTutor) {
            const cpfValue = selectedTutor.cpf ? String(selectedTutor.cpf) : '';
            const telefoneValue = selectedTutor.telefone ? String(selectedTutor.telefone) : '';

            setFormData({
                nome: selectedTutor.nome,
                email: selectedTutor.email || '',
                cpf: formatCPF(cpfValue),
                telefone: formatTelefone(telefoneValue),
                endereco: selectedTutor.endereco || '',
                foto: selectedTutor.foto ? { url: selectedTutor.foto.url } : null,
            });
        }
    }, [selectedTutor]);

    const handlePhotoSelect = (file: File | null) => {
        setFormData(prev => ({ ...prev, foto: file }));
    };

    const handlePhotoDelete = async () => {
        if (!id) return;
        const photoId = (selectedTutor?.foto as any)?.id;
        if (!photoId) return;

        try {
            if (confirm('Tem certeza que deseja remover a foto deste tutor?')) {
                await TutorService.deleteTutorPhoto(Number(id), photoId);
                setFormData(prev => ({ ...prev, foto: null }));
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Erro ao deletar foto');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cpf') {
            formattedValue = formatCPF(value);
        } else if (name === 'telefone') {
            formattedValue = formatTelefone(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            const cleanCPF = formData.cpf ? String(formData.cpf).replace(/\D/g, '') : '';
            const cleanTelefone = formData.telefone ? String(formData.telefone).replace(/\D/g, '') : '';

            await updateTutor({
                id: Number(id),
                data: {
                    id: Number(id),
                    nome: formData.nome,
                    email: formData.email,
                    cpf: cleanCPF,
                    telefone: cleanTelefone,
                    endereco: formData.endereco,
                    foto: formData.foto instanceof File ? formData.foto : undefined
                }
            });

            navigate('/tutors');
        } catch (err: any) {
            console.error('Error updating tutor:', err);
        }
    };

    const handleLinkPet = async () => {
        if (!id || !selectedPetId) return;

        try {
            await addPet({ tutorId: Number(id), petId: Number(selectedPetId) });
            setSelectedPetId('');
            alert('Pet vinculado com sucesso!');
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Editar Tutor</h1>
                        <p className="text-gray-500 dark:text-gray-400">Atualize as informações do tutor e gerencie pets</p>
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
                            label="Foto do Tutor"
                        />
                    </div>
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome do Tutor *
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

                        <div className=" md:col-span-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isUpdating}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <div className=" md:col-span-1">
                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                CPF *
                            </label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                required
                                maxLength={14}
                                disabled={isUpdating}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Telefone *
                            </label>
                            <input
                                type="text"
                                id="telefone"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                required
                                maxLength={15}
                                disabled={isUpdating}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Endereço *
                            </label>
                            <input
                                type="text"
                                id="endereco"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                required
                                disabled={isUpdating}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                    </fieldset>

                    <section className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pets Vinculados</h2>

                        <div className="flex gap-2 mb-4">
                            <select
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                value={selectedPetId}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                                disabled={isUpdating || isAdding}
                            >
                                <option value="">Selecione um Pet para vincular...</option>
                                {petsData?.items?.map((pet: any) => (
                                    <option key={pet.id} value={pet.id}>{pet.name} (ID: {pet.id})</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleLinkPet}
                                disabled={!selectedPetId || isAdding || isUpdating}
                                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isAdding ? 'Vinculando...' : 'Vincular'}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {selectedTutor?.pets && selectedTutor.pets.length > 0 ? (
                                selectedTutor.pets.map((pet: any) => (
                                    <div key={pet.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700">
                                                {pet.foto?.url ? (
                                                    <img src={pet.foto.url} alt={pet.nome} className="h-full w-full object-contain" />
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <Dog className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{pet.nome}</p>
                                                <p className="text-xs text-gray-500">{pet.raca}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleUnlinkPet(pet.id)}
                                            disabled={isRemoving}
                                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                            title="Desvincular Pet"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum pet vinculado.</p>
                            )}
                        </div>
                    </section>

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
