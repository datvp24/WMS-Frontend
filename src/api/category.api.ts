// src/api/category.api.ts
import type { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from "../types/category";
import http from "./http";

const baseUrl = "/category";

export const categoryApi = {
    getAll: () => http.get<CategoryDto[]>(baseUrl),
    get: (id: number) => http.get<CategoryDto>(`${baseUrl}/${id}`),
    create: (payload: CreateCategoryDto) => http.post(baseUrl, payload),
    update: (id: number, payload: UpdateCategoryDto) => http.put(`${baseUrl}/${id}`, payload),
    delete: (id: number) => http.delete(`${baseUrl}/${id}`)
};
