import { Table, Tag, Button, Space, Card, message, Modal, Descriptions, Divider } from "antd";
import { CheckCircleOutlined, EyeOutlined, SwapOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { transferApi } from "../../api/transfer.api";
import type { TransferOrderDto, TransferOrderItemDto } from "../../types/transfer";
import dayjs from "dayjs";

export default function TransferList() {
  const [data, setData] = useState<TransferOrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  
  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await transferApi.query();
      setData(res.data);
    } catch (error) {
      message.error("Không thể tải danh sách phiếu chuyển kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const showDetail = async (id: string) => {
    try {
      const res = await transferApi.get(id);
      setSelectedOrder(res.data);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết");
    }
  };

  const handleApprove = (id: string) => {
  Modal.confirm({
    title: "Xác nhận duyệt phiếu chuyển kho",
    content: "Hệ thống sẽ thực hiện trừ tồn kho ở vị trí nguồn và cộng vào vị trí đích. Bạn có chắc chắn không?",
    okText: "Duyệt ngay",
    okType: "danger",
    cancelText: "Hủy",
    onOk: async () => {
      try {
        await transferApi.approve(id);
        message.success("Duyệt phiếu chuyển kho thành công!");
        fetchTransfers(); // Load lại danh sách để cập nhật trạng thái mới
      } catch (error: any) {
        // Hiển thị lỗi từ Backend (ví dụ: "Không đủ tồn kho")
        const errorMsg = error.response?.data?.message || "Lỗi khi duyệt phiếu";
        message.error(errorMsg);
      }
    },
  });
};

  const columns = [
  { 
    title: "Mã phiếu", 
    dataIndex: "code", 
    key: "code",
    render: (text: string) => <b>{text}</b> 
  },
  { 
    title: "Từ kho", 
    dataIndex: "fromWarehouseName", // Dùng Name thay vì ID
    key: "fromWarehouseName",
  },
  { 
    title: "Đến kho", 
    dataIndex: "toWarehouseName", // Dùng Name thay vì ID
    key: "toWarehouseName",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status: string) => {
      let color = status === "Approved" ? "green" : (status === "Cancelled" ? "red" : "blue");
      return <Tag color={color}>{status?.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_: any, record: any) => (
      <Space size="middle">
        <Button icon={<EyeOutlined />} onClick={() => showDetail(record.id)} size="small">Chi tiết</Button>
        {record.status === "Draft" && (
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={() => handleApprove(record.id)} 
            size="small"
            style={{ backgroundColor: '#52c41a', border: 'none' }}
          >
            Duyệt
          </Button>
        )}
      </Space>
    ),
  },
];

  return (
    <Card title={<span><SwapOutlined /> Quản lý lệnh chuyển kho</span>}>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Chi tiết phiếu: ${selectedOrder?.code || ""}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={900}
        footer={[<Button key="close" onClick={() => setIsModalVisible(false)}>Đóng</Button>]}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã phiếu">{selectedOrder.code}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedOrder.status === "Approved" ? "green" : "blue"}>{selectedOrder.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Từ Kho (ID)">{selectedOrder.fromWarehouseId}</Descriptions.Item>
              <Descriptions.Item label="Đến Kho (ID)">{selectedOrder.toWarehouseId}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>{selectedOrder.note || "---"}</Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" {...({} as any)}>Danh sách mặt hàng</Divider>

            <Table
              dataSource={selectedOrder.items}
              rowKey={(record: TransferOrderItemDto) => `${record.productId}-${record.fromLocationId}`}
              pagination={false}
              size="small"
              columns={[
                { title: "Mã SP (ID)", dataIndex: "productId", key: "productId" },
                { title: "Vị trí đi (ID)", dataIndex: "fromLocationId", key: "fromLocationId", ellipsis: true },
                { title: "Vị trí đến (ID)", dataIndex: "toLocationId", key: "toLocationId", ellipsis: true },
                { 
                  title: "Số lượng", 
                  dataIndex: "quantity", 
                  key: "quantity",
                  render: (val) => <b style={{ color: '#1890ff' }}>{val}</b>
                },
                { title: "Ghi chú", dataIndex: "note", key: "note" },
              ]}
            />
          </>
        )}
      </Modal>
    </Card>
  );
}