import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { petsService } from '../../services/api/pets_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PetAdd from './PetAdd';

vi.mock('../../services/api/pets_service', () => ({
    petsService: {
        createPet: vi.fn(),
        uploadPetPhoto: vi.fn()
    },
}));

const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('PetAdd', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve criar um pet ao clicar no botão de salvar', async () => {
        vi.mocked(petsService.createPet).mockResolvedValue({
            id: 1,
            nome: 'Rex',
            raca: 'SRD',
            idade: 3,
        });

        renderWithRouter(<PetAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Pet/i), { target: { value: 'Rex' } });
        fireEvent.change(screen.getByLabelText(/Raça/i), { target: { value: 'SRD' } });
        fireEvent.change(screen.getByLabelText(/Idade/i), { target: { value: '3' } });

        const saveButton = screen.getByRole('button', { name: /Salvar Pet/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(petsService.createPet).toHaveBeenCalledWith({
                id: 0,
                nome: 'Rex',
                raca: 'SRD',
                idade: 3
            });
        });
    });

    it('deve fazer upload da foto do pet se uma foto for selecionada', async () => {
        const mockPet = { id: 1, nome: 'Rex', raca: 'SRD', idade: 3 };
        vi.mocked(petsService.createPet).mockResolvedValue(mockPet);

        global.URL.createObjectURL = vi.fn(() => 'mock-url');

        const { container } = renderWithRouter(<PetAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Pet/i), { target: { value: 'Rex' } });
        fireEvent.change(screen.getByLabelText(/Raça/i), { target: { value: 'SRD' } });
        fireEvent.change(screen.getByLabelText(/Idade/i), { target: { value: '3' } });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        const saveButton = screen.getByRole('button', { name: /Salvar Pet/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(petsService.createPet).toHaveBeenCalled();
            expect(petsService.uploadPetPhoto).toHaveBeenCalledWith(1, file);
        });
    });

    it('exibe erro se a criação do pet falhar', async () => {
        vi.mocked(petsService.createPet).mockRejectedValue(new Error('Erro na API'));

        renderWithRouter(<PetAdd />);

        fireEvent.change(screen.getByLabelText(/Nome do Pet/i), { target: { value: 'Rex' } });
        fireEvent.change(screen.getByLabelText(/Raça/i), { target: { value: 'SRD' } });
        fireEvent.change(screen.getByLabelText(/Idade/i), { target: { value: '3' } });

        fireEvent.click(screen.getByRole('button', { name: /Salvar Pet/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Erro na API');
        });
    });
});
