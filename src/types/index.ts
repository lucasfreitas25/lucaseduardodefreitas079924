export interface Pet {
    id: number;
    name: string;
    breed: string; // Espécie/Raça
    age: number;
    photo_url?: string;
    tutor_id?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface PetFilters {
    name?: string;
    page?: number;
    limit?: number;
}

export * from './auth';
