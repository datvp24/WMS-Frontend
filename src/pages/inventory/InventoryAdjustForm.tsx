// src/pages/inventory/InventoryAdjustForm.tsx
import { Button, Form, InputNumber, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { warehouseApi } from "../../api/warehouse.api";
import { locationApi } from "../../api/location.api";
import { productApi } from "../../api/product.api";
import { inventoryApi } from "../../api/inventory.api";
import type { WarehouseDto } from "../../types/warehouse";
import type { Product } from "../../types/product";

export default function InventoryAdjustForm() {
  const [form] = Form.useForm();

  const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Backend-supported actions
  const actions = [
    "Receive",
    "Issue",
    "AdjustIncrease",
    "AdjustDecrease",
    "TransferIn",
    "TransferOut",
    "StockCount",
  ];

  // Load warehouse + product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const whRes = await warehouseApi.query(1, 100);
        setWarehouses(whRes.data.items);

        const prodRes = await productApi.getAll();
        setProducts(prodRes.data);
      } catch {
        message.error("Failed to fetch master data");
      }
    };
    fetchData();
  }, []);

  // Load locations by warehouse
  const handleWarehouseChange = async (warehouseId: string) => {
    form.setFieldsValue({ locationId: undefined });
    try {
      const res = await locationApi.list(warehouseId);
      setLocations(res.data);
    } catch {
      message.error("Failed to fetch locations");
    }
  };

  // Submit
  const onFinish = async (values: any) => {
    try {
      await inventoryApi.adjust({
        warehouseId: values.warehouseId,
        locationId: values.locationId,
        productId: values.productId,
        qtyChange: values.qtyChange,
        actionType: values.actionType, // ✅ đúng DTO mới
        refCode: values.refCode,
        note: values.note,
      });

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
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select warehouse"
          onChange={handleWarehouseChange}
          options={warehouses.map(w => ({
            label: w.name,
            value: w.id
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Location"
        name="locationId"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select location"
          options={locations.map(l => ({
            label: l.code ?? l.name,
            value: l.id
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Product"
        name="productId"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select product"
          options={products.map(p => ({
            label: p.name,
            value: p.id
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Quantity Change"
        name="qtyChange"
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Action"
        name="actionType"
        rules={[{ required: true }]}
      >
        <Select options={actions.map(a => ({ label: a, value: a }))} />
      </Form.Item>

      <Form.Item label="Reference Code" name="refCode">
        <Input />
      </Form.Item>

      <Form.Item label="Note" name="note">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Adjust Inventory
        </Button>
      </Form.Item>
    </Form>
  );
}
