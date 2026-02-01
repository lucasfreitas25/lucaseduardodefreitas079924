import { useState, useEffect } from 'react';
import { tutorStore } from '../store/UseTutorStore';

export function useTutorStore() {
    const [state, setState] = useState(tutorStore.currentState);

    useEffect(() => {
        const subscription = tutorStore.state$.subscribe(setState);
        return () => subscription.unsubscribe();
    }, []);

    return {
        ...state,
        loadTutors: tutorStore.loadTutors.bind(tutorStore),
        searchTutors: tutorStore.searchTutors.bind(tutorStore),
        loadTutorDetails: tutorStore.loadTutorDetails.bind(tutorStore),
        createTutor: tutorStore.createTutor.bind(tutorStore),
        updateTutor: tutorStore.updateTutor.bind(tutorStore),
        deleteTutor: tutorStore.deleteTutor.bind(tutorStore),
        linkPet: tutorStore.linkPet.bind(tutorStore),
        unlinkPet: tutorStore.unlinkPet.bind(tutorStore),
        nextPage: tutorStore.nextPage.bind(tutorStore),
        previousPage: tutorStore.previousPage.bind(tutorStore),
        clearError: tutorStore.clearError.bind(tutorStore),
        clearSelectedTutor: tutorStore.clearSelectedTutor.bind(tutorStore),
    };
}
