import { Form, Select, InputNumber, Button, message, Input, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { purchaseApi } from "../../api/purchase.api";
import { productApi } from "../../api/product.api";
import { supplierApi } from "../../api/supplier.api";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import type { SupplierDto } from "../../types/supplier";

interface PurchaseItemForm {
  productId: string;
  price: number;
  quantity: number;
}

interface PurchaseOrderCreateRequest {
  supplierId: number;
  code: string;
  items: PurchaseItemForm[];
}

export default function PurchaseForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll();
        setProducts(res.data);
      } catch {
        message.error("Failed to load products");
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await supplierApi.getAll();
        setSuppliers(res.data);
      } catch {
        message.error("Failed to load suppliers");
      }
    };

    fetchProducts();
    fetchSuppliers();
  }, []);

  const onFinish = async (values: any) => {
    if (!values.items || values.items.length === 0) {
      message.error("Please add at least one product");
      return;
    }

    const payload: PurchaseOrderCreateRequest = {
      supplierId: values.supplierId,
      code: values.code,
      items: values.items.map((i: any) => ({
        productId: i.productId,
        price: i.price,
        quantity: i.quantity,
      })),
    };

    try {
      await purchaseApi.createPOs(payload);
      message.success("PO created successfully");
      form.resetFields();
      navigate("/purchase");
    } catch {
      message.error("Failed to create PO");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
      <Form.Item
        label="Supplier"
        name="supplierId"
        rules={[{ required: true, message: "Supplier is required" }]}
      >
        <Select
          placeholder="Select supplier"
          options={suppliers.map((s) => ({ label: s.name, value: s.id }))}
        />
      </Form.Item>

      <Form.Item
        label="PO Code"
        name="code"
        rules={[{ required: true, message: "PO code is required" }]}
      >
        <Input />
      </Form.Item>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...field}
                  name={[field.name, "productId"]}
                  rules={[{ required: true, message: "Select product" }]}
                >
                  <Select
                    style={{ width: 200 }}
                    options={products.map((p) => ({ label: p.name, value: p.id }))}
                    placeholder="Select product"
                  />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, "quantity"]}
                  rules={[{ required: true, message: "Enter quantity" }]}
                >
                  <InputNumber min={1} placeholder="Quantity" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, "price"]}
                  rules={[{ required: true, message: "Enter price" }]}
                >
                  <InputNumber min={0} placeholder="Price" style={{ width: 100 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Product
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create PO
        </Button>
      </Form.Item>
    </Form>
  );
}
