import { api } from './index';
import type { Pet, PaginatedResponse, PetFilters } from '../../types';
import type { PetResponseDTO, PetDTO, PetDetailsDTO } from '../../types/dtos';

export const petsService = {
    getPets: async (filters: PetFilters = {}): Promise<PaginatedResponse<Pet>> => {
        const params = {
            nome: filters.name,
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

    getPetById: async (id: number): Promise<PetDetailsDTO> => {
        const response = await api.get<PetDetailsDTO>(`/pets/${id}`);
        return response.data;
    },


    createPet: async (pet: PetDTO): Promise<PetDTO> => {
        const response = await api.post<PetDTO>('/pets', pet);
        return response.data;
    },

    deletePet: async (id: number): Promise<void> => {
        await api.delete(`/pets/${id}`);
    },

    updatePet: async (id: number, pet: PetDTO): Promise<void> => {
        await api.put(`/pets/${id}`, pet);
    },

    uploadPetPhoto: async (id: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('foto', file);
        await api.post(`/pets/${id}/fotos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deletePetPhoto: async (id: number, photoId: number): Promise<void> => {
        await api.delete(`/pets/${id}/fotos/${photoId}`);
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

