import { api } from './index';
import type { Pet, PaginatedResponse, PetFilters } from '../../types';
import type { PetResponseDTO, PetDTO } from '../../types/dtos';

export const petsService = {
    getPets: async (filters: PetFilters = {}): Promise<PaginatedResponse<Pet>> => {
        const params = {
            name: filters.name,
            page: (filters.page || 1) - 1, // API is 0-indexed
            size: filters.limit || 10,
        };

        const response = await api.get<PetResponseDTO>('/pets', { params });
        const dto = response.data;

        return {
            items: dto.content.map(mapPetDtoToDomain),
            total: dto.total,
            page: dto.page + 1, // Convert back to 1-indexed for UI
            per_page: dto.size,
            total_pages: dto.pageCount
        };
    },

    getPetById: async (id: number): Promise<Pet> => {
        const response = await api.get<PetDTO>(`/pets/${id}`);
        return mapPetDtoToDomain(response.data);
    }
};

function mapPetDtoToDomain(dto: PetDTO): Pet {
    return {
        id: dto.id,
        name: dto.nome,
        breed: dto.raca,
        age: dto.idade,
        photo_url: dto.foto?.url,
        // tutor_id mapping if available in future
    };
}

