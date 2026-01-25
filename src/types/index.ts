export interface Pet {
    id: number;
    name: string;
    breed: string;
    age: number;
    photo_url?: string;
    tutor_id?: number;
}

export interface Tutor {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    cpf: string;
    photo_url?: string;
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

export interface TutorFilters {
    name?: string;
    page?: number;
    limit?: number;
}

export * from './auth';
