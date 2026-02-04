import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, PawPrint, User } from 'lucide-react';
import { useCreateTutor } from '../../hooks/queries/useTutor';
import { usePets } from '../../hooks/queries/usePet';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import { validarEmail } from '../../utils/validarEmail';
import { validarCpf } from '../../utils/validarCpf';
import { formatCPF } from '../../utils/formatCPF';
import { formatTelefone } from '../../utils/formatTelefone';
import { useForm } from 'react-hook-form';

interface TutorForm {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    endereco: string;
    foto: File | null;
    petId: string;
};

export default function TutorAdd() {
    const navigate = useNavigate();
    const { mutateAsync: createTutor, isPending, error: mutationError } = useCreateTutor();
    const [isSaving, setIsSaving] = useState(false);
    const { data: petsData } = usePets(1, '');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<TutorForm>({
        defaultValues: {
            nome: '',
            email: '',
            cpf: '',
            telefone: '',
            endereco: '',
            foto: null,
            petId: ''
        }
    });

    const loading = isPending || isSaving;

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('cpf', formatCPF(e.target.value));
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('telefone', formatTelefone(e.target.value));
    };

    const handlePhotoSelect = (file: File | null) => {
        setValue('foto', file);
    };

    const onSubmit = async (data: TutorForm) => {
        try {
            const cleanCPF = data.cpf ? String(data.cpf).replace(/\D/g, '') : '';
            const cleanTelefone = data.telefone ? String(data.telefone).replace(/\D/g, '') : '';

            setIsSaving(true);
            await createTutor({
                nome: data.nome,
                email: data.email,
                cpf: cleanCPF,
                telefone: cleanTelefone,
                endereco: data.endereco,
                foto: (data.foto as any) || undefined,
                petId: data.petId || undefined
            });

            navigate('/tutors');
        } catch (err: any) {
            console.error('Error creating tutor:', err);
        } finally {
            setIsSaving(false);
        }
    };

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
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Adicionar Novo Tutor</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Preencha as informações do tutor 👤</p>
                    </div>
                </header>

                {mutationError && (
                    <div role="alert" className="mb-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl animate-fade-in">
                        {(mutationError as any)?.message || 'Erro ao criar tutor'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <PhotoUpload
                            onPhotoSelect={handlePhotoSelect}
                            label="Foto do Tutor"
                        />
                    </div>

                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome do Tutor *
                            </label>
                            <input
                                type="text"
                                id="nome"
                                {...register('nome', { required: 'Nome é obrigatório', maxLength: 100 })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="Ex: João da Silva"
                            />
                            {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register('email', {
                                    required: 'Email é obrigatório',
                                    validate: v => validarEmail(v) || 'Email inválido'
                                })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="joao@example.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                CPF *
                            </label>
                            <input
                                type="text"
                                id="cpf"
                                {...register('cpf', {
                                    required: 'CPF é obrigatório',
                                    validate: v => validarCpf(v) || 'CPF inválido',
                                    onChange: handleCpfChange
                                })}
                                maxLength={14}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cpf ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="000.000.000-00"
                            />
                            {errors.cpf && <p className="mt-1 text-xs text-red-500">{errors.cpf.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Telefone *
                            </label>
                            <input
                                type="text"
                                id="telefone"
                                {...register('telefone', {
                                    required: 'Telefone é obrigatório',
                                    onChange: handleTelefoneChange
                                })}
                                maxLength={15}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.telefone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="(00) 00000-0000"
                            />
                            {errors.telefone && <p className="mt-1 text-xs text-red-500">{errors.telefone.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Endereço *
                            </label>
                            <input
                                type="text"
                                id="endereco"
                                {...register('endereco', { required: 'Endereço é obrigatório', maxLength: 250 })}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.endereco ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                                placeholder="Rua Exemplo, 123"
                            />
                            {errors.endereco && <p className="mt-1 text-xs text-red-500">{errors.endereco.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="petId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Vincular um Pet (opcional)
                            </label>
                            <select
                                id="petId"
                                {...register('petId')}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                            >
                                <option value="">Selecione um pet...</option>
                                {petsData?.items.map((pet) => (
                                    <option key={pet.id} value={pet.id}>
                                        {pet.name} ({pet.breed})
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Dica: Você pode vincular mais pets depois na tela de edição do tutor.
                            </p>
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
                                    Salvar Tutor
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </article>
        </main>
    );
}
