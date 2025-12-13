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
    query: (params: InventoryQueryParams) => http.get<InventoryDto[]>(baseUrl, { params }),
    history: (productId: number) => http.get<InventoryHistoryDto[]>(`${baseUrl}/product/${productId}/history`),
    adjust: (payload: InventoryAdjustRequest) => http.post(`${baseUrl}/adjust`, payload),
    lock: (payload: InventoryLockRequest) => http.post(`${baseUrl}/lock`, payload),
    unlock: (payload: InventoryLockRequest) => http.post(`${baseUrl}/unlock`, payload)
};
