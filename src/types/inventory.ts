// Inventory DTO (frontend)
export interface InventoryDto {
    id: string;
    warehouseId: string;
    locationId: string;
    productId: number;
    onHandQuantity: number;         // trước là quantity
    lockedQuantity: number;
    availableQuantity: number;      // onHand - locked
    inTransitQuantity?: number;     // optional
    createdAt: string;
    updatedAt?: string | null;
}

export interface InventoryHistoryDto {
    id: string;
    warehouseId: string;
    locationId: string;
    productId: number;
    quantityChange: number;
    actionType: InventoryActionType | string;  // enum hoặc string
    referenceCode?: string;
    note?: string;
    createdAt: string;
}

// Query params
export interface InventoryQueryParams {
    warehouseId?: string;
    locationId?: string;
    productId?: number;
    productIds?: number[];           // hỗ trợ query nhiều sản phẩm
}

// Adjust request
export interface InventoryAdjustRequest {
    warehouseId: string;
    locationId: string;
    productId: number;
    qtyChange: number;
    actionType: InventoryActionType;  // enum, không string
    refCode?: string;
    note?: string;
}

// Lock/Unlock request
export interface InventoryLockRequest {
    warehouseId: string;
    locationId: string;
    productId: number;
    quantity: number;
    lock?: boolean;                   // true: lock, false: unlock
}

// Enum actionType
export const InventoryActionType = {
    Receive: "Receive",
    Issue: "Issue",
    AdjustIncrease: "AdjustIncrease",
    AdjustDecrease: "AdjustDecrease",
    TransferIn: "TransferIn",
    TransferOut: "TransferOut",
} as const;

export type InventoryActionType = typeof InventoryActionType[keyof typeof InventoryActionType];
