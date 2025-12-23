import { Card, Button, Form, InputNumber, Select, Table, message, Input, Space, Divider, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { salesApi } from "../../api/sale.api";
import { customerApi } from "../../api/customer.api";
import { productApi } from "../../api/product.api";
import { inventoryApi } from "../../api/inventory.api";

const { Text, Title } = Typography;

interface SOItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  maxQty: number; // tồn kho
}

export default function SaleOrderCreate() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string; price?: number }[]>([]);
  const [items, setItems] = useState<SOItem[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadProducts();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await customerApi.getAll();
      setCustomers(res.data);
    } catch {
      message.error("Lỗi tải khách hàng");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await productApi.getAll();
      setProducts(res.data);

      // Load inventory cho tất cả sản phẩm
      const invRes = await inventoryApi.query({ productIds: res.data.map(p => p.id) });

      const map: Record<number, number> = {};
      res.data.forEach(p => {
        const inv = invRes.data.find(i => i.productId === p.id);
        map[p.id] = inv ? inv.availableQuantity : 0; // nếu không có inventory = 0
      });
      setInventoryMap(map);
    } catch {
      message.error("Lỗi tải sản phẩm / tồn kho");
    }
  };

  const addItem = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (items.some(i => i.productId === productId)) {
      message.warning("Sản phẩm đã tồn tại");
      return;
    }

    const availableQty = inventoryMap[productId] ?? 0;

    setItems([
      ...items,
      {
        productId: product.id,
        productName: product.name,
        quantity: availableQty > 0 ? 1 : 0,
        unitPrice: product.price || 0,
        maxQty: availableQty,
      },
    ]);
  };

  const removeItem = (productId: number) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  const updateItem = (productId: number, field: keyof SOItem, value: number) => {
    setItems(
      items.map(i =>
        i.productId === productId
          ? { ...i, [field]: value }
          : i
      )
    );
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const onFinish = async (values: any) => {
    if (items.length === 0) {
      message.error("Vui lòng thêm sản phẩm");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerId: values.customerId,
        code: values.code,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      };
      await salesApi.create(payload);
      message.success("Tạo đơn hàng thành công");
      navigate("/sales/orders");
    } catch (error: any) {
      message.error("Lỗi khi lưu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={<Title level={4}>Tạo mới đơn bán hàng</Title>}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Space size="large" align="start">
          <Form.Item
            label="Khách hàng"
            name="customerId"
            rules={[{ required: true }]}
            style={{ width: 300 }}
          >
            <Select
              placeholder="Chọn khách hàng"
              options={customers.map(c => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>

          <Form.Item
            label="Mã đơn hàng"
            name="code"
            rules={[{ required: true }]}
            style={{ width: 250 }}
          >
            <Input placeholder="SO-0001" />
          </Form.Item>
        </Space>

        <Divider orientation={"left" as any}>Chi tiết sản phẩm</Divider>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Thêm sản phẩm: </Text>
          <Select
            showSearch
            placeholder="Tìm sản phẩm"
            style={{ width: 400, marginLeft: 10 }}
            options={products.map(p => ({
              value: p.id,
              label: `${p.name} (${inventoryMap[p.id] ?? 0} còn lại)`
            }))}
            onChange={val => val && addItem(Number(val))}
            value={undefined}
          />
        </div>

        <Table
          rowKey="productId"
          dataSource={items}
          pagination={false}
          bordered
          columns={[
            { title: "Sản phẩm", dataIndex: "productName" },
            {
              title: "Số lượng",
              width: 150,
              render: (_, record) => (
                <InputNumber
                  min={1}
                  max={record.maxQty}
                  value={record.quantity}
                  onChange={val => {
                    if (!val) return;
                    if (val > record.maxQty) {
                      message.warning(`Tồn kho chỉ còn ${record.maxQty}`);
                      return;
                    }
                    updateItem(record.productId, "quantity", val);
                  }}
                />
              ),
            },
            {
              title: "Đơn giá",
              width: 180,
              render: (_, record) => (
                <InputNumber
                  min={0}
                  value={record.unitPrice}
                  onChange={val => updateItem(record.productId, "unitPrice", val || 0)}
                />
              ),
            },
            {
              title: "Thành tiền",
              align: "right",
              render: (_, record) => (
                <Text>{(record.quantity * record.unitPrice).toLocaleString()} đ</Text>
              ),
            },
            {
              title: "Tồn kho",
              width: 100,
              render: (_, record) => (
                <Text type={record.maxQty === 0 ? "danger" : undefined}>
                  {record.maxQty}
                </Text>
              ),
            },
            {
              title: "Xóa",
              align: "center",
              render: (_, record) => (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeItem(record.productId)}
                />
              ),
            },
          ]}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3} align="right">
                  <Text strong>Tổng cộng:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text type="danger" strong style={{ fontSize: "16px" }}>
                    {calculateTotal().toLocaleString()} đ
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        <div style={{ marginTop: 24, textAlign: "right" }}>
          <Space>
            <Button onClick={() => navigate("/sales-orders")}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />}>
              Lưu đơn hàng
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}
