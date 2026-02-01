import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dog, Save } from 'lucide-react';
import { useTutorStore } from '../../hooks/useTutorStore';
import { PhotoUpload } from '../../components/Common/PhotoUpload';
import { validarEmail, validarCpf } from '../../utils/validators';
import { formatCPF, formatTelefone } from '../../utils/formatters';

export default function TutorAdd() {
    const navigate = useNavigate();
    const { createTutor, loading, error: storeError, clearError } = useTutorStore(); // Destructure properly
    const [validationError, setValidationError] = useState<string | null>(null);
    // Wait, useTutorStore has createTutor. I'll use it.

    const [formData, setFormData] = useState<{
        nome: string;
        email: string;
        cpf: string;
        telefone: string;
        endereco: string,
        foto: File | null;
    }>({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        endereco: '',
        foto: null,
    });

    const error = validationError || storeError;

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
        clearError();
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
                foto: formData.foto || undefined
            });

            navigate('/tutors');
        } catch (err: any) {
            console.error('Error creating tutor:', err);
            // Error is handled by store and exposed via 'error' prop
        }
    };

    return (
        <main className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/tutors')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                disabled={loading}
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Adicionar Novo Tutor</h1>
                        <p className="text-gray-500 dark:text-gray-400">Preencha as informações do tutor</p>
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
                                maxLength={100}
                                disabled={loading}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="">
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                                placeholder="Rua Exemplo, 123"
                            />
                        </div>
                    </fieldset>

                    <footer className="flex justify-center md:justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
