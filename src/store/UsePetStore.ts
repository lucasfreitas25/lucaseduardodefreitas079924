import { BehaviorSubject, Observable, combineLatest, Subject, from } from 'rxjs';
import { map, distinctUntilChanged, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { petFacade } from '../services/PetFacade';
import type { PetDetailsDTO } from '../types/dtos';
import type { Pet } from '../types';

/**
 * Estado da aplicação para Pets
 */
interface PetState {
  pets: Pet[];
  selectedPet: PetDetailsDTO | null;
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
}

const initialState: PetState = {
  pets: [],
  selectedPet: null,
  loading: false,
  loadingDetails: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  searchTerm: '',
};

/**
 * Store reativo para gerenciamento de Pets usando BehaviorSubject
 * 
 * Padrão Singleton - apenas uma instância em toda aplicação
 */
class PetStore {
  private readonly _state = new BehaviorSubject<PetState>(initialState);
  public readonly state$: Observable<PetState> = this._state.asObservable();

  // Observables específicos (evita re-renders desnecessários)
  public readonly pets$: Observable<Pet[]> = this._state.pipe(
    map(state => state.pets),
    distinctUntilChanged()
  );

  public readonly selectedPet$: Observable<PetDetailsDTO | null> = this._state.pipe(
    map(state => state.selectedPet),
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

  // Observable combinado para UI complexa
  public readonly viewModel$ = combineLatest([
    this.pets$,
    this.loading$,
    this.error$,
    this.pagination$
  ]).pipe(
    map(([pets, loading, error, pagination]) => ({
      pets,
      loading,
      error,
      pagination,
      hasPets: pets.length > 0,
      isEmpty: !loading && pets.length === 0,
    }))
  );

  private searchSubject = new Subject<string>();
  constructor() {
    this.searchSubject.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((term) => {
        // Only set loading if we don't have items to show, preventing flicker
        // If we have items, we keep showing them until new results arrive
        if (this.currentState.pets.length === 0) {
          this.setState({ loading: true, error: null, currentPage: 0, searchTerm: term });
        } else {
          this.setState({ error: null, currentPage: 0, searchTerm: term });
        }

        return from(petFacade.getPets(0, 10, term)).pipe(
          catchError(error => {
            this.setState({
              error: error instanceof Error ? error.message : 'Erro ao buscar pets',
              loading: false
            });
            return [];
          })
        );
      })
    ).subscribe((response: any) => {
      if (Array.isArray(response) && response.length === 0 && this.currentState.pets.length > 0) {
      }

      // Let's rewrite the subscription handler to be safer.
      if (Array.isArray(response)) {
        // This is the error fallback []
        return;
      }

      this.setState({
        pets: response.items,
        currentPage: 0,
        totalPages: response.total_pages,
        loading: false,
      });
    });
  }

  /**
   * Getter para estado atual (snapshot)
   */
  get currentState(): PetState {
    return this._state.value;
  }

  /**
   * Atualiza o estado (imutável)
   */
  private setState(partial: Partial<PetState>): void {
    this._state.next({
      ...this.currentState,
      ...partial,
    });
  }

  async loadPets(page: number = 0, size: number = 10): Promise<void> {
    // Only show loading if we are empty (first load)
    if (this.currentState.pets.length === 0) {
      this.setState({ loading: true, error: null });
    } else {
      this.setState({ error: null });
    }

    try {
      const { searchTerm } = this.currentState;
      const response = await petFacade.getPets(page, size, searchTerm || undefined);

      this.setState({
        pets: response.items,
        currentPage: page,
        totalPages: response.total_pages,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Erro ao carregar pets',
        loading: false,
      });
    }
  }

  searchPets(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  async loadPetDetails(id: string): Promise<void> {
    this.setState({ loadingDetails: true, error: null });

    try {
      const pet = await petFacade.getPetById(id);

      this.setState({
        selectedPet: pet,
        loadingDetails: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Erro ao carregar detalhes',
        loadingDetails: false,
      });
    }
  }

  async createPet(data: {
    nome: string;
    raca: string;
    idade: number;
    foto?: File;
  }): Promise<void> {
    this.setState({ loading: true, error: null });

    try {
      const newPet = await petFacade.createPet(data);

      this.setState({
        pets: [newPet, ...this.currentState.pets],
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Erro ao criar pet',
        loading: false,
      });
      throw error;
    }
  }

  async updatePet(id: string, data: {
    nome: string;
    raca: string;
    idade: number;
    foto?: File;
  }): Promise<void> {
    this.setState({ loading: true, error: null });

    try {
      const updatedPet = await petFacade.updatePet(id, data);

      this.setState({
        pets: this.currentState.pets.map(pet =>
          pet.id === parseInt(id) ? updatedPet : pet
        ),
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Erro ao atualizar pet',
        loading: false,
      });
      throw error;
    }
  }

  async deletePet(id: string): Promise<void> {
    this.setState({ loading: true, error: null });

    try {
      await petFacade.deletePet(id);

      this.setState({
        pets: this.currentState.pets.filter(pet => pet.id !== parseInt(id)),
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Erro ao excluir pet',
        loading: false,
      });
      throw error;
    }
  }


  async nextPage(): Promise<void> {
    const { currentPage, totalPages } = this.currentState;
    if (currentPage < totalPages - 1) {
      await this.loadPets(currentPage + 1, 10);
    }
  }


  async previousPage(): Promise<void> {
    const { currentPage } = this.currentState;
    if (currentPage > 0) {
      await this.loadPets(currentPage - 1, 10);
    }
  }


  clearError(): void {
    this.setState({ error: null });
  }


  clearSelectedPet(): void {
    this.setState({ selectedPet: null });
  }


  reset(): void {
    this._state.next(initialState);
  }
}

export const petStore = new PetStore();