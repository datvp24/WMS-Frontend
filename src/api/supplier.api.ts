import http from "./http";
import type { SupplierDto, CreateSupplierDto, UpdateSupplierDto } from "../types/supplier";

const baseUrl = "/supplier";

export const supplierApi = {
    getAll: () => http.get<SupplierDto[]>(baseUrl),
    get: (id: number) => http.get<SupplierDto>(`${baseUrl}/${id}`),
    create: (payload: CreateSupplierDto) => http.post(baseUrl, payload),
    update: (id: number, payload: UpdateSupplierDto) => http.put(`${baseUrl}/${id}`, payload),
    delete: (id: number) => http.delete(`${baseUrl}/${id}`)
};
