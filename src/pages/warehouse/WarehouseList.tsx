import { useEffect, useState } from "react";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { warehouseApi } from "../../api/warehouse.api";
import WmsTable from "../../components/Wmstable";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import type { WarehouseDto } from "../../types/warehouse";

const { Text } = Typography;

export default function WarehouseList() {
  const navigate = useNavigate();

  const [data, setData] = useState<WarehouseDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await warehouseApi.query(page, pageSize, search);
      setData(res.data.items);
      setTotal(res.data.total);
    } catch {
      message.error("Không tải được danh sách kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, pageSize, search]);

  const handleLock = async (id: string) => {
    try {
      await warehouseApi.lock(id);
      message.success("Đã khóa kho");
      load();
    } catch {
      message.error("Không thể khóa kho");
    }
  };

  const handleUnlock = async (id: string) => {
    try {
      await warehouseApi.unlock(id);
      message.success("Đã mở khóa kho");
      load();
    } catch {
      message.error("Không thể mở khóa");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await warehouseApi.delete(id);
      message.success("Đã xóa kho");
      load();
    } catch {
      message.error("Không thể xóa kho (còn vị trí hoặc đang sử dụng)");
    }
  };

  // Hỗ trợ cả string và number cho status
  const isWarehouseActive = (status: any): boolean => {
    if (typeof status === "string") {
      return status.toLowerCase() === "active";
    }
    if (typeof status === "number") {
      return status === 1;
    }
    return false;
  };

  const getStatusTag = (status: WarehouseDto["status"]) => {
    if (typeof status === "string") {
      const s = status.toLowerCase();
      if (s === "active") return <Tag color="green">Hoạt động</Tag>;
      if (s === "locked") return <Tag color="red">Đã khóa</Tag>;
      if (s === "maintenance") return <Tag color="orange">Bảo trì</Tag>;
      return <Tag color="default">{status}</Tag>;
    }
    // nếu là số
    if (status === 1) return <Tag color="green">Hoạt động</Tag>;
    if (status === 3) return <Tag color="red">Đã khóa</Tag>;
    if (status === 4) return <Tag color="orange">Bảo trì</Tag>;
    return <Tag color="default">{status}</Tag>;
  };

  return (
    <>
      <PageHeader
        title="Quản lý kho"
        button={
          <Button type="primary" onClick={() => navigate("/warehouse/create")}>
            + Tạo kho mới
          </Button>
        }
      />

      <Input.Search
        placeholder="Tìm kiếm theo mã, tên kho hoặc ID..."
        style={{ width: 400, marginBottom: 16 }}
        allowClear
        onSearch={(value) => {
          setSearch(value.trim());
          setPage(1);
        }}
      />

      <WmsTable
        loading={loading}
        dataSource={data}
        rowKey="id"
        scroll={{ x: 1300 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page: number, pageSize?: number) => {
            setPage(page);
            setPageSize(pageSize ?? 10);
          },
        }}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            width: 110,
            fixed: "left",
            render: (id: string) => (
              <Text
                copyable={{ text: id }}
                style={{ fontFamily: "monospace", fontSize: 11, color: "#666" }}
              >
                {id.slice(0, 8)}...
              </Text>
            ),
          },
          {
            title: "Mã kho",
            dataIndex: "code",
            width: 120,
            sorter: true,
          },
          {
            title: "Tên kho",
            dataIndex: "name",
            sorter: true,
          },
          {
            title: "Địa chỉ",
            dataIndex: "address",
            ellipsis: true,
            render: (text: string | null) => text || <Text type="secondary">—</Text>,
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            width: 120,
            align: "center",
            render: getStatusTag,
          },
          // {
          //   title: "Vị trí",
          //   dataIndex: "locationCount",
          //   width: 90,
          //   align: "center",
          //   render: (count: number | undefined) => count ?? 0,
          // },
          {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 110,
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
          },
          {
            title: "Hành động",
            width: 280,
            fixed: "right",
            render: (_: any, record: WarehouseDto) => {
              const active = isWarehouseActive(record.status);

              return (
                <Space size="small">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate(`/warehouse/edit/${record.id}`)}
                  >
                    Sửa
                  </Button>

                  {active ? (
                    <Popconfirm
                      title="Khóa kho này?"
                      onConfirm={() => handleLock(record.id)}
                    >
                      <Button
                        danger
                        type="link"
                        size="small"
                        icon={<LockOutlined />}
                      >
                        Khóa
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="Mở khóa kho?"
                      onConfirm={() => handleUnlock(record.id)}
                    >
                      <Button
                        type="link"
                        size="small"
                        icon={<UnlockOutlined />}
                      >
                        Mở khóa
                      </Button>
                    </Popconfirm>
                  )}

                  <Popconfirm
                    title="Xóa kho này? Không thể khôi phục!"
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button danger type="link" size="small">
                      Xóa
                    </Button>
                  </Popconfirm>

                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate(`/warehouse/${record.id}/locations`)}
                    disabled={!active}
                  >
                    <Tooltip title={!active ? "Kho không hoạt động" : ""}>
                      Vị trí
                    </Tooltip>
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}