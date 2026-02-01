import { useState, useEffect } from 'react';
import { petStore } from '../store/UsePetStore';

export function usePetStore() {
    const [state, setState] = useState(petStore.currentState);

    useEffect(() => {
        const subscription = petStore.state$.subscribe(setState);
        return () => subscription.unsubscribe();
    }, []);

    return {
        ...state,
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
}
