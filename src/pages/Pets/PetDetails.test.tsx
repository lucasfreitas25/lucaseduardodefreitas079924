import { render, screen, waitFor } from '@testing-library/react';
import { petsService } from '../../services/api/pets_service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PetDetails from './PetDetails';

vi.mock('../../services/api/pets_service', () => ({
    petsService: {
        getPetById: vi.fn(),
    },
}));

const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/pets/1']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/pets/:id" element={ui} />
            </Routes>
        </MemoryRouter>
    );
};

describe('PetDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve mostrar os detalhes de um pet e seus tutores', async () => {
        const mockPet = {
            id: 1,
            nome: 'Rex',
            raca: 'SRD',
            idade: 3,
            foto: {
                url: 'http://example.com/rex.jpg',
                id: 10,
                nome: 'rex.jpg',
                contentType: 'image/jpeg'
            },
            tutores: [
                {
                    id: 1,
                    nome: 'João Silva',
                    telefone: '(11) 99999-9999',
                    email: 'joao@example.com',
                    foto: null
                }
            ]
        };

        vi.mocked(petsService.getPetById).mockResolvedValue(mockPet as any);

        renderWithRouter(<PetDetails />);

        await waitFor(() => {
            expect(screen.getByText('Rex')).toBeDefined();
            expect(screen.getByText('SRD')).toBeDefined();
            expect(screen.getByText('3 anos')).toBeDefined();
            expect(screen.getByText('João Silva')).toBeDefined();
            expect(screen.getByText(/Telefone: \(11\) 99999-9999/i)).toBeDefined();
            expect(screen.getByText(/Email: joao@example.com/i)).toBeDefined();
        });

        const img = screen.getByAltText('Rex');
        expect(img.getAttribute('src')).toBe('http://example.com/rex.jpg');
    });

    it('deve exibir mensagem de erro quando a API falha', async () => {
        vi.mocked(petsService.getPetById).mockRejectedValue(new Error('Erro ao carregar detalhes'));

        renderWithRouter(<PetDetails />);

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar detalhes')).toBeDefined();
        });
    });

    it('deve mostrar mensagem de pet não encontrado', async () => {
        vi.mocked(petsService.getPetById).mockResolvedValue(null as any);

        renderWithRouter(<PetDetails />);

        await waitFor(() => {
            expect(screen.getByText('Pet não encontrado')).toBeDefined();
        });
    });
});
