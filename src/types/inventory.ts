export interface InventoryDto {
    id: string;
    warehouseId: string;
    locationId: string;
    productId: number;
    quantity: number;
    lockedQuantity: number;
    createdAt: string;
    updatedAt?: string; // có thể null
}

export interface InventoryHistoryDto {
    id: string;
    warehouseId: string;
    locationId: string;
    productId: number;
    quantityChange: number;
    actionType: string;
    referenceCode?: string;
    createdAt: string;
    updatedAt?: string;
}


export interface InventoryQueryParams {
    warehouseId?: string;
    locationId?: string;
    productId?: number;
}

export interface InventoryAdjustRequest {
    warehouseId: string;
    locationId: string;
    productId: number;
    qtyChange: number;
    action: string;      // Receive/Issue/AdjustIncrease/AdjustDecrease...
    refCode?: string;
}

export interface InventoryLockRequest {
    warehouseId: string;
    locationId: string;
    productId: number;
    quantity: number;
}
