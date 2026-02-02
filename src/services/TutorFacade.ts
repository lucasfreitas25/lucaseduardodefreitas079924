import { TutorService } from './api/tutors_service';
import type { Tutor, PaginatedResponse } from '../types';
import type { TutorDetailsDTO, TutorDTO } from '../types/dtos';

export const tutorFacade = {
    getTutors: async (page: number, size: number, name?: string): Promise<PaginatedResponse<Tutor>> => {
        return await TutorService.getTutors({ page: page + 1, limit: size, name });
    },

    getTutorById: async (id: string): Promise<TutorDetailsDTO> => {
        return await TutorService.getTutorById(Number(id));
    },

    createTutor: async (data: { nome: string; email: string; telefone: string; endereco: string; cpf: string; foto?: File }): Promise<Tutor> => {
        const tutorDTO: TutorDTO = {
            id: 0,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            endereco: data.endereco,
            cpf: data.cpf
        };

        const createdTutor = await TutorService.createTutor(tutorDTO);

        if (data.foto && createdTutor.id) {
            await TutorService.uploadTutorPhoto(createdTutor.id, data.foto);
        }

        return {
            id: createdTutor.id,
            name: createdTutor.nome,
            email: createdTutor.email,
            phone: createdTutor.telefone,
            address: createdTutor.endereco,
            cpf: createdTutor.cpf,
        };
    },

    updateTutor: async (id: string, data: { nome: string; email: string; telefone: string; endereco: string; cpf: string; foto?: File }): Promise<Tutor> => {
        const tutorId = Number(id);

        const tutorDTO: TutorDTO = {
            id: tutorId,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            endereco: data.endereco,
            cpf: data.cpf
        };

        const updatePromise = TutorService.updateTutor(tutorId, tutorDTO);

        const uploadPromise = data.foto
            ? TutorService.uploadTutorPhoto(tutorId, data.foto)
            : Promise.resolve();

        await Promise.all([updatePromise, uploadPromise]);

        return {
            id: tutorId,
            name: data.nome,
            email: data.email,
            phone: data.telefone,
            address: data.endereco,
            cpf: data.cpf
        };
    },

    deleteTutor: async (id: string): Promise<void> => {
        await TutorService.deleteTutor(Number(id));
    },

    linkPet: async (tutorId: string, petId: string): Promise<void> => {
        await TutorService.addPet(Number(tutorId), Number(petId));
    },

    unlinkPet: async (tutorId: string, petId: string): Promise<void> => {
        await TutorService.removePet(Number(tutorId), Number(petId));
    }
};
