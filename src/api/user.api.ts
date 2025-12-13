import http from "./http";
import type { CreateUserDto, UpdateUserDto } from "../types/user";

export const userApi = {
    getAll: () => http.get("/Auth"),
    getById: (id: number) => http.get(`/Auth/${id}`),
    create: (dto: CreateUserDto) => http.post("/Auth", dto),
    update: (id: number, dto: UpdateUserDto) => http.put(`/Auth/${id}`, dto),
    delete: (id: number) => http.delete(`/Auth/${id}`),
};
