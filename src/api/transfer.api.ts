import http from "./http";
import type { TransferOrderDto } from "../types/transfer";

const baseUrl = "/transfer";

export const transferApi = {
  // Lấy danh sách phiếu chuyển kho (phân trang + lọc status)
  query: (params?: { page?: number; pageSize?: number; status?: string }) => 
    http.get<TransferOrderDto[]>(baseUrl, { params }),

  // Lấy chi tiết một phiếu chuyển
  get: (id: string) => 
    http.get<TransferOrderDto>(`${baseUrl}/${id}`),

  // Tạo phiếu chuyển kho mới (Trạng thái Draft)
  create: (payload: any) => 
    http.post<TransferOrderDto>(baseUrl, payload),

  // Duyệt phiếu chuyển (Trừ kho nguồn - Cộng kho đích)
  approve: (id: string) => 
    http.post<TransferOrderDto>(`${baseUrl}/${id}/approve`),

  // Hủy phiếu chuyển
  cancel: (id: string) => 
    http.post<TransferOrderDto>(`${baseUrl}/${id}/cancel`),
};