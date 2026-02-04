import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { useCreatePet } from '../../../hooks/queries/usePet';
import { PhotoUpload } from '../../../components/Common/PhotoUpload';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../../components/UI/FormInput';
import { ErrorMessage } from '../../../components/UI/ErrorMessage';
import { FormCard } from '../../../components/UI/FormCard';
import { BackButton } from '../../../components/UI/BackButton';
import { ButtonFooter } from '../../../components/UI/Footer';

interface PetFormData {
    nome: string;
    raca: string;
    idade: string;
    foto: File | null;
}

export default function PetAdd() {
    const navigate = useNavigate();
    const { mutateAsync: createPet, isPending, error: mutationError } = useCreatePet();

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

    const handlePhotoSelect = (file: File | null) => {
        setValue('foto', file);
    };

    const onSubmit = async (data: PetFormData) => {
        try {
            await createPet({
                nome: data.nome,
                raca: data.raca,
                idade: Number(data.idade),
                foto: data.foto || undefined
            });

            navigate('/pets');
        } catch (err) {
            console.error('Error creating pet:', err);
        }
    };

    return (
        <main className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <BackButton disabled={isPending} />

            <FormCard>
                <header className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-orange-200 to-cyan-200 dark:from-orange-900 dark:to-cyan-900">
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                        <PawPrint className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 dark:from-orange-400 dark:to-cyan-400 bg-clip-text text-transparent">
                            Adicionar Novo Pet
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Cadastre um novo pet no sistema 🐾</p>
                    </div>
                </header>

                <ErrorMessage message={(mutationError as any)?.message || ''} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <section className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <PhotoUpload
                                onPhotoSelect={handlePhotoSelect}
                                label="Foto do Pet"
                            />
                        </div>

                        <fieldset className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                id="nome"
                                label="Nome do Pet *"
                                placeholder="Ex: Rex"
                                disabled={isPending}
                                error={errors.nome?.message}
                                {...register('nome', { required: 'Nome é obrigatório' })}
                                containerClassName="md:col-span-2"
                            />

                            <FormInput
                                id="raca"
                                label="Raça *"
                                placeholder="Ex: Labrador"
                                disabled={isPending}
                                error={errors.raca?.message}
                                {...register('raca', { required: 'Raça é obrigatória' })}
                            />

                            <FormInput
                                id="idade"
                                label="Idade *"
                                type="number"
                                placeholder="Ex: 3"
                                disabled={isPending}
                                error={errors.idade?.message}
                                {...register('idade', {
                                    required: 'Idade é obrigatória',
                                    min: { value: 0, message: 'Idade deve ser maior ou igual a 0' }
                                })}
                            />
                        </fieldset>
                    </section>

                    <ButtonFooter loading={isPending} label="Adicionar Pet" />
                </form>
            </FormCard>
        </main>
    );
}
