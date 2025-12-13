import { useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  message,
  Tag,
  Select,
  Spin,
  Empty,
  Typography,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { locationApi } from "../../api/location.api";
import { warehouseApi } from "../../api/warehouse.api";
import WmsTable from "../../components/Wmstable";
import PageHeader from "../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import type { LocationDto } from "../../types/location";

const { Text } = Typography;

export default function LocationList() {
  const navigate = useNavigate();
  const { warehouseId } = useParams<{ warehouseId: string }>();

  const [data, setData] = useState<LocationDto[]>([]);
  // CẬP NHẬT ĐÚNG TYPE: có thêm code
  const [warehouses, setWarehouses] = useState<{ id: string; name: string; code: string }[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Load danh sách kho
  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const res = await warehouseApi.query(1, 999);
        const items = res.data.items.map((w: any) => ({
          id: w.id,
          name: w.name,
          code: w.code || "N/A", // phòng trường hợp backend thiếu
        }));
        setWarehouses(items);
      } catch {
        message.error("Không tải được danh sách kho");
      }
    };
    loadWarehouses();
  }, []);

  // Tự động chọn kho từ URL
  useEffect(() => {
    if (warehouseId && warehouses.length > 0) {
      const found = warehouses.find((w) => w.id === warehouseId);
      if (found) {
        setSelectedWarehouseId(warehouseId);
      } else {
        message.warning("Kho không tồn tại hoặc đã bị xóa");
      }
    }
  }, [warehouseId, warehouses]);

  // Load locations khi chọn kho
  useEffect(() => {
    if (!selectedWarehouseId) {
      setData([]);
      return;
    }

    const loadLocations = async () => {
      setLoading(true);
      try {
        const res = await locationApi.list(selectedWarehouseId);
        setData(res.data);
      } catch {
        message.error("Không tải được danh sách vị trí");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, [selectedWarehouseId]);

  const getStatusTag = (isActive: boolean) =>
    isActive ? (
      <Tag color="green">Hoạt động</Tag>
    ) : (
      <Tag color="red">Ngừng hoạt động</Tag>
    );

  const currentWarehouse = warehouses.find((w) => w.id === selectedWarehouseId);

  return (
    <>
      <PageHeader
        title={
          currentWarehouse
            ? `Vị trí lưu trữ - ${currentWarehouse.name} [${currentWarehouse.code}]`
            : "Vị trí lưu trữ"
        }
        button={
          selectedWarehouseId && (
            <Button
              type="primary"
              onClick={() =>
                navigate(`/warehouse/${selectedWarehouseId}/locations/create`)
              }
            >
              + Tạo vị trí mới
            </Button>
          )
        }
      />

      {/* Chọn kho */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ marginRight: 12 }}>Chọn kho:</Text>
        <Select
          showSearch
          placeholder="Chọn kho để xem vị trí"
          optionFilterProp="children"
          value={selectedWarehouseId}
          onChange={setSelectedWarehouseId}
          style={{ width: 380 }}
          loading={warehouses.length === 0}
          filterOption={(input, option) =>
            String(option?.children).toLowerCase().includes(input.toLowerCase())
          }
        >
          {warehouses.map((w) => (
            <Select.Option key={w.id} value={w.id}>
              [{w.code}] {w.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Bảng vị trí */}
      {loading ? (
        <Spin tip="Đang tải vị trí..." style={{ display: "block", margin: "60px auto" }} />
      ) : !selectedWarehouseId ? (
        <Empty description="Vui lòng chọn một kho để xem danh sách vị trí" />
      ) : data.length === 0 ? (
        <Empty description="Kho này chưa có vị trí nào. Hãy tạo vị trí đầu tiên!" />
      ) : (
        <WmsTable
          dataSource={data}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          columns={[
            {
              title: "Mã vị trí",
              dataIndex: "code",
              width: 150,
              fixed: "left",
              sorter: (a: LocationDto, b: LocationDto) => a.code.localeCompare(b.code),
            },
            {
              title: "Kho",
              dataIndex: "warehouseId",
              width: 240,
              render: (id: string) => {
                const wh = warehouses.find((w) => w.id === id);
                return wh ? (
                  <Space>
                    <Tag color="blue">{wh.code}</Tag>
                    <Text strong>{wh.name}</Text>
                  </Space>
                ) : (
                  <Text type="secondary">{id}</Text>
                );
              },
            },
            {
              title: "Mô tả",
              dataIndex: "description",
              ellipsis: true,
              render: (text: string | undefined) =>
                text ? text : <Text type="secondary">—</Text>,
            },
            {
              title: "Trạng thái",
              dataIndex: "isActive",
              width: 120,
              align: "center",
              render: getStatusTag,
            },
            {
              title: "Ngày tạo",
              dataIndex: "createdAt",
              width: 160,
              render: (date: string) =>
                new Date(date).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            },
            {
              title: "Cập nhật lần cuối",
              dataIndex: "updatedAt",
              width: 160,
              render: (date: string | undefined) =>
                date ? (
                  new Date(date).toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                ) : (
                  <Text type="secondary">Chưa cập nhật</Text>
                ),
            },
            {
              title: "Hành động",
              width: 140,
              fixed: "right",
              render: (record: LocationDto) => (
                <Space size="middle">
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() =>
                      navigate(
                        `/warehouse/${selectedWarehouseId}/locations/edit/${record.id}`
                      )
                    }
                  >
                    Sửa
                  </Button>

                  <Popconfirm
                    title="Xóa vị trí này?"
                    onConfirm={async () => {
                      try {
                        await locationApi.delete(selectedWarehouseId!, record.id);
                        message.success("Đã xóa vị trí");
                        const res = await locationApi.list(selectedWarehouseId!);
                        setData(res.data);
                      } catch {
                        message.error("Xóa thất bại");
                      }
                    }}
                  >
                    <Button danger type="link" size="small" icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      )}
    </>
  );
}