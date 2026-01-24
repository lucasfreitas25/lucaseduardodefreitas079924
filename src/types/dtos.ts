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

export interface Tutor {
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
    tutores: Tutor[];
}

export interface PetResponseDTO {
    page: number;
    size: number;
    total: number;
    pageCount: number;
    content: PetDTO[];
}
