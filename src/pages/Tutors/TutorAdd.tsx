import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dog, Save } from 'lucide-react';
import { useCreateTutor } from '../../hooks/queries/useTutor';
import { usePets } from '../../hooks/queries/usePet';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import { validarEmail, validarCpf } from '../../utils/validators';
import { formatCPF, formatTelefone } from '../../utils/formatters';

export default function TutorAdd() {
    const navigate = useNavigate();
    const { mutateAsync: createTutor, isPending: loading, error: mutationError } = useCreateTutor();
    const [validationError, setValidationError] = useState<string | null>(null);
    const { data: petsData } = usePets(1, '');

    const [formData, setFormData] = useState<{
        nome: string;
        email: string;
        cpf: string;
        telefone: string;
        endereco: string,
        foto: File | null;
        petId: string;
    }>({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        endereco: '',
        foto: null,
        petId: '',
    });

    const error = validationError || (mutationError as any)?.message;

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

    const handlePhotoSelect = (file: File | null) => {
        setFormData(prev => ({ ...prev, foto: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        try {
            if (!formData.nome || !formData.telefone || !formData.endereco || !formData.email || !formData.cpf) {
                setValidationError('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (!validarEmail(formData.email)) {
                setValidationError('Email inválido.');
                return;
            }

            if (!validarCpf(formData.cpf)) {
                setValidationError('CPF inválido.');
                return;
            }

            const cleanCPF = formData.cpf ? String(formData.cpf).replace(/\D/g, '') : '';
            const cleanTelefone = formData.telefone ? String(formData.telefone).replace(/\D/g, '') : '';

            await createTutor({
                nome: formData.nome,
                email: formData.email,
                cpf: cleanCPF,
                telefone: cleanTelefone,
                endereco: formData.endereco,
                foto: (formData.foto as any) || undefined,
                petId: formData.petId || undefined
            });

            navigate('/tutors');
        } catch (err: any) {
            console.error('Error creating tutor:', err);
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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 dark:from-orange-400 dark:to-cyan-400 bg-clip-text text-transparent">Adicionar Novo Tutor</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Preencha as informações do tutor 👤</p>
                    </div>
                </header>

                {error && (
                    <div role="alert" className="mb-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                                placeholder="Ex: João da Silva"
                            />
                        </div>

                        <div>
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
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                                placeholder="joao@example.com"
                            />
                        </div>

                        <div>
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
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                                placeholder="000.000.000-00"
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
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                                placeholder="(00) 00000-0000"
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
                                maxLength={250}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                                placeholder="Rua Exemplo, 123"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="petId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Vincular um Pet (opcional)
                            </label>
                            <select
                                id="petId"
                                name="petId"
                                value={formData.petId}
                                onChange={handleChange}
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
