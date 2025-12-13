export interface SupplierDto {
    id: number;
    code: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    createdAt: string; // từ DB
}

export interface CreateSupplierDto {
    code: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface UpdateSupplierDto {
    code: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
}
