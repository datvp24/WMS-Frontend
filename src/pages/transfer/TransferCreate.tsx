import { Form, Input, InputNumber, Button, Select, Card, Space, Divider, message, Row, Col, Typography, Tooltip } from "antd";
import { MinusCircleOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transferApi } from "../../api/transfer.api";
import { warehouseApi } from "../../api/warehouse.api";
import { locationApi } from "../../api/location.api";
import { productApi } from "../../api/product.api";
import { inventoryApi } from "../../api/inventory.api";
import type { TransferOrderDto } from "../../types/transfer";

const { Text } = Typography;

export default function TransferCreate() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Master Data
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [fromLocations, setFromLocations] = useState<any[]>([]);
  const [toLocations, setToLocations] = useState<any[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({}); // key: locationId-productId, value: availableQty

  useEffect(() => {
    // Load warehouses & products
    warehouseApi.query(1, 100).then((res: any) => setWarehouses(res.data.items || res.data));
    productApi.filter({ page: 1, pageSize: 100 }).then((res: any) => setProducts(res.data.items || res.data));
  }, []);

  // Load locations và inventory khi chọn kho
  const onFromWarehouseChange = async (warehouseId: string) => {
    const res = await locationApi.list(warehouseId);
    setFromLocations(res.data);

    // Reset vị trí cũ
    const items = form.getFieldValue("items");
    if (items) {
      const newItems = items.map((item: any) => ({ ...item, fromLocationId: undefined }));
      form.setFieldsValue({ items: newItems });
    }

    // Load inventory khả dụng
    // Load inventory khả dụng
const invRes = await inventoryApi.query({ warehouseId });
const map: Record<string, number> = {};
(invRes.data || []).forEach((inv: any) => {
  map[`${inv.locationId}-${inv.productId}`] = inv.onHandQuantity - inv.lockedQuantity;
});
setInventoryMap(map);
  };

  const onToWarehouseChange = async (warehouseId: string) => {
    const res = await locationApi.list(warehouseId);
    setToLocations(res.data);

    // Reset vị trí cũ
    const items = form.getFieldValue("items");
    if (items) {
      const newItems = items.map((item: any) => ({ ...item, toLocationId: undefined }));
      form.setFieldsValue({ items: newItems });
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: TransferOrderDto = {
        fromWarehouseId: values.fromWarehouseId,
        toWarehouseId: values.toWarehouseId,
        note: values.note,
        items: values.items.map((item: any) => ({
          productId: Number(item.productId),
          fromLocationId: item.fromLocationId,
          toLocationId: item.toLocationId,
          quantity: Number(item.quantity),
          note: item.itemNote
        }))
      };

      await transferApi.create(payload);
      message.success("Tạo phiếu chuyển kho thành công!");
      navigate("/transfer"); 
    } catch (error: any) {
      const errorDetail = error.response?.data?.errors;
      if (errorDetail) {
        message.error(Object.values(errorDetail).flat().join(", "));
      } else {
        message.error(error.response?.data?.message || "Lỗi khi tạo phiếu");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={<span><SwapOutlined /> Lập lệnh chuyển kho</span>}>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ items: [{}] }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Mã phiếu" name="code" rules={[{ required: true, message: 'Cần nhập mã!' }]}>
              <Input placeholder="TRF-0001" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Từ Kho" name="fromWarehouseId" rules={[{ required: true }]}>
              <Select placeholder="Chọn kho nguồn" onChange={onFromWarehouseChange}>
                {warehouses.map(w => <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Đến Kho" name="toWarehouseId" rules={[{ required: true }]}>
              <Select placeholder="Chọn kho đích" onChange={onToWarehouseChange}>
                {warehouses.map(w => <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú tổng quát" name="note">
          <Input.TextArea rows={2} placeholder="Lý do chuyển kho..." />
        </Form.Item>

        <Divider>Chi tiết sản phẩm</Divider>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const productId = form.getFieldValue(['items', name, 'productId']);
                const fromLocationId = form.getFieldValue(['items', name, 'fromLocationId']);
                const availableQty = inventoryMap[`${fromLocationId}-${productId}`] || 0;

                return (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "productId"]}
                      rules={[{ required: true, message: "Chọn SP" }]}
                      style={{ width: 200 }}
                    >
                      <Select placeholder="Sản phẩm" showSearch optionFilterProp="children">
                        {products.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "fromLocationId"]}
                      rules={[{ required: true, message: "Chọn ô nguồn" }]}
                      style={{ width: 140 }}
                    >
                      <Select placeholder="Vị trí đi" disabled={fromLocations.length === 0}>
                        {fromLocations.map(l => <Select.Option key={l.id} value={l.id}>{l.code}</Select.Option>)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "toLocationId"]}
                      rules={[
                        { required: true, message: "Chọn ô đích" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue(['items', name, 'fromLocationId']) !== value) return Promise.resolve();
                            return Promise.reject(new Error('Trùng vị trí!'));
                          }
                        })
                      ]}
                      style={{ width: 140 }}
                    >
                      <Select placeholder="Vị trí đến" disabled={toLocations.length === 0}>
                        {toLocations.map(l => <Select.Option key={l.id} value={l.id}>{l.code}</Select.Option>)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        { required: true, message: "Nhập SL" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || !productId || !fromLocationId) return Promise.resolve();
                            if (value > availableQty) {
                              return Promise.reject(new Error(`SL vượt tồn khả dụng (${availableQty})`));
                            }
                            return Promise.resolve();
                          }
                        })
                      ]}
                    >
                      <InputNumber min={0.01} placeholder="SL" style={{ width: 80 }} />
                    </Form.Item>

                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {availableQty > 0 ? `Tồn khả dụng: ${availableQty}` : ""}
                    </Text>

                    <Form.Item {...restField} name={[name, "itemNote"]}>
                      <Input placeholder="Ghi chú dòng" style={{ width: 150 }} />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                );
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            Lưu phiếu chuyển (Draft)
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
