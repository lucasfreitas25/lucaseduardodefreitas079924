import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TutorService } from '../../services/api/tutors_service';
import { petsService } from '../../services/api/pets_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TutorEdit from './TutorEdit';

vi.mock('../../services/api/tutors_service', () => ({
    TutorService: {
        getTutorById: vi.fn(),
        updateTutor: vi.fn(),
        uploadTutorPhoto: vi.fn(),
        deleteTutorPhoto: vi.fn(),
        addPet: vi.fn(),
        removePet: vi.fn()
    },
}));

vi.mock('../../services/api/pets_service', () => ({
    petsService: {
        getPets: vi.fn(),
    },
}));

const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/tutors/1/edit']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/tutors/:id/edit" element={ui} />
            </Routes>
        </MemoryRouter>
    );
};

describe('TutorEdit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(petsService.getPets).mockResolvedValue({ items: [], total: 0, page: 1, per_page: 10, total_pages: 0 });
    });

    it('deve carregar os dados do tutor e permitir a edição', async () => {
        const mockTutor = {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            telefone: '11988888888',
            cpf: '12345678901',
            endereco: 'Rua Exemplo, 123',
            foto: { url: 'old-url.jpg', id: 10 },
            pets: []
        };

        vi.mocked(TutorService.getTutorById).mockResolvedValue(mockTutor as any);
        vi.mocked(TutorService.updateTutor).mockResolvedValue(undefined as any);

        renderWithRouter(<TutorEdit />);

        await waitFor(() => {
            expect(screen.getByLabelText(/Nome do Tutor/i)).toHaveValue('João Silva');
        });

        fireEvent.change(screen.getByLabelText(/Nome do Tutor/i), { target: { value: 'João Silva Updated' } });
        fireEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(TutorService.updateTutor).toHaveBeenCalledWith(1, expect.objectContaining({
                nome: 'João Silva Updated',
                email: 'joao@example.com',
                cpf: '12345678901',
                telefone: '11988888888'
            }));
        });
    });

    it('deve fazer upload de uma nova foto se selecionada', async () => {
        const mockTutor = { id: 1, nome: 'João', email: 'joao@example.com', telefone: '11988888888', cpf: '12345678901', endereco: 'Rua 1', foto: null };
        vi.mocked(TutorService.getTutorById).mockResolvedValue(mockTutor as any);

        global.URL.createObjectURL = vi.fn(() => 'mock-url');

        const { container } = renderWithRouter(<TutorEdit />);

        await waitFor(() => {
            expect(screen.getByLabelText(/Nome do Tutor/i)).toBeDefined();
        });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(TutorService.updateTutor).toHaveBeenCalled();
            expect(TutorService.uploadTutorPhoto).toHaveBeenCalledWith(1, file);
        });
    });

    it('exibe erro se o carregamento do tutor falhar', async () => {
        vi.mocked(TutorService.getTutorById).mockRejectedValue(new Error('Erro ao carregar'));

        renderWithRouter(<TutorEdit />);

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar dados do tutor.')).toBeDefined();
        });
    });
});
