import { Button, Table, message, Select } from "antd";
import { useEffect, useState } from "react";
import { inventoryApi } from "../../api/inventory.api";
import { warehouseApi } from "../../api/warehouse.api";
import { locationApi } from "../../api/location.api";
import type { InventoryDto } from "../../types/inventory";

interface LocationDto {
  id: string;
  code: string;
}

export default function InventoryList() {
  const [data, setData] = useState<InventoryDto[]>([]);
  const [warehouseId, setWarehouseId] = useState<string>();
  const [locationId, setLocationId] = useState<string>();

  const [warehouses, setWarehouses] = useState<{ label: string; value: string }[]>([]);
  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);
  const [locationMap, setLocationMap] = useState<Record<string, string>>({});

  // =========================
  // LOAD WAREHOUSE + LOCATION MAP
  // =========================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const wRes = await warehouseApi.query(1, 100);
        setWarehouses(
          wRes.data.items.map((w: any) => ({
            label: w.name,
            value: w.id,
          }))
        );

        const locMap: Record<string, string> = {};
        for (const w of wRes.data.items) {
          const locRes = await locationApi.list(w.id);
          locRes.data.forEach((l: LocationDto) => {
            locMap[l.id] = l.code;
          });
        }
        setLocationMap(locMap);
      } catch {
        message.error("Failed to fetch warehouses / locations");
      }
    };

    fetchAll();
  }, []);

  // =========================
  // LOAD LOCATIONS BY WAREHOUSE
  // =========================
  const handleWarehouseChange = async (id?: string) => {
    setWarehouseId(id);
    setLocationId(undefined);
    setLocations([]);

    if (!id) return;

    try {
      const res = await locationApi.list(id);
      setLocations(
        res.data.map((l: LocationDto) => ({
          label: l.code,
          value: l.id,
        }))
      );
    } catch {
      message.error("Failed to fetch locations");
    }
  };

  // =========================
  // FETCH INVENTORY
  // =========================
  const fetchData = async () => {
    try {
      const res = await inventoryApi.query({
        warehouseId,
        locationId,
      });
      setData(res.data);
    } catch {
      message.error("Failed to fetch inventory");
    }
  };

  useEffect(() => {
    fetchData();
  }, [warehouseId, locationId]);

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    { title: "Inventory ID", dataIndex: "id", key: "id" },
    {
      title: "Warehouse",
      dataIndex: "warehouseId",
      key: "warehouse",
      render: (id: string) =>
        warehouses.find((w) => w.value === id)?.label || id,
    },
    {
      title: "Location",
      dataIndex: "locationId",
      key: "location",
      render: (id: string) => locationMap[id] || id,
    },
    { title: "Product ID", dataIndex: "productId", key: "productId" },

    // 🔥 DTO mới
    {
      title: "On Hand",
      dataIndex: "onHandQuantity",
      key: "onHandQuantity",
    },
    {
      title: "Locked",
      dataIndex: "lockedQuantity",
      key: "lockedQuantity",
    },
    {
      title: "Available",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: InventoryDto) => (
        <Button
          type="link"
          onClick={() =>
            window.open(
              `/inventory/${record.productId}/history`,
              "_blank"
            )
          }
        >
          View History
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* FILTER */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Select
          placeholder="Warehouse"
          allowClear
          style={{ width: 200 }}
          options={warehouses}
          onChange={handleWarehouseChange}
        />

        <Select
          placeholder="Location"
          allowClear
          style={{ width: 200 }}
          options={locations}
          value={locationId}
          onChange={(v) => setLocationId(v)}
        />

        <Button onClick={fetchData}>Filter</Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 20 }}
      />
    </>
  );
}
