export interface TransferOrderItemDto {
  productId: number;
  fromLocationId: string; // GUID
  toLocationId: string;   // GUID
  quantity: number;
  note?: string;
}

export interface TransferOrderDto {
  fromWarehouseId: string; // GUID
  toWarehouseId: string;   // GUID
  note?: string;
  items: TransferOrderItemDto[];
}
