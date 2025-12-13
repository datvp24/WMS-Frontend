// src/pages/inventory/InventoryAdjustForm.tsx
import { Button, Form, InputNumber, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { warehouseApi } from "../../api/warehouse.api";
import { locationApi } from "../../api/location.api";
import { productApi } from "../../api/product.api"; // giả sử bạn có getAll()
import type { WarehouseDto } from "../../types/warehouse";
import type { Product } from "../../types/product";
import { inventoryApi } from "../../api/inventory.api";

export default function InventoryAdjustForm() {
  const [form] = Form.useForm();

  const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const actions = [
    "Receive",
    "Issue",
    "TransferIn",
    "TransferOut",
    "AdjustIncrease",
    "AdjustDecrease",
    "StockCount",
  ];

  // Load warehouse + product list
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Warehouse: lấy page 1, 100 items
        const whRes = await warehouseApi.query(1, 100);
        setWarehouses(whRes.data.items);

        // Product: giả sử productApi.getAll()
        const prodRes = await productApi.getAll();
        setProducts(prodRes.data);
      } catch {
        message.error("Failed to fetch warehouses or products");
      }
    };
    fetchData();
  }, []);

  // Khi chọn warehouse, load locations
  const handleWarehouseChange = async (warehouseId: string) => {
    form.setFieldsValue({ locationId: undefined });
    try {
      const locRes = await locationApi.list(warehouseId);
      setLocations(locRes.data); // API trả về array
    } catch {
      message.error("Failed to fetch locations");
    }
  };

  const onFinish = async (values: any) => {
    try {
      await inventoryApi.adjust(values); // giả sử bạn có api này
      message.success("Inventory adjusted successfully");
      form.resetFields();
    } catch {
      message.error("Operation failed");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 500 }}>
      <Form.Item
        label="Warehouse"
        name="warehouseId"
        rules={[{ required: true, message: "Please select warehouse" }]}
      >
        <Select
          placeholder="Select warehouse"
          onChange={handleWarehouseChange}
          options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
        />
      </Form.Item>

      <Form.Item
        label="Location"
        name="locationId"
        rules={[{ required: true, message: "Please select location" }]}
      >
        <Select
          placeholder="Select location"
          options={locations.map((l) => ({ label: l.name, value: l.id }))}
        />
      </Form.Item>

      <Form.Item
        label="Product"
        name="productId"
        rules={[{ required: true, message: "Please select product" }]}
      >
        <Select
          placeholder="Select product"
          options={products.map((p) => ({ label: p.name, value: p.id }))}
        />
      </Form.Item>

      <Form.Item
        label="Quantity Change"
        name="qtyChange"
        rules={[{ required: true, message: "Please enter quantity change" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Action"
        name="action"
        rules={[{ required: true, message: "Please select action" }]}
      >
        <Select options={actions.map((a) => ({ label: a, value: a }))} />
      </Form.Item>

      <Form.Item label="Reference Code" name="refCode">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Adjust
        </Button>
      </Form.Item>
    </Form>
  );
}
