import {
  Button,
  message,
  Select,
  Typography,
  Tag,
  Tooltip,
  Badge,
} from "antd";
import { useEffect, useState, useCallback } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  HistoryOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

import { inventoryApi } from "../../api/inventory.api";
import { warehouseApi } from "../../api/warehouse.api";
import { locationApi } from "../../api/location.api";

import InventoryAdjustForm from "./InventoryAdjustForm";
import PageHeader from "../../components/PageHeader";
import InventoryLockActions from "./InventoryLockAction";
import WmsTable from "../../components/Wmstable";
import type { InventoryDto } from "../../types/inventory";
import InventoryHistoryModal from "./InventoryHistory";
import PutawayModal from "./PutawayModal";
import type { InventoryChange } from "../../types/iinventory";
import { useInventoryChangeContext } from "../../context/InventoryChangeContext";

import dayjs from "dayjs";

const { Text } = Typography;

const LOCATION_TYPE_LABELS: Record<number, string> = {
  1: "Receiving",
  2: "Storage",
  3: "Shipping",
  4: "Damage",
  5: "Return",
  6: "Picking",
};

// ─── Delta badge ──────────────────────────────────────────────────────────────
function DeltaBadge({ delta, field }: { delta: number; field: string }) {
  const isPos = delta > 0;
  const abs   = Math.abs(delta);

  const fieldLabel: Record<string, string> = {
    onHandQuantity:    "Thực tồn",
    availableQuantity: "Khả dụng",
    lockedQuantity:    "Khóa",
  };

  return (
    <Tooltip title={`${fieldLabel[field] ?? field}: ${isPos ? "+" : ""}${delta.toLocaleString()}`}>
      <span
        style={{
          display:    "inline-flex",
          alignItems: "center",
          gap:        2,
          fontSize:   11,
          fontWeight: 700,
          lineHeight: "16px",
          padding:    "1px 5px",
          borderRadius: 4,
          background: isPos ? "#f6ffed" : "#fff2f0",
          color:      isPos ? "#52c41a" : "#ff4d4f",
          border:     `1px solid ${isPos ? "#b7eb8f" : "#ffccc7"}`,
          whiteSpace: "nowrap",
        }}
      >
        {isPos
          ? <ArrowUpOutlined style={{ fontSize: 9 }} />
          : <ArrowDownOutlined style={{ fontSize: 9 }} />}
        {isPos ? "+" : "-"}{abs.toLocaleString()}
      </span>
    </Tooltip>
  );
}

