import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TutorService } from "../../services/api/tutors_service";


export function useTutors(page: number, name?: string) {
    return useQuery({
        queryKey: ['tutors', page, name],
        queryFn: () => TutorService.getTutors({ page, name }),
        placeholderData: (previousData) => previousData,
        staleTime: 60 * 1000
    });
}

export function useTutor(id: number | undefined) {
    return useQuery({
        queryKey: ['tutor', id],
        queryFn: () => TutorService.getTutorById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000
    });
}

export function useCreateTutor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const { foto, petId, pets_indices, ...tutorData } = data;
            const newTutor = await TutorService.createTutor(tutorData);

            if (foto instanceof File && newTutor.id) {
                await TutorService.uploadTutorPhoto(newTutor.id, foto);
            }

            if (petId && newTutor.id) {
                await TutorService.addPet(newTutor.id, Number(petId));
            }

            if (pets_indices && Array.isArray(pets_indices) && newTutor.id) {
                await Promise.all(pets_indices.map(id => TutorService.addPet(newTutor.id, Number(id))));
            }

            return newTutor;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['pet'] }); // Invalidate prefix for pet details
        }
    });
}

export function useUpdateTutor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            const { foto, ...tutorData } = data;
            const promises = [];

            // Update tutor data
            promises.push(TutorService.updateTutor(id, tutorData));

            // Upload photo if provided
            if (foto instanceof File) {
                promises.push(TutorService.uploadTutorPhoto(id, foto));
            }

            await Promise.all(promises);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
            queryClient.invalidateQueries({ queryKey: ['tutor', variables.id] });
        }
    });
}

export function useDeleteTutor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => TutorService.deleteTutor(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
        }
    });
}
export function useAddPet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tutorId, petId }: { tutorId: number, petId: number }) => TutorService.addPet(tutorId, petId),
        onSuccess: (_, { tutorId, petId }) => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
            queryClient.invalidateQueries({ queryKey: ['tutor', tutorId] });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['pet', petId] });
        }
    });
}

export function useRemovePet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tutorId, petId }: { tutorId: number, petId: number }) => TutorService.removePet(tutorId, petId),
        onSuccess: (_, { tutorId, petId }) => {
            queryClient.invalidateQueries({ queryKey: ['tutors'] });
            queryClient.invalidateQueries({ queryKey: ['tutor', tutorId] });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['pet', petId] });
        }
    });
}