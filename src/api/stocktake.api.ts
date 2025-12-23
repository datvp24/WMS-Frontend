import http from "./http";
import type { StockTakeDto, CreateStockTakeDto, SubmitCountDto } from "../types/stocktake";

const baseUrl = "/stocktake";

export const stockTakeApi = {
  // Lấy danh sách
  query: (params?: { page?: number; pageSize?: number }) => 
    http.get<StockTakeDto[]>(baseUrl, { params }),

  // Chi tiết
  get: (id: string) => 
    http.get<StockTakeDto>(`${baseUrl}/${id}`),

  // Tạo mới
  create: (payload: CreateStockTakeDto) => 
    http.post<StockTakeDto>(baseUrl, payload),

  // Chốt số liệu bắt đầu đếm
  start: (id: string) => 
    http.post<StockTakeDto>(`${baseUrl}/${id}/start`),

  // Lưu kết quả đếm
  submitCounts: (payload: SubmitCountDto) => 
    http.post<StockTakeDto>(`${baseUrl}/submit-counts`, payload),

  // Hoàn tất (Chốt lệch)
  complete: (id: string) => 
    http.post<StockTakeDto>(`${baseUrl}/${id}/complete`),
};