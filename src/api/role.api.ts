import http from "./http";
import type {
    CreateRoleDto,
    UpdateRoleDto,
    AssignPermissionToRoleDto
} from "../types/role";

export const roleApi = {
    create: (dto: CreateRoleDto) =>
        http.post("/Role", dto),

    update: (id: number, dto: UpdateRoleDto) =>
        http.put(`/Role/${id}`, dto),

    delete: (id: number) =>
        http.delete(`/Role/${id}`), 

    assignPermission: (dto: AssignPermissionToRoleDto) =>
        http.post("/Role/assign-permission", dto),

    removePermission: (roleId: number, permissionId: number) =>
        http.delete(`/Role/remove-permission?roleId=${roleId}&permissionId=${permissionId}`),

    get: (id: number) =>
        http.get(`/Role/${id}`),

    getAll: () =>
        http.get("/Role"),
};
