export interface BrandDto {
    id: number;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;   // ISO string
}

export interface CreateBrandDto {
    code?: string | null;
    name: string;
    description?: string;
    isActive?: boolean;
}

export interface UpdateBrandDto {
    code?: string | null;
    name: string;
    description?: string;
    isActive: boolean;
}
