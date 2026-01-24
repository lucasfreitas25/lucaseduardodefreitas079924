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

export interface PetResponseDTO {
    page: number;
    size: number;
    total: number;
    pageCount: number;
    content: PetDTO[];
}
