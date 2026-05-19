import {
  Badge,
  Button,
  Drawer,
  Empty,
  List,
  Tag,
  Typography,
  Tooltip,
  Space,
  Divider,
} from "antd";
import {
  BellOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useState } from "react";
import type { InventoryChange } from "../types/iinventory";
dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text } = Typography;

const FIELD_LABELS: Record<string, string> = {
  onHandQuantity: "Thực tồn",
  lockedQuantity: "Đã khóa",
  availableQuantity: "Khả dụng",
};

const FIELD_COLORS: Record<string, string> = {
  onHandQuantity: "blue",
  lockedQuantity: "orange",
  availableQuantity: "green",
};

interface Props {
  changes: InventoryChange[];
  unreadCount: number;
  isPolling: boolean;
  onMarkAllRead: () => void;
  onClear: () => void;
  /** Khi mở drawer → navigate đến inventory với filter */
  onNavigateToInventory?: () => void;
}

export default function InventoryChangeBell({
  changes,
  unreadCount,
  isPolling,
  onMarkAllRead,
  onClear,
  onNavigateToInventory,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onMarkAllRead();
  };

  // Hiện mới nhất lên đầu
const sorted = [...changes].sort(
  (a, b) =>
    new Date(b.changedAt).getTime() -
    new Date(a.changedAt).getTime()
);
  return (
    <>
      <Tooltip
        title={
          unreadCount > 0
            ? `${unreadCount} thay đổi tồn kho mới`
            : "Lịch sử thay đổi tồn kho"
        }
      >
        <Badge count={unreadCount} overflowCount={99} offset={[-2, 2]}>
          <Button
            type="text"
            shape="circle"
            icon={
              isPolling ? (
                <SyncOutlined spin style={{ color: "#1677ff" }} />
              ) : (
                <BellOutlined
                  style={{
                    fontSize: 20,
                    color: unreadCount > 0 ? "#faad14" : "#666",
                  }}
                />
              )
            }
            onClick={handleOpen}
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Badge>
      </Tooltip>

      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>🔔 Thay đổi tồn kho</span>
            <Space>
              {onNavigateToInventory && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    setOpen(false);
                    onNavigateToInventory();
                  }}
                >
                  Xem tồn kho →
                </Button>
              )}
              <Tooltip title="Xóa tất cả">
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onClear}
                  disabled={changes.length === 0}
                />
              </Tooltip>
            </Space>
          </div>
        }
        open={open}
        onClose={() => setOpen(false)}
        width={420}
        bodyStyle={{ padding: 0 }}
      >
        {sorted.length === 0 ? (
          <div style={{ padding: 40 }}>
            <Empty description="Chưa có thay đổi nào được ghi nhận" />
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Hệ thống tự động kiểm tra mỗi 30 giây
              </Text>
            </div>
          </div>
        ) : (
          <List
            dataSource={sorted}
            renderItem={(c) => {
              const isIncrease = c.delta > 0;
              const deltaAbs = Math.abs(c.delta);

              return (
                <List.Item
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    background: "#fff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <div style={{ width: "100%" }}>
                    {/* Dòng 1: Tên sản phẩm + delta badge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Text strong style={{ fontSize: 13 }}>
                        {c.productName}
                      </Text>

                      <Tag
                        color={isIncrease ? "success" : "error"}
                        icon={
                          isIncrease ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )
                        }
                        style={{ fontSize: 13, fontWeight: 700, margin: 0 }}
                      >
                        {isIncrease ? "+" : "-"}
                        {deltaAbs.toLocaleString()}
                      </Tag>
                    </div>

                    {/* Dòng 2: SKU + Lot */}
                    <div style={{ marginBottom: 6 }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        SKU: {c.productCode} &nbsp;|&nbsp; Lot:{" "}
                        <Tag
                          color="cyan"
                          style={{ margin: 0, fontSize: 11, padding: "0 4px" }}
                        >
                          {c.lotCode}
                        </Tag>
                      </Text>
                    </div>

                    {/* Dòng 3: Vị trí + kho */}
                    <div style={{ marginBottom: 6 }}>
                      <Tag color="blue" style={{ fontSize: 11 }}>
                        {c.locationCode}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {c.warehouseName}
                      </Text>
                    </div>

                    {/* Dòng 4: Field + old→new + thời gian */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Space size={4}>
                        <Tag
                          color={FIELD_COLORS[c.field]}
                          style={{ fontSize: 11, margin: 0 }}
                        >
                          {FIELD_LABELS[c.field]}
                        </Tag>
                        <Text style={{ fontSize: 12 }}>
                          <Text delete type="secondary">
                            {c.oldValue.toLocaleString()}
                          </Text>
                          {" → "}
                          <Text strong>{c.newValue.toLocaleString()}</Text>
                        </Text>
                      </Space>

                      <Text
                        type="secondary"
                        style={{ fontSize: 11 }}
                        title={dayjs(c.changedAt).format("DD/MM/YYYY HH:mm:ss")}
                      >
                        {dayjs(c.changedAt).fromNow()}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </Drawer>
    </>
  );
}