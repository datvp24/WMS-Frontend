import http from "./http";
import type {
    InventoryDto,
    InventoryHistoryDto,
    InventoryQueryParams,
    InventoryAdjustRequest,
    InventoryLockRequest
} from "../types/inventory";

const baseUrl = "/inventory";

export const inventoryApi = {
    get: (id: string) => http.get<InventoryDto>(`${baseUrl}/${id}`),

    query: (params: InventoryQueryParams) => 
        http.get<InventoryDto[]>(baseUrl, { params }),

    history: (productId: number) => 
        http.get<InventoryHistoryDto[]>(`${baseUrl}/product/${productId}/history`),

    adjust: (payload: InventoryAdjustRequest) => 
        http.post(`${baseUrl}/adjust`, payload),

    // Gộp lock/unlock thành 1 endpoint
    toggleLock: (payload: InventoryLockRequest) => 
        http.post(`${baseUrl}/lock-toggle`, payload),

    // Nếu muốn vẫn giữ 2 endpoint riêng
    // lock: (payload: InventoryLockRequest) => http.post(`${baseUrl}/lock-toggle`, { ...payload, lock: true }),
    // unlock: (payload: InventoryLockRequest) => http.post(`${baseUrl}/lock-toggle`, { ...payload, lock: false }),
};
