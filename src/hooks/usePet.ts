import { useState, useEffect } from 'react';
import { petStore } from '../store/PetStore';
import { Pet, PetDetailsDTO } from '../types';

/**
 * Hook para conectar componentes React ao PetStore (RxJS)
 * 
 * Automaticamente gerencia subscriptions e cleanup
 */
export const usePetStore = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<PetDetailsDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ current: 0, total: 0 });

    useEffect(() => {
        // Subscribir aos observables do store
        const subscriptions = [
            petStore.pets$.subscribe(setPets),
            petStore.selectedPet$.subscribe(setSelectedPet),
            petStore.loading$.subscribe(setLoading),
            petStore.error$.subscribe(setError),
            petStore.pagination$.subscribe(setPagination),
        ];

        // Cleanup: unsubscribe quando componente desmontar
        return () => {
            subscriptions.forEach(sub => sub.unsubscribe());
        };
    }, []);

    return {
        // Estado
        pets,
        selectedPet,
        loading,
        error,
        pagination,

        // Estados derivados
        hasPets: pets.length > 0,
        isEmpty: !loading && pets.length === 0,

        // Ações
        loadPets: petStore.loadPets.bind(petStore),
        searchPets: petStore.searchPets.bind(petStore),
        loadPetDetails: petStore.loadPetDetails.bind(petStore),
        createPet: petStore.createPet.bind(petStore),
        updatePet: petStore.updatePet.bind(petStore),
        deletePet: petStore.deletePet.bind(petStore),
        nextPage: petStore.nextPage.bind(petStore),
        previousPage: petStore.previousPage.bind(petStore),
        clearError: petStore.clearError.bind(petStore),
        clearSelectedPet: petStore.clearSelectedPet.bind(petStore),
    };
};

/**
 * Hook simplificado para ViewModel combinado
 * Útil para componentes complexos
 */
export const usePetViewModel = () => {
    const [viewModel, setViewModel] = useState({
        pets: [] as Pet[],
        loading: false,
        error: null as string | null,
        pagination: { current: 0, total: 0 },
        hasPets: false,
        isEmpty: false,
    });

    useEffect(() => {
        const subscription = petStore.viewModel$.subscribe(setViewModel);

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        ...viewModel,

        // Ações
        loadPets: petStore.loadPets.bind(petStore),
        searchPets: petStore.searchPets.bind(petStore),
        createPet: petStore.createPet.bind(petStore),
        deletePet: petStore.deletePet.bind(petStore),
        nextPage: petStore.nextPage.bind(petStore),
        previousPage: petStore.previousPage.bind(petStore),
        clearError: petStore.clearError.bind(petStore),
    };
};