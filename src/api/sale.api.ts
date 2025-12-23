export const salesApi = {
  query: (params?: any) => http.get("/salesorder", { params }),
  get: (id: string) => http.get(`/salesorder/${id}`),
  create: (payload: any) => http.post("/salesorder", payload),
  approve: (id: string) => http.post(`/salesorder/${id}/approve`),
  reject: (id: string) => http.post(`/salesorder/${id}/reject`)
};
import http from "./http";