// src/types/customer.ts

export interface CustomerDto {
    id: number;
    code: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    createdAt: string; // ISO string từ backend
}

export interface CreateCustomerDto {
    code: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface UpdateCustomerDto {
    code: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
}
