import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { petsService } from "../../services/api/pets_service";


export function usePets(page: number, name?: string) {
    return useQuery({
        queryKey: ['pets', page, name],
        queryFn: () => petsService.getPets({ page, name }),
        placeholderData: (previousData) => previousData,
        staleTime: 60 * 1000
    });
}

export function usePet(id: number | undefined) {
    return useQuery({
        queryKey: ['pet', id],
        queryFn: () => petsService.getPetById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000
    });
}

export function useCreatePet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const { foto, ...petData } = data;
            const newPet = await petsService.createPet(petData);

            if (foto instanceof File && newPet.id) {
                await petsService.uploadPetPhoto(newPet.id, foto);
            }
            return newPet;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        }
    });
}

export function useUpdatePet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            const { foto, ...petData } = data;
            const promises = [];

            // Update pet data
            promises.push(petsService.updatePet(id, petData));

            // Upload photo if provided
            if (foto instanceof File) {
                promises.push(petsService.uploadPetPhoto(id, foto));
            }

            await Promise.all(promises);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['pet', variables.id] });
        }
    });
}

export function usePetPhotoUpload() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, file }: { id: number, file: File }) => petsService.uploadPetPhoto(id, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pet', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        }
    });
}

export function useDeletePet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => petsService.deletePet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        }
    });
}