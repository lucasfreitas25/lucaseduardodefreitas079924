import { describe, it, expect, vi, beforeEach } from 'vitest';
import { petsService } from '../services/api/pets_service';
import { api } from '../services/api/index';

vi.mock('./index', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('petsService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getPets should fetch pets with correct parameters and map DTO to domain', async () => {
        const mockDto = {
            content: [
                { id: 1, nome: 'Rex', raca: 'SRD', idade: 3, foto: { url: 'rex.jpg' } },
            ],
            total: 1,
            page: 0,
            size: 10,
            pageCount: 1,
        };

        vi.mocked(api.get).mockResolvedValue({ data: mockDto });

        const result = await petsService.getPets({ name: 'Rex', page: 1, limit: 10 });

        expect(api.get).toHaveBeenCalledWith('/pets', {
            params: { nome: 'Rex', page: 0, size: 10 },
        });

        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual({
            id: 1,
            name: 'Rex',
            breed: 'SRD',
            age: 3,
            photo_url: 'rex.jpg',
        });
        expect(result.total).toBe(1);
        expect(result.page).toBe(1);
    });

    it('getPetById should return pet details', async () => {
        const mockPet = { id: 1, nome: 'Rex' };
        vi.mocked(api.get).mockResolvedValue({ data: mockPet });

        const result = await petsService.getPetById(1);

        expect(api.get).toHaveBeenCalledWith('/pets/1');
        expect(result).toEqual(mockPet);
    });

    it('deletePet should call API to delete pet', async () => {
        vi.mocked(api.delete).mockResolvedValue({ data: {} });

        await petsService.deletePet(1);

        expect(api.delete).toHaveBeenCalledWith('/pets/1');
    });

    it('updatePet should call API to update pet', async () => {
        const mockPet = {
            id: 1,
            nome: 'Rex',
            raca: 'SRD',
            idade: 3,
            foto: { id: 1, nome: 'testefoto', contentType: 'image/jpeg', url: 'rex.jpg' }
        };
        vi.mocked(api.put).mockResolvedValue({ data: {} });

        await petsService.updatePet(1, mockPet as any);

        expect(api.put).toHaveBeenCalledWith('/pets/1', mockPet);
    });
});
