import { render, screen, waitFor, fireEvent } from '../../test/test-utils';
import { petsService } from '../../services/api/pets_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PetAdd from './PetAdd';

vi.mock('../../utils/imageUtils', () => ({
    compressImage: vi.fn((file) => Promise.resolve(file)),
}));

vi.mock('../../services/api/pets_service', () => ({
    petsService: {
        createPet: vi.fn(),
        uploadPetPhoto: vi.fn(),
        getPets: vi.fn()
    },
}));

describe('PetAdd', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(petsService.getPets).mockResolvedValue({ items: [], total: 0, page: 1, per_page: 10, total_pages: 0 });
    });

    it('deve criar um pet ao clicar no botão de salvar', async () => {
        vi.mocked(petsService.createPet).mockResolvedValue({
            id: 1,
            nome: 'Rex',
            raca: 'SRD',
            idade: 3,
        });

        render(<PetAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Pet/i), { target: { value: 'Rex' } });
        fireEvent.change(screen.getByLabelText(/Raça/i), { target: { value: 'SRD' } });
        fireEvent.change(screen.getByLabelText(/Idade/i), { target: { value: '3' } });

        const saveButton = screen.getByRole('button', { name: /Salvar Pet/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(petsService.createPet).toHaveBeenCalledWith({
                nome: 'Rex',
                raca: 'SRD',
                idade: 3
            });
        }, { timeout: 3000 });
    });

    it('deve fazer upload da foto do pet se uma foto for selecionada', async () => {
        const mockPet = { id: 1, nome: 'Rex', raca: 'SRD', idade: 3 };
        vi.mocked(petsService.createPet).mockResolvedValue(mockPet);

        global.URL.createObjectURL = vi.fn(() => 'mock-url');

        const { container } = render(<PetAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Pet/i), { target: { value: 'Rex' } });
        fireEvent.change(screen.getByLabelText(/Raça/i), { target: { value: 'SRD' } });
        fireEvent.change(screen.getByLabelText(/Idade/i), { target: { value: '3' } });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        // Espera o processamento da imagem (mesmo mocked, é async)
        await screen.findByText(/Remover foto/i);

        const saveButton = screen.getByRole('button', { name: /Salvar Pet/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(petsService.createPet).toHaveBeenCalled();
            expect(petsService.uploadPetPhoto).toHaveBeenCalledWith(1, file);
        });
    });

    it('exibe erro se a criação do pet falhar', async () => {
        vi.mocked(petsService.createPet).mockRejectedValue(new Error('Erro na API'));

        render(<PetAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Pet/i), { target: { value: 'Rex' } });
        fireEvent.change(screen.getByLabelText(/Raça/i), { target: { value: 'SRD' } });
        fireEvent.change(screen.getByLabelText(/Idade/i), { target: { value: '3' } });

        fireEvent.click(screen.getByRole('button', { name: /Salvar Pet/i }));

        await waitFor(() => {
            const alert = screen.getByRole('alert');
            expect(alert.textContent).toContain('Erro na API');
        }, { timeout: 3000 });
    });
});
