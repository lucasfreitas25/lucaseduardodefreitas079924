import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LayoutGrid, X } from 'lucide-react';
import { useCreateTutor } from '../../../hooks/queries/useTutor';
import { usePets } from '../../../hooks/queries/usePet';
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
    telefone: string;
    cpf: string;
    endereco: string;
    foto: File | null;
    petIds: number[];
}

export default function TutorAdd() {
    const navigate = useNavigate();
    const { mutateAsync: createTutor, isPending, error: mutationError } = useCreateTutor();
    const [isSaving, setIsSaving] = useState(false);

    // Fetch available pets to link
    const { data: petsData } = usePets(1, '', 100);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<TutorFormData>({
        defaultValues: {
            nome: '',
            email: '',
            telefone: '',
            cpf: '',
            endereco: '',
            foto: null,
            petIds: []
        }
    });

    const selectedPetIds = watch('petIds');
    const loading = isPending || isSaving;

    const handlePhotoSelect = (file: File | null) => {
        setValue('foto', file);
    };

    const handlePetToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        if (id && !selectedPetIds.includes(id)) {
            setValue('petIds', [...selectedPetIds, id]);
        }
        e.target.value = ""; // Reset select
    };

    const removePet = (id: number) => {
        setValue('petIds', selectedPetIds.filter(petId => petId !== id));
    };

    const onSubmit = async (data: TutorFormData) => {
        try {
            setIsSaving(true);
            const cleanCPF = data.cpf.replace(/\D/g, '');
            const cleanTelefone = data.telefone.replace(/\D/g, '');

            await createTutor({
                nome: data.nome,
                email: data.email,
                telefone: cleanTelefone,
                cpf: cleanCPF,
                endereco: data.endereco,
                foto: data.foto || undefined,
                pets_indices: selectedPetIds
            } as any);

            navigate('/tutors');
        } catch (err: any) {
            console.error('Error creating tutor:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const availablePets = petsData?.items.filter(pet => !selectedPetIds.includes(pet.id)) || [];

    return (
        <main className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <BackButton disabled={loading} />

            <FormCard>
                <header className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-orange-200 to-cyan-200 dark:from-orange-900 dark:to-cyan-900">
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 dark:from-orange-400 dark:to-cyan-400 bg-clip-text text-transparent">
                            Adicionar Novo Tutor
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Cadastre um novo tutor no sistema 👤</p>
                    </div>
                </header>

                <ErrorMessage message={(mutationError as any)?.message || ''} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <section className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <PhotoUpload
                                onPhotoSelect={handlePhotoSelect}
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

                    <FormSection title="Vincular Pets" icon={LayoutGrid}>
                        <div className="space-y-4">
                            <FormSelect
                                id="pet-select"
                                label="Selecione os pets para vincular"
                                onChange={handlePetToggle}
                                disabled={loading || availablePets.length === 0}
                            >
                                <option value="">{availablePets.length === 0 ? 'Nenhum pet disponível' : 'Selecione um pet...'}</option>
                                {availablePets.map(pet => (
                                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
                                ))}
                            </FormSelect>

                            {selectedPetIds.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-gray-100 dark:border-gray-800">
                                    {selectedPetIds.map(id => {
                                        const pet = petsData?.items.find(p => p.id === id);
                                        return (
                                            <span key={id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-medium shadow-sm border border-orange-100 dark:border-orange-900/30 group">
                                                {pet?.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removePet(id)}
                                                    className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </FormSection>

                    <ButtonFooter loading={loading} label="Cadastrar Tutor" />
                </form>
            </FormCard>
        </main>
    );
}
