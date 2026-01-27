import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Dog, Save, Plus, Trash2 } from 'lucide-react';
import { TutorService } from '../../services/api/tutors_service';
import { petsService } from '../../services/api/pets_service';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import type { PetDTO } from '../../types/dtos';

export default function TutorEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    // Pet Linking State
    const [linkedPets, setLinkedPets] = useState<PetDTO[]>([]);
    const [availablePets, setAvailablePets] = useState<PetDTO[]>([]); // For selection
    const [selectedPetId, setSelectedPetId] = useState<string>('');
    const [linkingPet, setLinkingPet] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTutor(Number(id));
            fetchAvailablePets();
        }
    }, [id]);

    const fetchTutor = async (tutorId: number) => {
        try {
            const data = await TutorService.getTutorById(tutorId);

            // Convert to string and format CPF and telefone
            const cpfValue = data.cpf ? String(data.cpf) : '';
            const telefoneValue = data.telefone ? String(data.telefone) : '';

            setFormData({
                nome: data.nome,
                email: data.email || '',
                cpf: formatCPF(cpfValue),
                telefone: formatTelefone(telefoneValue),
                endereco: data.endereco,
                foto: data.foto || null,
            });
            setLinkedPets(data.pets || []);
        } catch (err: any) {
            console.error('Error fetching tutor:', err);
            setError('Erro ao carregar dados do tutor.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailablePets = async () => {
        try {
            // Fetching page 1 with larger limit to get a list for selection
            // Ideal solution would be a searchable dropdown
            const response = await petsService.getPets({ limit: 100 });
            setAvailablePets(response.items as unknown as PetDTO[]); // Type cast if needed depending on Service return type mapping
            // Note: petsService.getPets returns Domain Pet objects, mapped from DTO. 
            // We might need raw DTOs or map back. 
            // Let's assume for simple ID/Name selection, Domain objects are fine if we map them.
            // Actually petsService.getPets returns { items: Pet[] ... }
            // Let's check Pet type. It has id and name. Good enough.
        } catch (err) {
            console.error("Error fetching pets for linking", err);
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
            if (confirm('Tem certeza que deseja remover a foto deste tutor?')) {
                await TutorService.deleteTutorPhoto(Number(id), photoId);
                setFormData(prev => ({ ...prev, foto: null }));
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
            alert('Erro ao deletar foto');
        }
    };

    // Função para formatar CPF
    const formatCPF = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return value.slice(0, 14); // Limita ao tamanho máximo formatado
    };

    // Função para formatar telefone
    const formatTelefone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        }
        return value.slice(0, 15); // Limita ao tamanho máximo formatado
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;

        // Aplica máscara conforme o campo
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

        setSaving(true);
        setError(null);

        try {
            // Remove CPF and telefone formatting before sending
            // Ensure they are strings first
            const cleanCPF = formData.cpf ? String(formData.cpf).replace(/\D/g, '') : '';
            const cleanTelefone = formData.telefone ? String(formData.telefone).replace(/\D/g, '') : '';

            const tutorData: any = {
                nome: formData.nome,
                email: formData.email,
                cpf: cleanCPF,
                telefone: cleanTelefone,
                endereco: formData.endereco,
                // DO NOT send foto field - it's handled separately via upload endpoint
            };

            await TutorService.updateTutor(Number(id), tutorData);

            // Upload photo separately if user selected a new one
            if (formData.foto instanceof File) {
                await TutorService.uploadTutorPhoto(Number(id), formData.foto);
            }

            navigate('/tutors');
        } catch (err: any) {
            console.error('Error updating tutor:', err);
            setError(err.message || 'Erro ao atualizar tutor. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleLinkPet = async () => {
        if (!id || !selectedPetId) return;
        setLinkingPet(true);
        try {
            await TutorService.addPet(Number(id), Number(selectedPetId));
            // Refresh tutor data to show linked pet
            await fetchTutor(Number(id));
            setSelectedPetId('');
            alert('Pet vinculado com sucesso!');
        } catch (err) {
            console.error('Error linking pet:', err);
            alert('Erro ao vincular pet.');
        } finally {
            setLinkingPet(false);
        }
    };

    const handleUnlinkPet = async (petId: number) => {
        if (!id) return;
        if (!confirm('Desvincular este pet?')) return;

        try {
            await TutorService.removePet(Number(id), petId);
            setLinkedPets(prev => prev.filter(p => p.id !== petId));
        } catch (err) {
            console.error('Error unlinking pet:', err);
            alert('Erro ao desvincular pet.');
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
        <main className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/tutors')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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

                {error && (
                    <div role="alert" className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                        {error}
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
                        <div className="col-span-2">
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </fieldset>

                    {/* Pet Linking Section */}
                    <section className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pets Vinculados</h2>

                        <div className="flex gap-2 mb-4">
                            <select
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                value={selectedPetId}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                            >
                                <option value="">Selecione um Pet para vincular...</option>
                                {availablePets.map((pet: any) => (
                                    <option key={pet.id} value={pet.id}>{pet.name} (ID: {pet.id})</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleLinkPet}
                                disabled={!selectedPetId || linkingPet}
                                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Vincular
                            </button>
                        </div>

                        <div className="space-y-2">
                            {linkedPets.length === 0 ? (
                                <p className="text-gray-500 text-sm">Nenhum pet vinculado.</p>
                            ) : (
                                linkedPets.map(pet => (
                                    <div key={pet.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3">
                                            {pet.foto?.url ? (
                                                <img src={pet.foto.url} alt={pet.nome} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                    <Dog className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{pet.nome}</p>
                                                <p className="text-xs text-gray-500">{pet.raca}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleUnlinkPet(pet.id)}
                                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Desvincular Pet"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <footer className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
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
                    </footer>
                </form>
            </article>
        </main>
    );
}