// ─── Tổng hợp tất cả field thay đổi của 1 row ────────────────────────────────
function RowDeltaSummary({ changes }: { changes: InventoryChange[] }) {
  if (!changes || changes.length === 0) return null;

  const latestByField = new Map<string, InventoryChange>();
  for (const c of changes) latestByField.set(c.field, c);

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
      {Array.from(latestByField.values()).map((c) => (
        <DeltaBadge key={c.field} delta={c.delta} field={c.field} />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function InventoryList() {
  const [data,              setData]              = useState<InventoryDto[]>([]);
  const [warehouseId,       setWarehouseId]       = useState<string>();
  const [locationId,        setLocationId]        = useState<string>();
  const [loading,           setLoading]           = useState(false);
  const [isAdjustOpen,      setIsAdjustOpen]      = useState(false);
  const [isHistoryOpen,     setIsHistoryOpen]     = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [isPutawayOpen,     setIsPutawayOpen]     = useState(false);
  const [putawayData,       setPutawayData]       = useState<{
    productId:      number;
    warehouseId:    string;
    fromLocationId: string;
    lotId:          string;
    maxQty:         number;
  } | null>(null);
  const [warehouses, setWarehouses] = useState<{ label: string; value: string }[]>([]);
  const [locations,  setLocations]  = useState<{ label: string; value: string }[]>([]);

  const { changedIds, changesByInventoryId, markAllRead } = useInventoryChangeContext();

  // Stable key khớp với key BE broadcast
  const rowKey = (r: InventoryDto) =>
    `${r.productId}-${r.locationCode}-${r.lotCode || "N/A"}`;

  // =========================
  // LOAD WAREHOUSE
  // =========================
  useEffect(() => {
    warehouseApi.query(1, 10000).then((res) => {
      setWarehouses(res.data.items.map((w: any) => ({ label: w.name, value: w.id })));
    });
  }, []);

  // =========================
  // FETCH INVENTORY
  // =========================
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.query({ warehouseId, locationId });
      setData(res.data);
    } catch {
      message.error("Lỗi tải dữ liệu tồn kho");
    } finally {
      setLoading(false);
    }
  }, [warehouseId, locationId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Vào trang → đánh dấu đã đọc
  useEffect(() => { markAllRead(); }, []);

  // ✅ Sort: rows có thay đổi lên đầu, trong nhóm đó sort theo thời gian mới nhất
  const sortedData = [...data].sort((a, b) => {
    const keyA  = rowKey(a);
    const keyB  = rowKey(b);
    const hasA  = changedIds.has(keyA);
    const hasB  = changedIds.has(keyB);

    // Khác nhóm → có thay đổi lên trước
    if (hasA && !hasB) return -1;
    if (!hasA && hasB) return 1;

    // Cùng nhóm "có thay đổi" → mới nhất lên đầu
    if (hasA && hasB) {
      const latestA = (changesByInventoryId.get(keyA) ?? []).at(-1)?.changedAt ?? "";
      const latestB = (changesByInventoryId.get(keyB) ?? []).at(-1)?.changedAt ?? "";
      return latestB.localeCompare(latestA);
    }

    return 0;
  });

  // =========================
  // CHANGE WAREHOUSE
  // =========================
  const handleWarehouseChange = async (id?: string) => {
    setWarehouseId(id);
    setLocationId(undefined);
    if (!id) { setLocations([]); return; }
    const res = await locationApi.list(id);
    setLocations(res.data.map((l: any) => ({ label: l.code, value: l.id })));
  };

  // =========================
  // OPEN PUTAWAY
  // =========================
  const handleOpenPutaway = (record: InventoryDto) => {
    const targetWarehouseId = record.warehouseId || warehouseId;
    if (!targetWarehouseId) {
      message.warning("Vui lòng chọn kho trước khi Putaway");
      return;
    }
    setPutawayData({
      productId:      record.productId,
      warehouseId:    targetWarehouseId,
      fromLocationId: record.locationId,
      lotId:          record.lotId,
      maxQty:         record.availableQuantity,
    });
    setIsPutawayOpen(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <PageHeader
        title="Quản lý tồn kho"
        button={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAdjustOpen(true)}>
            Điều chỉnh kho
          </Button>
        }
      />

      {/* FILTER */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <Select
          placeholder="Tìm kho theo tên..."
          allowClear showSearch
          style={{ width: 220 }}
          options={warehouses}
          onChange={handleWarehouseChange}
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
          }
        />
        <Select
          placeholder="Vị trí"
          allowClear
          style={{ width: 180 }}
          options={locations}
          value={locationId}
          onChange={setLocationId}
          disabled={!warehouseId}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>Lọc</Button>

        {/* ✅ Hiện số dòng đang có biến động */}
        {changedIds.size > 0 && (
          <Tag color="orange" style={{ margin: 0, fontSize: 12 }}>
            ⚡ {changedIds.size} dòng có biến động — đã đưa lên đầu
          </Tag>
        )}
      </div>

      {/* TABLE — dùng sortedData thay vì data */}
      <WmsTable
        loading={loading}
        dataSource={sortedData}
        rowKey={(record: InventoryDto) => record.id}
        scroll={{ x: 1400 }}
        rowClassName={(record: InventoryDto) =>
          changedIds.has(rowKey(record)) ? "inventory-row-changed" : ""
        }
        expandable={{
          expandedRowRender: (record: InventoryDto) => (
            <InventoryLockActions record={record} onSuccess={fetchData} />
          ),
          rowExpandable: (record: InventoryDto) =>
            record.availableQuantity > 0 || record.lockedQuantity > 0,
        }}
        columns={[
          // ── Sản phẩm ──────────────────────────────────────────────
          {
            title: "Sản phẩm",
            key: "product",
            width: 240,
            fixed: "left",
            render: (_: any, record: InventoryDto) => {
              const key       = rowKey(record);
              const hasChange = changedIds.has(key);
              const changes   = changesByInventoryId.get(key) ?? [];

              return (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                  {hasChange && (
                    <Badge dot color="#52c41a" style={{ marginTop: 7, flexShrink: 0 }} />
                  )}
                  <div>
                    <Text strong>{record.productName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      SKU: {record.productCode}
                    </Text>
                    {/* Badges tổng hợp tất cả field thay đổi */}
                    <RowDeltaSummary changes={changes} />
                  </div>
                </div>
              );
            },
          },

          // ── Số lô ─────────────────────────────────────────────────
          {
            title: "Số Lô (Lot)",
            dataIndex: "lotCode",
            width: 150,
            render: (lot: string, record: InventoryDto) => (
              <div>
                <Tag color="cyan" style={{ fontWeight: "bold" }}>{lot || "N/A"}</Tag>
                {record.expiryDate && record.expiryDate !== "1900-12-31T16:53:30" && (
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                    <CalendarOutlined /> {dayjs(record.expiryDate).format("DD/MM/YYYY")}
                  </div>
                )}
              </div>
            ),
          },

          // ── Vị trí / Kho ──────────────────────────────────────────
          {
            title: "Vị trí / Kho",
            key: "location_warehouse",
            width: 200,
            render: (_: any, record: InventoryDto) => (
              <div>
                <Tag color="blue">{record.locationCode}</Tag>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  <Text type="secondary">{record.warehouseName}</Text>
                </div>
              </div>
            ),
          },

          // ── Loại vị trí ───────────────────────────────────────────
          {
            title: "Loại vị trí",
            dataIndex: "locationType",
            align: "center",
            width: 120,
            render: (type?: number) => (
              <Tag color={type === 1 ? "gold" : "default"}>
                {LOCATION_TYPE_LABELS[type!] || "-"}
              </Tag>
            ),
          },

          // ── Thực tồn ──────────────────────────────────────────────
          {
            title: "Thực tồn",
            dataIndex: "onHandQuantity",
            align: "right",
            width: 130,
            render: (v: number, record: InventoryDto) => {
              const changes = changesByInventoryId.get(rowKey(record)) ?? [];
              const latest  = changes
                .filter((c: InventoryChange) => c.field === "onHandQuantity")
                .at(-1);
              return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                  <Text strong style={{ fontSize: 14 }}>{v.toLocaleString()}</Text>
                  {latest && <DeltaBadge delta={latest.delta} field="onHandQuantity" />}
                </div>
              );
            },
          },

          // ── Khả dụng ──────────────────────────────────────────────
          {
            title: "Khả dụng",
            dataIndex: "availableQuantity",
            align: "right",
            width: 130,
            render: (v: number, record: InventoryDto) => {
              const changes = changesByInventoryId.get(rowKey(record)) ?? [];
              const latest  = changes
                .filter((c: InventoryChange) => c.field === "availableQuantity")
                .at(-1);
              return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                  <Text type="success" strong style={{ fontSize: 14 }}>{v.toLocaleString()}</Text>
                  {latest && <DeltaBadge delta={latest.delta} field="availableQuantity" />}
                </div>
              );
            },
          },

          // ── Hành động ─────────────────────────────────────────────
          {
            title: "Hành động",
            width: 180,
            fixed: "right",
            align: "center",
            render: (_: any, record: InventoryDto) => {
              const canPutaway = record.locationType === 1 && record.availableQuantity > 0;
              return (
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                  <Tooltip title="Xem lịch sử">
                    <Button
                      size="small"
                      icon={<HistoryOutlined />}
                      onClick={() => {
                        setSelectedProductId(String(record.productId));
                        setIsHistoryOpen(true);
                      }}
                    />
                  </Tooltip>
                  {canPutaway && (
                    <Button size="small" type="primary" onClick={() => handleOpenPutaway(record)}>
                      Putaway
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]}
      />

      {/* CSS highlight */}
      <style>{`
        .inventory-row-changed td {
          background-color: #fffbe6 !important;
          transition: background-color 0.4s;
        }
        .inventory-row-changed:hover td {
          background-color: #fff1b8 !important;
        }
      `}</style>

      {/* ADJUST */}
      <InventoryAdjustForm
        open={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        onSuccess={() => { setIsAdjustOpen(false); fetchData(); }}
      />

      {/* HISTORY */}
      <InventoryHistoryModal
        open={isHistoryOpen}
        productId={selectedProductId}
        onCancel={() => setIsHistoryOpen(false)}
      />

      {/* PUTAWAY */}
      <PutawayModal
        open={isPutawayOpen}
        productId={putawayData?.productId ?? null}
        warehouseId={putawayData?.warehouseId}
        fromLocationId={putawayData?.fromLocationId}
        lotId={putawayData?.lotId}
        maxQty={putawayData?.maxQty}
        onClose={() => { setIsPutawayOpen(false); setPutawayData(null); }}
        onSuccess={() => { setIsPutawayOpen(false); setPutawayData(null); fetchData(); }}
      />
    </div>
  );
}