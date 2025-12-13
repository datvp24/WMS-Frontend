export interface WarehouseDto {
  id: number;
  code: string;
  name: string;
  status: number;
  createdAt: string;
}

export interface LocationDto {
  id: number;
  warehouseId: number;
  code: string;
  description: string;
  status: number;
  createdAt: string;
}
