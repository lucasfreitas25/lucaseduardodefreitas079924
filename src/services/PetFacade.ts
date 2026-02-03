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
        const petDTO: PetDTO = {
            id: 0,
            nome: data.nome,
            raca: data.raca,
            idade: data.idade
        };

        const createdPetDTO = await petsService.createPet(petDTO);

        let photoUrl: string | undefined;
        if (data.foto && createdPetDTO.id) {
            await petsService.uploadPetPhoto(createdPetDTO.id, data.foto);
        }

        return {
            id: createdPetDTO.id,
            name: createdPetDTO.nome,
            breed: createdPetDTO.raca,
            age: createdPetDTO.idade,
            photo_url: photoUrl
        };
    },

    updatePet: async (id: string, data: { nome: string; raca: string; idade: number; foto?: File }): Promise<Pet> => {
        const petId = Number(id);

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

        return {
            id: petId,
            name: data.nome,
            breed: data.raca,
            age: data.idade,
        };
    },

    deletePet: async (id: string): Promise<void> => {
        await petsService.deletePet(Number(id));
    }
};
