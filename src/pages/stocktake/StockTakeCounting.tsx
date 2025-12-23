import { Table, InputNumber, Button, Card, Typography, message, Space, Tag } from "antd";
import { SaveOutlined, CheckSquareOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { stockTakeApi } from "../../api/stocktake.api";
// FIX 1: Thêm chữ 'type' vào đây
import type { StockTakeDto } from "../../types/stocktake"; 

const { Title, Text } = Typography;

export default function StockTakeCounting() {
  const { id } = useParams<{ id: string }>(); // Ép kiểu cho param
  const navigate = useNavigate();
  const [data, setData] = useState<StockTakeDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (id) fetchDetail(id); }, [id]);

  const fetchDetail = async (stockId: string) => {
    setLoading(true);
    try {
        const res = await stockTakeApi.get(stockId);
        setData(res.data);
    } catch (err) {
        message.error("Không thể tải chi tiết phiếu");
    } finally {
        setLoading(false);
    }
  };

  const onQtyChange = (val: number | null, index: number) => {
    if (!data) return;
    const items = [...data.items];
    items[index].countedQty = val || 0;
    setData({ ...data, items });
  };

  const handleSave = async () => {
    if (!data || !id) return;
    try {
        await stockTakeApi.submitCounts({
          stockTakeId: id,
          counts: data.items.map(i => ({ 
            locationId: i.locationId, 
            productId: i.productId, 
            countedQty: i.countedQty 
          }))
        });
        message.success("Đã lưu tạm kết quả!");
    } catch (err) {
        message.error("Lỗi khi lưu dữ liệu");
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    try {
        await stockTakeApi.complete(id);
        message.success("Kiểm kê hoàn tất. Tồn kho đã được điều chỉnh!");
        navigate("/stocktake");
    } catch (err: any) {
        message.error(err.response?.data?.message || "Lỗi khi hoàn tất");
    }
  };

  const columns = [
    { title: "Vị trí", dataIndex: "locationCode", key: "locationCode" },
    { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
    { title: "Hệ thống", dataIndex: "systemQty", key: "systemQty", align: 'center' as const },
    { 
      title: "Thực tế", 
      key: "countedQty",
      render: (_: any, record: any, index: number) => (
        <InputNumber 
            disabled={data?.status === 'Completed'} 
            min={0} 
            value={record.countedQty} 
            onChange={(v) => onQtyChange(v, index)} 
        />
      )
    },
    { 
      title: "Lệch", 
      key: "diff",
      render: (_: any, record: any) => {
        const diff = record.countedQty - record.systemQty;
        // FIX 2: Đổi bold -> strong
        return (
            <Text strong type={diff === 0 ? "secondary" : diff > 0 ? "success" : "danger"}>
                {diff > 0 ? `+${diff}` : diff}
            </Text>
        );
      }
    }
  ];

  return (
    <Card 
      title={
        <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/stocktake")} /> 
            <Title level={5} style={{margin:0}}>Phiếu: {data?.code}</Title>
        </Space>
      }
      extra={data?.status !== 'Completed' && (
        <Space>
          <Button icon={<SaveOutlined />} onClick={handleSave}>Lưu tạm</Button>
          <Button type="primary" icon={<CheckSquareOutlined />} onClick={handleComplete}>Hoàn tất</Button>
        </Space>
      )}
    >
      <div style={{ marginBottom: 16 }}>
        <Tag color="blue">Kho: {data?.warehouseName}</Tag>
        <Tag color="orange">Trạng thái: {data?.status}</Tag>
      </div>
      <Table 
        dataSource={data?.items} 
        columns={columns} 
        rowKey={(r) => `${r.locationId}-${r.productId}`} 
        pagination={false} 
        loading={loading} 
      />
    </Card>
  );
}