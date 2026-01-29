import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TutorService } from './tutors_service';
import { api } from './index';

vi.mock('./index', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('tutorsService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getTutors deveria buscar tutores com parâmetros corretos e mapear DTO para domínio', async () => {
        const mockDto = {
            content: [
                {
                    id: 1,
                    nome: 'Lucas Freitas',
                    email: 'lucas@example.com',
                    telefone: '123456789',
                    endereco: 'Rua Central, 123',
                    cpf: '123.456.789-00',
                    foto: { url: 'lucas.jpg' }
                },
            ],
            total: 1,
            page: 0,
            size: 10,
            pageCount: 1,
        };

        vi.mocked(api.get).mockResolvedValue({ data: mockDto });

        const result = await TutorService.getTutors({ name: 'Lucas', page: 1, limit: 10 });

        expect(api.get).toHaveBeenCalledWith('/tutores', {
            params: { nome: 'Lucas', page: 0, size: 10 },
        });

        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual({
            id: 1,
            name: 'Lucas Freitas',
            email: 'lucas@example.com',
            phone: '123456789',
            address: 'Rua Central, 123',
            cpf: '123.456.789-00',
            photo_url: 'lucas.jpg',
        });
        expect(result.total).toBe(1);
        expect(result.page).toBe(1);
    });

    it('getTutorById deveria retornar os detalhes do tutor', async () => {
        const mockTutor = { id: 1, nome: 'Lucas Freitas' };
        vi.mocked(api.get).mockResolvedValue({ data: mockTutor });

        const result = await TutorService.getTutorById(1);

        expect(api.get).toHaveBeenCalledWith('/tutores/1');
        expect(result).toEqual(mockTutor);
    });

    it('deleteTutor deveria chamar a API para deletar o tutor', async () => {
        vi.mocked(api.delete).mockResolvedValue({ data: {} });

        await TutorService.deleteTutor(1);

        expect(api.delete).toHaveBeenCalledWith('/tutores/1');
    });

    it('updateTutor deveria chamar a API para atualizar o tutor', async () => {
        const mockTutor = {
            id: 1,
            nome: 'Lucas Freitas',
            email: 'lucas@example.com',
            telefone: '123456789',
            endereco: 'Rua Central, 123',
            cpf: '123.456.789-00',
            foto: { id: 1, nome: 'testefoto', contentType: 'image/jpeg', url: 'lucas.jpg' }
        };
        vi.mocked(api.put).mockResolvedValue({ data: {} });

        await TutorService.updateTutor(1, mockTutor as any);

        expect(api.put).toHaveBeenCalledWith('/tutores/1', mockTutor);
    });

});
