import http from "./http";

export const goodsIssueApi = {
  create: (payload: any) => http.post("/goodsissue", payload),
  query: (params?: any) => http.get("/goodsissue", { params }),
  get: (id: string) => http.get(`/goodsissue/${id}`),           // thêm get
  complete: (id: string) => http.post(`/goodsissue/${id}/complete`),
  cancel: (id: string) => http.post(`/goodsissue/${id}/cancel`) // thêm cancel
};
