import { Card, Form, Input, Button, message, Switch, Select, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { locationApi } from "../../api/location.api";
import { warehouseApi } from "../../api/warehouse.api";
import { useEffect, useState } from "react";

export default function LocationCreate() {
  const { warehouseId: warehouseIdParam } = useParams<{ warehouseId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [warehouses, setWarehouses] = useState<{ id: string; name: string; code: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách warehouse từ backend
  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const res = await warehouseApi.query(1, 999);
        const items = res.data.items.map((w: any) => ({
          id: w.id,
          name: w.name,
          code: w.code || "N/A",
        }));
        setWarehouses(items);

        // Nếu có warehouseId từ URL → set giá trị dropdown
        if (warehouseIdParam) {
          const found = items.find((w) => w.id === warehouseIdParam);
          if (found) {
            form.setFieldsValue({ warehouseId: warehouseIdParam });
          }
        }
      } catch {
        message.error("Không tải được danh sách kho");
      } finally {
        setLoading(false);
      }
    };
    loadWarehouses();
  }, [warehouseIdParam, form]);

  const onFinish = async (values: any) => {
    try {
      await locationApi.create(values.warehouseId, {
        warehouseId: values.warehouseId,
        code: values.code,
        description: values.description || null,
      });
      message.success("Location created");
      navigate(`/warehouse/${values.warehouseId}/locations`);
    } catch (err) {
      message.error("Failed to create location");
    }
  };

  return (
    <Card title="Create Location">
      {loading ? (
        <Spin tip="Đang tải danh sách kho..." style={{ display: "block", margin: "60px auto" }} />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
          <Form.Item
            label="Kho"
            name="warehouseId"
            rules={[{ required: true, message: "Vui lòng chọn kho" }]}
          >
            <Select placeholder="Chọn kho">
              {warehouses.map((w) => (
                <Select.Option key={w.id} value={w.id}>
                  [{w.code}] {w.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Mã vị trí"
            name="code"
            rules={[
              { required: true, message: "Vui lòng nhập mã vị trí" },
              {
                pattern: /^[A-Z]\d-\d{2}-\d{2}$/, // ví dụ: A1-01-03
                message: "Mã vị trí phải theo định dạng A1-01-03",
              },
            ]}
          >
            <Input placeholder="A1-01-03" maxLength={8} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() =>
                navigate(
                  `/warehouse/${form.getFieldValue("warehouseId") || ""}/locations`
                )
              }
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
}
