// src/api/customer.api.ts
import http from "./http";
import type { CustomerDto, CreateCustomerDto, UpdateCustomerDto } from "../types/customer";

const baseUrl = "/customer";

export const customerApi = {
    getAll: () => http.get<CustomerDto[]>(baseUrl),
    get: (id: number) => http.get<CustomerDto>(`${baseUrl}/${id}`),
    create: (payload: CreateCustomerDto) => http.post(baseUrl, payload),
    update: (id: number, payload: UpdateCustomerDto) => http.put(`${baseUrl}/${id}`, payload),
    delete: (id: number) => http.delete(`${baseUrl}/${id}`)
};
