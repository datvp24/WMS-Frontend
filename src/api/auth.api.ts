import http from "./http";
import type { LoginRequestDto} from "../types/auth";

export const authApi = {

    login: (dto: LoginRequestDto) => http.post("/Auth/login", dto),

    assignRole: (userId: number, roleId: number) =>
        http.post(`/Auth/assign-role?userId=${userId}&roleId=${roleId}`),

    assignPermission: (userId: number, permissionId: number) =>
        http.post(`/Auth/assign-permission?userId=${userId}&permissionId=${permissionId}`),
    getAll: () => http.get("/Role"),
    
};
