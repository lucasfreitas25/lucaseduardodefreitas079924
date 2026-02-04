import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save } from 'lucide-react';
import { usePet, useUpdatePet } from '../../../hooks/queries/usePet';
import { petsService } from '../../../services/api/pets_service';
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
    foto: File | null | { url: string; id?: number };
}

export default function PetEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: pet, isLoading: loadingPet, error: loadError } = usePet(Number(id));
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
        if (pet) {
            reset({
                nome: pet.nome,
                raca: pet.raca,
                idade: pet.idade.toString(),
                foto: pet.foto ? { url: pet.foto.url, id: pet.foto.id } : null
            });
        }
    }, [pet, reset]);

    const handlePhotoSelect = (file: File | null) => {
        setValue('foto', file);
    };

    const handlePhotoDelete = async () => {
        if (!id || !pet?.foto?.id) return;

        try {
            if (confirm('Tem certeza que deseja remover a foto deste pet?')) {
                await petsService.deletePetPhoto(Number(id), pet.foto.id);
                setValue('foto', null);
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
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

            navigate(location.state?.from || `/pets/${id}`);
        } catch (err: any) {
            console.error('Error updating pet:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const loading = loadingPet || isUpdating || isSaving;

    if (loadingPet) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

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
                            Editar Pet
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Atualize as informações do animal 🐾</p>
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
                                label="Foto do Pet"
                            />
                        </div>

                        <fieldset className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                id="nome"
                                label="Nome do Pet *"
                                placeholder="Ex: Rex"
                                disabled={loading}
                                error={errors.nome?.message}
                                {...register('nome', { required: 'Nome é obrigatório' })}
                                containerClassName="md:col-span-2"
                            />

                            <FormInput
                                id="raca"
                                label="Raça *"
                                placeholder="Ex: Labrador"
                                disabled={loading}
                                error={errors.raca?.message}
                                {...register('raca', { required: 'Raça é obrigatória' })}
                            />

                            <FormInput
                                id="idade"
                                label="Idade *"
                                type="number"
                                placeholder="Ex: 3"
                                disabled={loading}
                                error={errors.idade?.message}
                                {...register('idade', {
                                    required: 'Idade é obrigatória',
                                    min: { value: 0, message: 'Idade deve ser maior ou igual a 0' }
                                })}
                            />
                        </fieldset>
                    </section>

                    <ButtonFooter loading={loading} />
                </form>
            </FormCard>
        </main>
    );
}
