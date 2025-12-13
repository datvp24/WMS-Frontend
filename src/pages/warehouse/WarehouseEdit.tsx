import { useEffect } from "react";
import { Card, Form, Input, Button, message, Tag, Popconfirm, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { warehouseApi } from "../../api/warehouse.api";
import type { WarehouseStatus } from "../../types/warehouse";

// Mapping đúng theo backend (99% là vậy)
const statusMap: Record<WarehouseStatus, number> = {
  Active: 1,
  Inactive: 2,
  Locked: 3,
  Maintenance: 4,
};

export default function WarehouseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await warehouseApi.getById(id!);
        const w = res.data;

        form.setFieldsValue({
          code: w.code,
          name: w.name,
          address: w.address || "",
          status: w.status, // giả sử backend trả string "Active"
        });
      } catch {
        message.error("Không tải được thông tin kho");
        navigate("/warehouse");
      }
    };
    load();
  }, [id, form, navigate]);

  const onFinish = async (values: any) => {
    try {
      const name = values.name?.trim();
      const address = values.address?.trim();
      const code = values.code?.trim().toUpperCase();

      if (!name || !address) {
        message.error("Vui lòng nhập đầy đủ tên kho và địa chỉ");
        return;
      }

      const payload = {
        name,
        code: code || undefined,
        address,
        status: statusMap[values.status as WarehouseStatus],
      };

      await warehouseApi.update(id!, payload);
      message.success("Cập nhật thành công");
      navigate("/warehouse");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors).flat().join(", "));
      } else {
        message.error("Cập nhật thất bại");
      }
    }
  };

  const handleLock = async () => {
    try {
      await warehouseApi.lock(id!);
      message.success("Đã khóa kho");
      navigate("/warehouse");
    } catch {
      message.error("Khóa kho thất bại");
    }
  };

  return (
    <Card title="Chỉnh sửa kho" extra={<Tag color="blue">ID: {id}</Tag>}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
            name="code"
            label="Mã kho"
            rules={[
              { required: true, message: "Vui lòng nhập mã kho" },
              { whitespace: true, message: "Mã kho không được để trống" },
              { pattern: /^[A-Z0-9_-]+$/, message: "Chỉ được dùng chữ hoa, số, gạch ngang và gạch dưới" },
            ]}
            normalize={(value) => value?.toUpperCase()} // tự động in hoa khi gõ
          >
          <Input placeholder="VD: HCM01, HN-WH, KTX01" maxLength={20} />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên kho"
          rules={[{ required: true, whitespace: true, message: "Nhập tên kho" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, whitespace: true, message: "Nhập địa chỉ" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Active"><Tag color="green">Hoạt động</Tag></Select.Option>
            <Select.Option value="Inactive"><Tag color="default">Ngừng hoạt động</Tag></Select.Option>
            <Select.Option value="Locked"><Tag color="red">Bị khóa</Tag></Select.Option>
            <Select.Option value="Maintenance"><Tag color="orange">Bảo trì</Tag></Select.Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <Popconfirm title="Khóa kho này?" onConfirm={handleLock}>
            <Button danger style={{ marginRight: 8 }}>Khóa kho</Button>
          </Popconfirm>
          <Button style={{ marginRight: 8 }} onClick={() => navigate("/warehouse")}>Hủy</Button>
          <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
        </div>
      </Form>
    </Card>
  );
}