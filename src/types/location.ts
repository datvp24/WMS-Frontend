export interface LocationDto {
    id: string;                 // Guid
    warehouseId: string;
    code: string;               // ví dụ: A1-01-03
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface LocationCreateDto {
    warehouseId: string;
    code: string;
    description?: string | null;
}


export interface LocationUpdateDto {
    id: string;
    code?: string | null;
    description?: string | null;
    isActive?: boolean | null;
}
