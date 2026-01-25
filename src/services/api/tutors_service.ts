import { api } from './index';
import type { Tutor, PaginatedResponse, TutorFilters } from '../../types';
import type { TutorResponseDTO, TutorDTO, TutorDetailsDTO } from '../../types/dtos';

export const TutorService = {
    getTutors: async (filters: TutorFilters = {}): Promise<PaginatedResponse<Tutor>> => {
        const params = {
            nome: filters.name,
            page: (filters.page || 1) - 1, // API is 0-indexed
            size: filters.limit || 10,
        };

        const response = await api.get<TutorResponseDTO>('/tutores', { params });
        const dto = response.data;

        return {
            items: dto.content.map(mapTutorDtoToDomain),
            total: dto.total,
            page: dto.page + 1, // Convert back to 1-indexed for UI
            per_page: dto.size,
            total_pages: dto.pageCount
        };
    },

    getTutorById: async (id: number): Promise<TutorDetailsDTO> => {
        const response = await api.get<TutorDetailsDTO>(`/tutores/${id}`);
        return response.data;
    },


    createTutor: async (tutor: TutorDTO): Promise<TutorDTO> => {
        const response = await api.post<TutorDTO>('/tutores', tutor);
        return response.data;
    },

    deleteTutor: async (id: number): Promise<void> => {
        await api.delete(`/tutores/${id}`);
    },

    updateTutor: async (id: number, tutor: TutorDTO): Promise<void> => {
        await api.put(`/tutores/${id}`, tutor);
    },

    uploadTutorPhoto: async (id: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('foto', file);
        await api.post(`/tutores/${id}/fotos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteTutorPhoto: async (id: number, photoId: number): Promise<void> => {
        await api.delete(`/tutores/${id}/fotos/${photoId}`);
    },

    addPet: async (tutorId: number, petId: number): Promise<void> => {
        await api.post(`/tutores/${tutorId}/pets/${petId}`);
    },

    removePet: async (tutorId: number, petId: number): Promise<void> => {
        await api.delete(`/tutores/${tutorId}/pets/${petId}`);
    }
};

function mapTutorDtoToDomain(dto: TutorDTO): Tutor {
    return {
        id: dto.id,
        name: dto.nome,
        email: dto.email,
        phone: dto.telefone,
        address: dto.endereco,
        cpf: dto.cpf,
        photo_url: dto.foto?.url,
    };
}

