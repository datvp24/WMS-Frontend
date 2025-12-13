// src/types/product.ts
export interface Product {
    id: number;
    code: string;
    name: string;
    description?: string;
    categoryId: number;
    unitId: number;
    brandId: number;
    supplierId: number;
    isActive: boolean;
    createAt: string;
}


export interface CreateProductDto {
    code: string;
    name: string;
    description?: string;
    categoryId: number;
    unitId: number;
    brandId: number;
    supplierId: number;
}

export interface UpdateProductDto {
    name: string;
    code: string;
    description?: string;
    categoryId: number;
    unitId: number;
    brandId: number;
    supplierId: number;
    isActive: boolean;
}

export interface ProductFilterDto {
    keyword?: string;
    categoryId?: number;
    brandId?: number;
    supplierId?: number;
    page: number;
    pageSize: number;
}

// src/types/product.ts
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

