import { render, screen, waitFor, fireEvent } from '../../../test/test-utils';
import TutorList from './TutorIndex';
import { TutorService } from '../../../services/api/tutors_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../services/api/tutors_service', () => ({
    TutorService: {
        getTutors: vi.fn(),
        deleteTutor: vi.fn(),
    },
}));

import { tutorStore } from '../../../store/UseTutorStore';

describe('TutorList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        tutorStore.reset();
    });

    it('renderiza o estado de carregamento inicialmente e depois os tutores', async () => {
        const mockTutors = [
            { id: 1, name: 'João Silva', email: 'joao@example.com', phone: '123456789', photo_url: 'joao.jpg', address: 'Rua 1, 123', cpf: '12345678901' },
            { id: 2, name: 'Maria Santos', email: 'maria@example.com', phone: '987654321', photo_url: 'maria.jpg', address: 'Rua 2, 456', cpf: '98765432109' },
        ];

        vi.mocked(TutorService.getTutors).mockResolvedValue({
            items: mockTutors,
            total: 2,
            page: 1,
            per_page: 10,
            total_pages: 1,
        });

        render(<TutorList />);

        await waitFor(() => {
            expect(screen.getByText('João Silva')).toBeDefined();
            expect(screen.getByText('Maria Santos')).toBeDefined();
        });
    });

    it('deve mostrar o estado vazio quando nenhum tutor é encontrado', async () => {
        vi.mocked(TutorService.getTutors).mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            per_page: 10,
            total_pages: 0,
        });

        render(<TutorList />);

        await waitFor(() => {
            expect(screen.getByText('Nenhum tutor encontrado.')).toBeDefined();
        });
    });

    it('deve atualizar a busca ao digitar no campo de busca', async () => {
        vi.mocked(TutorService.getTutors).mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            per_page: 10,
            total_pages: 0,
        });

        render(<TutorList />);

        const searchInput = screen.getByPlaceholderText('Buscar por nome...');
        fireEvent.change(searchInput, { target: { value: 'João' } });

        await waitFor(() => {
            expect(TutorService.getTutors).toHaveBeenCalledWith(expect.objectContaining({
                name: 'João'
            }));
        }, { timeout: 2000 });
    });

    it('deve chamar deleteTutor quando o ícone de lixeira é clicado', async () => {
        const mockTutors = [{ id: 1, name: 'João Silva', email: 'joao@example.com', phone: '123456789', photo_url: 'joao.jpg', address: 'Rua 1, 123', cpf: '12345678901' }];

        vi.mocked(TutorService.getTutors).mockResolvedValue({
            items: mockTutors,
            total: 1,
            page: 1,
            per_page: 10,
            total_pages: 1,
        });
        vi.mocked(TutorService.deleteTutor).mockResolvedValue(undefined);

        vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(<TutorList />);

        await waitFor(() => {
            expect(screen.getByText('João Silva')).toBeDefined();
        });

        const deleteButton = screen.getByTitle('Deletar Tutor');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(TutorService.deleteTutor).toHaveBeenCalledWith(1);
        });
    });
});
