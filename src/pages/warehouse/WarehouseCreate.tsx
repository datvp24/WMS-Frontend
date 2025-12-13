import { Button, Card, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { warehouseApi } from "../../api/warehouse.api";

export default function WarehouseCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await warehouseApi.create({
        code: values.code.trim().toUpperCase(),
        name: values.name.trim(),
        address: values.address?.trim() || null,
      });
      message.success("Tạo kho thành công!");
      navigate("/warehouse");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Tạo kho thất bại");
    }
  };

  const onCancel = () => {
    navigate("/warehouse");
  };

  return (
    <Card
      title="Tạo kho mới"
      style={{ maxWidth: 500, margin: "40px auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Mã kho"
          name="code"
          rules={[
            { required: true, message: "Vui lòng nhập mã kho" },
            {
              pattern: /^[A-Z0-9-]+$/,
              message: "Chỉ được dùng chữ hoa, số và dấu gạch ngang (-)",
            },
          ]}
        >
          <Input
            placeholder="HCM001"
            maxLength={20}
          />
        </Form.Item>

        <Form.Item
          label="Tên kho"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên kho" }]}
        >
          <Input placeholder="Kho Hồ Chí Minh 1" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea
            rows={3}
            placeholder="123 Đường ABC, Quận 1, TP.HCM..."
          />
        </Form.Item>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Tạo kho
          </Button>
        </div>
      </Form>
    </Card>
  );
}