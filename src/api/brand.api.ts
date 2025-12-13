import http from "./http";
import type { CreateBrandDto, UpdateBrandDto } from "../types/brand";

export const brandApi = {
    getAll: () => http.get("/Brand"),
    getById: (id: number) => http.get(`/Brand/${id}`),
    create: (dto: CreateBrandDto) => http.post("/Brand", dto),
    update: (id: number, dto: UpdateBrandDto) => http.put(`/Brand/${id}`, dto),
    delete: (id: number) => http.delete(`/Brand/${id}`)
};
