export interface InventoryChange {
  id: string;

  productId: number;
  productName: string;
  productCode: string;

  locationCode: string;
  warehouseName: string;

  lotCode: string;

  field: "onHandQuantity" | "lockedQuantity" | "availableQuantity";

  oldValue: number;
  newValue: number;

  delta: number;

  changedAt: string;
}