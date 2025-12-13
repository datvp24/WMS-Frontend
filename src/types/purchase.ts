export interface PurchaseOrderDto {
  id: string;
  code: string;
  supplierId: number;
  items: {
    productId: string;
    quantity: number;
    locationId: string;
    price?: number;
  }[];
  status?: string;
  createdAt: string;
  updatedAt?: string;
}


export interface PurchaseQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
  poId?: string;
}
// types/purchase.ts
export interface PurchaseItemForm {
  productId: string;
  quantity: number;
}

export interface PurchaseOrderCreateRequest {
  supplierId: number;
  code: string;
  items: PurchaseItemForm[];
}
export interface GoodsReceiptItemDto {
  productId: string;
  productName?: string;
  quantity: number;
  receivedQuantity?: number; // nếu muốn track số lượng đã nhận
}

export interface GoodsReceiptDto {
  id: string;
  code: string;
  poIds: string;
  warehouseId: string;
  createdAt: string;
  updatedAt?: string;
  items: GoodsReceiptItemDto[];
}

export interface GoodsReceiptCreateRequest {
  code: string;
  PurchaseOrderId: string;
  warehouseId: string;
  items: {
    productId: string;
    locationId: string;
    quantity: number;
  }[];
}
