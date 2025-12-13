import { Form, Input, InputNumber, Button, message, Select } from "antd";
import { useState, useEffect } from "react";
import { purchaseApi } from "../../api/purchase.api";
import { warehouseApi } from "../../api/warehouse.api";
import type { GoodsReceiptCreateRequest } from "../../types/purchase";
import { locationApi } from "../../api/location.api";
import type { LocationDto } from "../../types";
export default function GRCreate() {
  const [loading, setLoading] = useState(false);
  const [poList, setPoList] = useState<{ id: string; code: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; remaining: number }[]>([]);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [locations, setLocations] = useState<LocationDto[]>([]);

  // Load PO và warehouse khi component mount
  useEffect(() => {
    purchaseApi.getPOs({ status: "Approved" }).then(res => setPoList(res.data));
    warehouseApi.query(1, 100).then(res => setWarehouses(res.data.items));
  }, []);

  // Khi chọn PO → load products
  const onPOChange = async (poId: string) => {
    try {
      const res = await purchaseApi.getPO(poId);
      const po = res.data as any;
      setProducts(
        po.items?.map((i: any) => ({
          id: i.productId,
          name: i.productName,
          remaining: i.quantity - (i.receivedQuantity || 0),
        })) || []
      );
    } catch (error) {
      message.error("Failed to load products for selected PO");
      setProducts([]);
    }

  };

  // Submit GR
  const onFinish = async (values: any) => {
    setLoading(true);

    const payload: GoodsReceiptCreateRequest = {
      code: values.Code,
      PurchaseOrderId: values.poId,
      warehouseId: values.warehouseId,
      items: [
        {
          productId: values.productId,
          locationId: values.locationId,
          quantity: values.quantity,
        },
      ],
    };

    try {
      await purchaseApi.createGR(payload);
      message.success("GR created successfully");
    } catch (error) {
      message.error("Failed to create GR");
    } finally {
      setLoading(false);
    }
  };
  const onWarehouseChange = async (warehouseId: string) => {
  try {
    const res = await locationApi.list(warehouseId);
    setLocations(res.data); // lưu locations của warehouse
  } catch (error) {
    message.error("Failed to load locations for selected warehouse");
    setLocations([]);
  }
};


  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onFinish={onFinish}
      layout="horizontal"
    >
      {/* GR Code */}
      <Form.Item
        label="GR Code"
        name="Code"
        rules={[{ required: true, message: "GR Code is required" }]}
      >
        <Input placeholder="Enter GR Code" />
      </Form.Item>

      {/* Warehouse */}
      <Form.Item
        label="Warehouse"
        name="warehouseId"
        rules={[{ required: true, message: "Warehouse is required" }]}
      >
        <Select
          placeholder="Select Warehouse"
          onChange={onWarehouseChange}
        >
          {warehouses.map(w => (
            <Select.Option key={w.id} value={w.id}>
              {w.name} ({w.id})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Location"
        name="locationId"
        rules={[{ required: true, message: "Location is required" }]}
      >
        <Select placeholder="Select Location" disabled={locations.length === 0}>
          {locations.map(l => (
            <Select.Option key={l.id} value={l.id}>
              {l.code} ({l.id})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>


      {/* PO */}
      <Form.Item
        label="PO"
        name="poId"
        rules={[{ required: true, message: "PO is required" }]}
      >
        <Select placeholder="Select PO" onChange={onPOChange}>
          {poList.map(po => (
            <Select.Option key={po.id} value={po.id}>
              {po.code} ({po.id})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Product */}
      <Form.Item
        label="Product"
        name="productId"
        rules={[{ required: true, message: "Product is required" }]}
      >
        <Select placeholder="Select Product" disabled={products.length === 0}>
          {products.map(p => (
            <Select.Option key={p.id} value={p.id}>
              ID: {p.id} - remaining: {p.remaining}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Quantity */}
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Quantity is required" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>

      {/* Submit */}
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create GR
        </Button>
      </Form.Item>
    </Form>
  );
}
