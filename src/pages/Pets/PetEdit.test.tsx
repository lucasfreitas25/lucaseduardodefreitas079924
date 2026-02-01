import { render, screen, waitFor, fireEvent } from '../../test/test-utils';
import { petsService } from '../../services/api/pets_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import PetEdit from './PetEdit';

vi.mock('../../services/api/pets_service', () => ({
    petsService: {
        getPetById: vi.fn(),
        updatePet: vi.fn(),
        uploadPetPhoto: vi.fn(),
        deletePetPhoto: vi.fn()
    },
}));

describe('PetEdit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve carregar os dados do pet e permitir a edição', async () => {
        const mockPet = {
            id: 1,
            nome: 'Rex',
            raca: 'SRD',
            idade: 3,
            foto: { url: 'old-url.jpg', id: 10 }
        };

        vi.mocked(petsService.getPetById).mockResolvedValue(mockPet as any);
        vi.mocked(petsService.updatePet).mockResolvedValue(undefined as any);

        window.history.pushState({}, '', '/pets/1/edit');
        render(
            <Routes>
                <Route path="/pets/:id/edit" element={<PetEdit />} />
            </Routes>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Nome do Pet/i)).toHaveValue('Rex');
        });

        fireEvent.change(screen.getByLabelText(/Nome do Pet/i), { target: { value: 'Rex Updated' } });
        fireEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(petsService.updatePet).toHaveBeenCalledWith(1, expect.objectContaining({
                nome: 'Rex Updated',
                raca: 'SRD',
                idade: 3
            }));
        });
    });

    it('deve fazer upload de uma nova foto se selecionada', async () => {
        const mockPet = { id: 1, nome: 'Rex', raca: 'SRD', idade: 3, foto: null };
        vi.mocked(petsService.getPetById).mockResolvedValue(mockPet as any);

        // Mock URL.createObjectURL
        global.URL.createObjectURL = vi.fn(() => 'mock-url');

        window.history.pushState({}, '', '/pets/1/edit');
        const { container } = render(
            <Routes>
                <Route path="/pets/:id/edit" element={<PetEdit />} />
            </Routes>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Nome do Pet/i)).toBeDefined();
        });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        // Espera o processamento da imagem (mesmo mocked, é async)
        await screen.findByText(/Remover foto/i);

        fireEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(petsService.updatePet).toHaveBeenCalled();
            expect(petsService.uploadPetPhoto).toHaveBeenCalledWith(1, file);
        });
    });

    it('exibe erro se o carregamento do pet falhar', async () => {
        vi.mocked(petsService.getPetById).mockRejectedValue(new Error('Erro ao carregar'));

        window.history.pushState({}, '', '/pets/1/edit');
        render(
            <Routes>
                <Route path="/pets/:id/edit" element={<PetEdit />} />
            </Routes>
        );

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar')).toBeDefined();
        });
    });
});
