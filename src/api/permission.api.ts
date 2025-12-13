import http from "./http";
import type {
    CreatePermissionDto,
    UpdatePermissionDto
} from "../types/permission";

export const permissionApi = {
    create: (dto: CreatePermissionDto) =>
        http.post("/Permission", dto),

    update: (id: number, dto: UpdatePermissionDto) =>
        http.put(`/Permission/${id}`, dto),

    delete: (id: number) =>
        http.delete(`/Permission/${id}`),

    getAll: () =>
        http.get("/Permission"),
};
