// src/api/unit.api.ts
import http from "./http";
import type { UnitDto, CreateUnitDto, UpdateUnitDto } from "../types/unit";

const baseUrl = "/unit";

export const unitApi = {
    getAll: () => http.get<UnitDto[]>(baseUrl),
    get: (id: number) => http.get<UnitDto>(`${baseUrl}/${id}`),
    create: (payload: CreateUnitDto) => http.post(baseUrl, payload),
    update: (id: number, payload: UpdateUnitDto) => http.put(`${baseUrl}/${id}`, payload),
    delete: (id: number) => http.delete(`${baseUrl}/${id}`),
};
