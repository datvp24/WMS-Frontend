import { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Switch } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { locationApi } from "../../api/location.api";
import type { LocationDto, LocationUpdateDto } from "../../types/location";

export default function LocationEdit() {
  const { warehouseId, id } = useParams<{ warehouseId: string; id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await locationApi.getById(warehouseId!, id!);
        const loc: LocationDto = res.data;

        form.setFieldsValue({
          code: loc.code,
          description: loc.description,
          isActive: loc.isActive,
        });
      } catch {
        message.error("Failed to load location");
        navigate(`/warehouse/${warehouseId}/locations`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [warehouseId, id, form, navigate]);

  const onFinish = async (values: any) => {
    try {
      const payload: LocationUpdateDto = {
        id: id!,
        code: values.code?.toUpperCase().trim(),
        description: values.description?.trim() || "",
        isActive: values.isActive,
      };
      await locationApi.update(warehouseId!, id!, payload);
      message.success("Location updated");
      navigate(`/warehouse/${warehouseId}/locations`);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <Card title="Edit Location" loading={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please enter location code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(`/warehouse/${warehouseId}/locations`)}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
