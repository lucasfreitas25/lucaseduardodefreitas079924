import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { map, distinctUntilChanged, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { tutorFacade } from '../services/TutorFacade';
import type { TutorDetailsDTO } from '../types/dtos';
import type { Tutor } from '../types';

interface TutorState {
    tutors: Tutor[];
    selectedTutor: TutorDetailsDTO | null;
    loading: boolean;
    loadingDetails: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    searchTerm: string;
}

const initialState: TutorState = {
    tutors: [],
    selectedTutor: null,
    loading: false,
    loadingDetails: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    searchTerm: '',
};

class TutorStore {
    /* 
       RxJS (BehaviorSubject): Arquitetura de estado global reativa.
       Centraliza o Single Source of Truth e permite que múltiplos componentes consumam
       partes específicas do estado com alta performance e sem acoplamento direto.
    */
    private readonly _state = new BehaviorSubject<TutorState>(initialState);

    public readonly state$: Observable<TutorState> = this._state.asObservable();

    public readonly tutors$: Observable<Tutor[]> = this._state.pipe(
        map(state => state.tutors),
        distinctUntilChanged()
    );

    public readonly selectedTutor$: Observable<TutorDetailsDTO | null> = this._state.pipe(
        map(state => state.selectedTutor),
        distinctUntilChanged()
    );

    public readonly loading$: Observable<boolean> = this._state.pipe(
        map(state => state.loading),
        distinctUntilChanged()
    );

    public readonly error$: Observable<string | null> = this._state.pipe(
        map(state => state.error),
        distinctUntilChanged()
    );

    public readonly pagination$: Observable<{ current: number; total: number }> = this._state.pipe(
        map(state => ({ current: state.currentPage, total: state.totalPages })),
        distinctUntilChanged((prev, curr) =>
            prev.current === curr.current && prev.total === curr.total
        )
    );

    private searchSubject = new Subject<string>();

    constructor() {
        this.searchSubject.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            switchMap((term) => {
                if (this.currentState.tutors.length === 0) {
                    this.setState({ loading: true, error: null, currentPage: 0, searchTerm: term });
                } else {
                    this.setState({ error: null, currentPage: 0, searchTerm: term });
                }

                return from(tutorFacade.getTutors(0, 10, term)).pipe(
                    catchError(error => {
                        this.setState({
                            error: error instanceof Error ? error.message : 'Erro ao buscar tutores',
                            loading: false
                        });
                        return [];
                    })
                );
            })
        ).subscribe((response: any) => {
            if (Array.isArray(response)) return;

            this.setState({
                tutors: response.items,
                currentPage: 0,
                totalPages: response.total_pages,
                loading: false,
            });
        });
    }

    get currentState(): TutorState {
        return this._state.value;
    }

    private setState(partial: Partial<TutorState>): void {
        this._state.next({
            ...this.currentState,
            ...partial,
        });
    }

    async loadTutors(page: number = 0, size: number = 10): Promise<void> {
        if (this.currentState.tutors.length === 0) {
            this.setState({ loading: true, error: null });
        } else {
            this.setState({ error: null });
        }

        try {
            const { searchTerm } = this.currentState;
            const response = await tutorFacade.getTutors(page, size, searchTerm || undefined);

            this.setState({
                tutors: response.items,
                currentPage: page,
                totalPages: response.total_pages,
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error instanceof Error ? error.message : 'Erro ao carregar tutores',
                loading: false,
            });
        }
    }

    searchTutors(searchTerm: string): void {
        this.searchSubject.next(searchTerm);
    }

    async loadTutorDetails(id: string): Promise<void> {
        this.setState({ loadingDetails: true, error: null });

        try {
            const tutor = await tutorFacade.getTutorById(id);

            this.setState({
                selectedTutor: tutor,
                loadingDetails: false,
            });
        } catch (error) {
            this.setState({
                error: error instanceof Error ? error.message : 'Erro ao carregar detalhes do tutor',
                loadingDetails: false,
            });
        }
    }

    async createTutor(data: {
        nome: string;
        email: string;
        telefone: string;
        endereco: string;
        cpf: string;
        foto?: File;
    }): Promise<void> {
        this.setState({ loading: true, error: null });

        try {
            const newTutor = await tutorFacade.createTutor(data);

            this.setState({
                tutors: [newTutor, ...this.currentState.tutors],
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error instanceof Error ? error.message : 'Erro ao criar tutor',
                loading: false,
            });
            throw error;
        }
    }

    async updateTutor(id: string, data: {
        nome: string;
        email: string;
        telefone: string;
        endereco: string;
        cpf: string;
        foto?: File;
    }): Promise<void> {
        this.setState({ loading: true, error: null });

        try {
            const updatedTutor = await tutorFacade.updateTutor(id, data);

            this.setState({
                tutors: this.currentState.tutors.map(tutor =>
                    tutor.id === parseInt(id) ? updatedTutor : tutor
                ),
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error instanceof Error ? error.message : 'Erro ao atualizar tutor',
                loading: false,
            });
            throw error;
        }
    }

    async deleteTutor(id: string): Promise<void> {
        this.setState({ loading: true, error: null });

        try {
            await tutorFacade.deleteTutor(id);

            this.setState({
                tutors: this.currentState.tutors.filter(tutor => tutor.id !== parseInt(id)),
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error instanceof Error ? error.message : 'Erro ao excluir tutor',
                loading: false,
            });
            throw error;
        }
    }

    async linkPet(tutorId: string, petId: string): Promise<void> {
        this.setState({ error: null });
        try {
            await tutorFacade.linkPet(tutorId, petId);
            await this.loadTutorDetails(tutorId);
        } catch (error) {
            this.setState({ error: error instanceof Error ? error.message : 'Erro ao vincular pet' });
            throw error;
        }
    }

    async unlinkPet(tutorId: string, petId: string): Promise<void> {
        this.setState({ error: null });
        try {
            await tutorFacade.unlinkPet(tutorId, petId);
            if (this.currentState.selectedTutor && this.currentState.selectedTutor.id === Number(tutorId)) {
                const currentTutor = this.currentState.selectedTutor;
                const updatedPets = currentTutor.pets?.filter(p => p.id !== Number(petId)) || [];
                this.setState({
                    selectedTutor: { ...currentTutor, pets: updatedPets }
                });
            } else {
                await this.loadTutorDetails(tutorId);
            }
        } catch (error) {
            this.setState({ error: error instanceof Error ? error.message : 'Erro ao desvincular pet' });
            throw error;
        }
    }

    async nextPage(): Promise<void> {
        const { currentPage, totalPages } = this.currentState;
        if (currentPage < totalPages - 1) {
            await this.loadTutors(currentPage + 1, 10);
        }
    }

    async previousPage(): Promise<void> {
        const { currentPage } = this.currentState;
        if (currentPage > 0) {
            await this.loadTutors(currentPage - 1, 10);
        }
    }

    clearError(): void {
        this.setState({ error: null });
    }

    clearSelectedTutor(): void {
        this.setState({ selectedTutor: null });
    }

    reset(): void {
        this._state.next(initialState);
    }
}

export const tutorStore = new TutorStore();
