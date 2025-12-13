// src/types/category.ts
export interface CategoryDto {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    createAt: string;
}

export interface CreateCategoryDto {
    code: string;
    name: string;
    isActive: boolean;
}

export interface UpdateCategoryDto {
    code: string;
    name: string;
    isActive: boolean;
}
