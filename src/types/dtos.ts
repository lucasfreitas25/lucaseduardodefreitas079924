export interface PetDTO {
    id: number;
    nome: string;
    raca: string;
    idade: number;
    foto?: {
        id: number;
        nome: string;
        contentType: string;
        url: string;
    };
}

export interface TutorDTO {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: string;
    foto?: {
        id: number;
        nome: string;
        contentType: string;
        url: string;
    };
}
export interface PetDetailsDTO {
    id: number;
    nome: string;
    raca: string;
    idade: number;
    foto?: {
        id: number;
        nome: string;
        contentType: string;
        url: string;
    };
    tutores: TutorDTO[];
}
export interface TutorDetailsDTO {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: string;
    foto?: {
        id: number;
        nome: string;
        contentType: string;
        url: string;
    };
    pets: PetDTO[];
}

export interface PetResponseDTO {
    page: number;
    size: number;
    total: number;
    pageCount: number;
    content: PetDTO[];
}
export interface TutorResponseDTO {
    page: number;
    size: number;
    total: number;
    pageCount: number;
    content: TutorDTO[];
}
