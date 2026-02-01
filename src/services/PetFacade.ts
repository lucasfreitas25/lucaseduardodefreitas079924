import { petsService } from './api/pets_service';
import type { Pet, PaginatedResponse } from '../types';
import type { PetDetailsDTO, PetDTO } from '../types/dtos';

export const petFacade = {
    getPets: async (page: number, size: number, name?: string): Promise<PaginatedResponse<Pet>> => {
        return await petsService.getPets({ page: page + 1, limit: size, name });
    },

    getPetById: async (id: string): Promise<PetDetailsDTO> => {
        return await petsService.getPetById(Number(id));
    },

    createPet: async (data: { nome: string; raca: string; idade: number; foto?: File }): Promise<Pet> => {
        // 1. Create Pet
        const petDTO: PetDTO = {
            id: 0, // ID is ignored by API on create
            nome: data.nome,
            raca: data.raca,
            idade: data.idade
        };

        const createdPetDTO = await petsService.createPet(petDTO);

        // 2. Upload Photo if exists
        let photoUrl: string | undefined;
        if (data.foto && createdPetDTO.id) {
            await petsService.uploadPetPhoto(createdPetDTO.id, data.foto);
            // Since upload doesn't return the URL immediately, we might assume it exists or fetch again.
            // For now, let's just proceed. The UI might reload or we can fetch details.
            // But to return a Domain Pet, we do manual mapping:
        }

        // Map DTO to Domain Pet
        return {
            id: createdPetDTO.id,
            name: createdPetDTO.nome,
            breed: createdPetDTO.raca,
            age: createdPetDTO.idade,
            photo_url: photoUrl // This might be empty until refreshed
        };
    },

    updatePet: async (id: string, data: { nome: string; raca: string; idade: number; foto?: File }): Promise<Pet> => {
        const petId = Number(id);

        // 1. Update Pet Data
        const petDTO: PetDTO = {
            id: petId,
            nome: data.nome,
            raca: data.raca,
            idade: data.idade
        };

        const updatePromise = petsService.updatePet(petId, petDTO);

        const uploadPromise = data.foto
            ? petsService.uploadPetPhoto(petId, data.foto)
            : Promise.resolve();

        await Promise.all([updatePromise, uploadPromise]);

        // Return updated domain object (optimistic)
        return {
            id: petId,
            name: data.nome,
            breed: data.raca,
            age: data.idade,
            // photo_url: we don't have the new URL easily without refetching, 
            // but the store might reload or we can let the UI handle it.
        };
    },

    deletePet: async (id: string): Promise<void> => {
        await petsService.deletePet(Number(id));
    }
};
