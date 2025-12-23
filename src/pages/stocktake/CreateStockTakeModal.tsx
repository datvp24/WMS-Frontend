import { Modal, Form, Select, Input, message } from "antd";
import { useEffect, useState } from "react";
import { stockTakeApi } from "../../api/stocktake.api";
// Giả sử bro đã có api lấy danh sách kho
import { warehouseApi } from "../../api/warehouse.api"; 

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CreateStockTakeModal({ visible, onCancel, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 1. Khai báo lại State với Interface chuẩn (Thay vì mảng rỗng)
const [warehouses, setWarehouses] = useState<any[]>([]); 

useEffect(() => {
  const fetchWarehouses = async () => {
    try {
      // 2. Truyền tham số cho hàm query (ví dụ: page 1, size 100)
      const res = await warehouseApi.query(1, 100); 
      
      // 3. Kiểm tra cấu trúc trả về. 
      // Nếu API trả về { items: [...], total: 10 }, ta lấy .items
      const list = Array.isArray(res.data) ? res.data : (res.data as any).items;
      setWarehouses(list || []);
    } catch (error) {
      message.error("Không thể tải danh sách kho");
    }
  };

  if (visible) {
    fetchWarehouses();
  }
}, [visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await stockTakeApi.create(values);
      message.success("Tạo phiếu kiểm kê thành công!");
      form.resetFields();
      onSuccess(); // Load lại danh sách ở trang cha
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo đợt kiểm kê mới"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Khởi tạo"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="warehouseId"
          label="Chọn kho kiểm kê"
          rules={[{ required: true, message: "Bắt đầu bằng việc chọn một kho" }]}
        >
          <Select placeholder="Chọn kho hàng">
            {warehouses.map((w: any) => (
              <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Ghi chú / Mục đích">
          <Input.TextArea placeholder="Ví dụ: Kiểm kê định kỳ cuối năm 2025" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}