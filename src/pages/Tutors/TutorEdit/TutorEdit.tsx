import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, Plus, Trash2, LayoutGrid, Dog } from 'lucide-react';
import { useTutor, useUpdateTutor, useAddPet, useRemovePet } from '../../../hooks/queries/useTutor';
import { usePets } from '../../../hooks/queries/usePet';
import { TutorService } from '../../../services/api/tutors_service';
import { PhotoUpload } from '../../../components/Common/PhotoUpload';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../../components/UI/FormInput';
import { FormSelect } from '../../../components/UI/FormSelect';
import { ErrorMessage } from '../../../components/UI/ErrorMessage';
import { formatCPF } from '../../../utils/formatCPF';
import { formatTelefone } from '../../../utils/formatTelefone';
import { validarCpf } from '../../../utils/validarCpf';
import { FormCard } from '../../../components/UI/FormCard';
import { FormSection } from '../../../components/UI/FormSection';
import { BackButton } from '../../../components/UI/BackButton';
import { ButtonFooter } from '../../../components/UI/Footer';

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
    const location = useLocation();
    const numericId = id ? Number(id) : undefined;

    const { data: selectedTutor, isLoading: loadingDetails, error: loadError } = useTutor(numericId);
    const { mutateAsync: updateTutor, isPending: isUpdating, error: updateError } = useUpdateTutor();
    const { mutateAsync: addPet, isPending: isAdding } = useAddPet();
    const { mutateAsync: removePet, isPending: isRemoving } = useRemovePet();
    const [isSaving, setIsSaving] = useState(false);

    const { data: petsData } = usePets(1, '', 100);

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
        }
    };

    const onSubmit = async (data: TutorFormData) => {
        if (!id) return;

        try {
            const cleanCPF = data.cpf.replace(/\D/g, '');
            const cleanTelefone = data.telefone.replace(/\D/g, '');

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

            navigate(location.state?.from || '/tutors');
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

    const availablePets = petsData?.items?.filter(p => !selectedTutor?.pets.some((sp: any) => sp.id === p.id)) || [];

    return (
        <main className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <BackButton disabled={loading} />

            <FormCard>
                <header className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-orange-200 to-cyan-200 dark:from-orange-900 dark:to-cyan-900">
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                        <Save className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 dark:from-orange-400 dark:to-cyan-400 bg-clip-text text-transparent">
                            Editar Tutor
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Atualize as informações do tutor e gerencie pets 🐾</p>
                    </div>
                </header>

                <ErrorMessage message={(updateError as any)?.message || (loadError as any)?.message || ''} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <section className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <PhotoUpload
                                onPhotoSelect={handlePhotoSelect}
                                currentPhotoUrl={(currentFoto as any)?.url}
                                onPhotoDelete={(currentFoto as any)?.url ? handlePhotoDelete : undefined}
                                label="Foto do Tutor"
                            />
                        </div>

                        <fieldset className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                id="nome"
                                label="Nome Completo *"
                                placeholder="Ex: João Silva"
                                disabled={loading}
                                error={errors.nome?.message}
                                {...register('nome', { required: 'Nome é obrigatório' })}
                                containerClassName="md:col-span-2"
                            />

                            <FormInput
                                id="email"
                                label="E-mail *"
                                type="email"
                                placeholder="joao@exemplo.com"
                                disabled={loading}
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'E-mail é obrigatório',
                                    pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' }
                                })}
                            />

                            <FormInput
                                id="cpf"
                                label="CPF *"
                                placeholder="000.000.000-00"
                                disabled={loading}
                                error={errors.cpf?.message}
                                {...register('cpf', {
                                    required: 'CPF é obrigatório',
                                    validate: (value) => validarCpf(value) || 'CPF inválido',
                                    onChange: (e) => setValue('cpf', formatCPF(e.target.value))
                                })}
                            />

                            <FormInput
                                id="telefone"
                                label="Telefone *"
                                placeholder="(00) 00000-0000"
                                disabled={loading}
                                error={errors.telefone?.message}
                                {...register('telefone', {
                                    required: 'Telefone é obrigatório',
                                    onChange: (e) => setValue('telefone', formatTelefone(e.target.value))
                                })}
                            />

                            <FormInput
                                id="endereco"
                                label="Endereço Completo *"
                                placeholder="Rua, Número, Bairro, Cidade - UF"
                                disabled={loading}
                                error={errors.endereco?.message}
                                {...register('endereco', { required: 'Endereço é obrigatório' })}
                                containerClassName="md:col-span-2"
                            />
                        </fieldset>
                    </section>

                    <FormSection title="Vincular Novo Pet" icon={LayoutGrid}>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <FormSelect
                                id="pet-link-select"
                                label="Selecione um pet para vincular"
                                value={selectedPetId}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                                disabled={loading || isAdding || availablePets.length === 0}
                                containerClassName="flex-1"
                            >
                                <option value="">{availablePets.length === 0 ? 'Nenhum pet disponível' : 'Selecione um pet...'}</option>
                                {availablePets.map((pet: any) => (
                                    <option key={pet.id} value={pet.id}>{pet.name} (ID: {pet.id})</option>
                                ))}
                            </FormSelect>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={handleLinkPet}
                                    disabled={!selectedPetId || isAdding || loading}
                                    className="h-[50px] flex items-center justify-center px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {isAdding ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Plus className="h-5 w-5 mr-2" />
                                            Vincular
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Pets Vinculados" icon={Dog}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedTutor?.pets && selectedTutor.pets.length > 0 ? (
                                selectedTutor.pets.map((pet: any) => (
                                    <div key={pet.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border-2 border-gray-100 dark:border-gray-800 animate-fade-in group hover:border-orange-200 dark:hover:border-orange-900 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm transition-transform group-hover:scale-105">
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
                                            className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                            title="Desvincular Pet"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="sm:col-span-2 text-center py-10 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <Dog className="h-10 w-10 text-gray-300 mx-auto mb-2 opacity-50" />
                                    <p className="text-gray-500 text-sm font-medium">Nenhum pet vinculado a este tutor.</p>
                                </div>
                            )}
                        </div>
                    </FormSection>

                    <ButtonFooter loading={loading} />
                </form>
            </FormCard>
        </main>
    );
}
