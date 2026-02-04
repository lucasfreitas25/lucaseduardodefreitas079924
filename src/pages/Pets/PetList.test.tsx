import { render, screen, waitFor, fireEvent } from '../../test/test-utils';
import PetList from './PetIndex';
import { petsService } from '../../services/api/pets_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/api/pets_service', () => ({
    petsService: {
        getPets: vi.fn(),
        deletePet: vi.fn(),
    },
}));

describe('PetList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza o estado de carregamento inicialmente e depois os pets', async () => {
        const mockPets = [
            { id: 1, name: 'Rex', breed: 'SRD', age: 3, photo_url: 'rex.jpg' },
            { id: 2, name: 'Thor', breed: 'Poodle', age: 2, photo_url: 'thor.jpg' },
        ];

        vi.mocked(petsService.getPets).mockResolvedValue({
            items: mockPets,
            total: 2,
            page: 1,
            per_page: 10,
            total_pages: 1,
        });

        render(<PetList />);

        await waitFor(() => {
            expect(screen.getByText('Rex')).toBeDefined();
            expect(screen.getByText('Thor')).toBeDefined();
        });
    });

    it('deve mostrar o estado vazio quando nenhum pet é encontrado', async () => {
        vi.mocked(petsService.getPets).mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            per_page: 10,
            total_pages: 0,
        });

        render(<PetList />);

        await waitFor(() => {
            expect(screen.getByText('Nenhum pet encontrado.')).toBeDefined();
        });
    });

    it('deve atualizar a busca ao digitar no campo de busca', async () => {
        vi.mocked(petsService.getPets).mockResolvedValue({
            items: [],
            total: 0,
            page: 1,
            per_page: 10,
            total_pages: 0,
        });

        render(<PetList />);

        const searchInput = screen.getByPlaceholderText('Buscar por nome...');
        fireEvent.change(searchInput, { target: { value: 'Rex' } });

        await waitFor(() => {
            expect(petsService.getPets).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Rex'
            }));
        }, { timeout: 1000 });
    });

    it('deve chamar deletePet quando o ícone de lixeira é clicado', async () => {
        const mockPets = [{ id: 1, name: 'Rex', breed: 'SRD', age: 3, photo_url: 'rex.jpg' }];

        vi.mocked(petsService.getPets).mockResolvedValue({
            items: mockPets,
            total: 1,
            page: 1,
            per_page: 10,
            total_pages: 1,
        });

        vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(<PetList />);

        await waitFor(() => {
            expect(screen.getByText('Rex')).toBeDefined();
        });

        const deleteButton = screen.getByTitle('Deletar Pet');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(petsService.deletePet).toHaveBeenCalledWith(1);
        });
    });
});
