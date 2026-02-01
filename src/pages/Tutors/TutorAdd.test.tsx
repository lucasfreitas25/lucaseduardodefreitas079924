import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TutorService } from '../../services/api/tutors_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TutorAdd from './TutorAdd';

vi.mock('../../services/api/tutors_service', () => ({
    TutorService: {
        createTutor: vi.fn(),
        uploadTutorPhoto: vi.fn()
    },
}));

const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter });
};

const VALID_CPF = '529.982.247-25';

import { tutorStore } from '../../store/UseTutorStore';

describe('TutorAdd', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        tutorStore.reset();
    });

    it('deve formatar CPF e Telefone enquanto o usuário digita', async () => {
        renderWithRouter(<TutorAdd />);

        const cpfInput = screen.getByLabelText(/CPF/i) as HTMLInputElement;
        const telInput = screen.getByLabelText(/Telefone/i) as HTMLInputElement;

        fireEvent.change(cpfInput, { target: { value: '12345678901' } });
        expect(cpfInput.value).toBe('123.456.789-01');

        fireEvent.change(telInput, { target: { value: '11988888888' } });
        expect(telInput.value).toBe('(11) 98888-8888');
    });

    it('deve criar um tutor ao preencher o formulário corretamente', async () => {
        vi.mocked(TutorService.createTutor).mockResolvedValue({ id: 1, nome: 'João Silva' } as any);

        const { container } = renderWithRouter(<TutorAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Tutor/i), { target: { value: 'João Silva' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@example.com' } });
        fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: VALID_CPF } });
        fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '(11) 98888-8888' } });
        fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua Exemplo, 123' } });

        const form = container.querySelector('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(TutorService.createTutor).toHaveBeenCalled();
        });
    });

    it('deve fazer upload da foto se uma foto for selecionada', async () => {
        vi.mocked(TutorService.createTutor).mockResolvedValue({ id: 1, nome: 'João Silva' } as any);
        global.URL.createObjectURL = vi.fn(() => 'mock-url');

        const { container } = renderWithRouter(<TutorAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Tutor/i), { target: { value: 'João Silva' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@example.com' } });
        fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: VALID_CPF } });
        fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '(11) 98888-8888' } });
        fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua Exemplo, 123' } });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        const form = container.querySelector('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(TutorService.uploadTutorPhoto).toHaveBeenCalledWith(1, file);
        });
    });

    it('deve exibir erro para email inválido', async () => {
        const { container } = renderWithRouter(<TutorAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Tutor/i), { target: { value: 'João Silva' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'email-invalido' } });
        fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: VALID_CPF } });
        fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '(11) 98888-8888' } });
        fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua Exemplo, 123' } });

        const form = container.querySelector('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(screen.getByText('Email inválido.')).toBeInTheDocument();
        });
    });

    it('deve exibir erro para CPF inválido', async () => {
        const { container } = renderWithRouter(<TutorAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Tutor/i), { target: { value: 'João Silva' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@example.com' } });
        // CPF com dígitos verificadores incorretos
        fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123.456.789-00' } });
        fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '(11) 98888-8888' } });
        fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua Exemplo, 123' } });

        const form = container.querySelector('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(screen.getByText('CPF inválido.')).toBeInTheDocument();
        });
    });
});
