import { render, screen, waitFor, fireEvent } from '../../test/test-utils';
import { TutorService } from '../../services/api/tutors_service';
import { petsService } from '../../services/api/pets_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import TutorEdit from './TutorEdit';
import { tutorStore } from '../../store/UseTutorStore';

vi.mock('../../utils/imageUtils', () => ({
    compressImage: vi.fn((file) => Promise.resolve(file)),
}));

vi.mock('../../services/api/tutors_service', () => ({
    TutorService: {
        getTutorById: vi.fn(),
        updateTutor: vi.fn(),
        uploadTutorPhoto: vi.fn(),
        removePet: vi.fn(),
        getTutors: vi.fn(),
        deleteTutorPhoto: vi.fn(),
        addPet: vi.fn(),
    },
}));

vi.mock('../../services/api/pets_service', () => ({
    petsService: {
        getPets: vi.fn(),
    },
}));

const VALID_CPF = '52998224725';

describe('TutorEdit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        tutorStore.reset();
        vi.mocked(petsService.getPets).mockResolvedValue({ items: [], total: 0, page: 1, per_page: 10, total_pages: 0 });
        vi.mocked(TutorService.getTutors).mockResolvedValue({ items: [], total: 0, page: 1, per_page: 10, total_pages: 0 });
    });

    it('deve carregar os dados do tutor e permitir a edição', async () => {
        const mockTutor = {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            telefone: '11988888888',
            cpf: VALID_CPF,
            endereco: 'Rua Exemplo, 123',
            foto: { url: 'old-url.jpg', id: 10 },
            pets: []
        };

        vi.mocked(TutorService.getTutorById).mockResolvedValue(mockTutor as any);
        vi.mocked(TutorService.updateTutor).mockResolvedValue(undefined as any);
        vi.mocked(TutorService.uploadTutorPhoto).mockResolvedValue(undefined as any);

        window.history.pushState({}, '', '/tutors/1/edit');
        render(
            <Routes>
                <Route path="/tutors/:id/edit" element={<TutorEdit />} />
            </Routes>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Nome do Tutor/i)).toBeDefined();
        }, { timeout: 3000 });

        fireEvent.change(screen.getByLabelText(/Nome do Tutor/i), { target: { value: 'João Silva Updated' } });
        fireEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(TutorService.updateTutor).toHaveBeenCalled();
        }, { timeout: 5000 });
    });

    it('deve fazer upload de uma nova foto se selecionada', async () => {
        const mockTutor = { id: 1, nome: 'João', email: 'joao@example.com', telefone: '11988888888', cpf: VALID_CPF, endereco: 'Rua 1', foto: null };
        vi.mocked(TutorService.getTutorById).mockResolvedValue(mockTutor as any);

        global.URL.createObjectURL = vi.fn(() => 'mock-url');

        window.history.pushState({}, '', '/tutors/1/edit');
        const { container } = render(
            <Routes>
                <Route path="/tutors/:id/edit" element={<TutorEdit />} />
            </Routes>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Nome do Tutor/i)).toBeDefined();
        }, { timeout: 3000 });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        await screen.findByText(/Remover foto/i);

        fireEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(TutorService.updateTutor).toHaveBeenCalled();
            expect(TutorService.uploadTutorPhoto).toHaveBeenCalled();
        }, { timeout: 15000 });
    }, 20000);
});
