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

  // Load all warehouses & locations
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const wRes = await warehouseApi.query(1, 100);
        setWarehouses(wRes.data.items.map((w) => ({ label: w.name, value: w.id })));

        const locMap: Record<string, string> = {};
        for (const w of wRes.data.items) {
          const locRes = await locationApi.list(w.id);
          locRes.data.forEach((l: LocationDto) => {
            locMap[l.id] = l.code;
          });
        }
        setLocationMap(locMap);
      } catch {
        message.error("Failed to fetch warehouses/locations");
      }
    };
    fetchAll();
  }, []);

  // Load locations when warehouse filter changes (for dropdown)
  const handleWarehouseChange = async (id: string) => {
    setWarehouseId(id);
    setLocationId(undefined);

    try {
      const res = await locationApi.list(id);
      setLocations(res.data.map((l: LocationDto) => ({ label: l.code, value: l.id })));
    } catch {
      message.error("Failed to fetch locations");
    }
  };

  // Fetch inventory data
  const fetchData = async () => {
    try {
      const res = await inventoryApi.query({ warehouseId, locationId });
      setData(res.data);
    } catch {
      message.error("Failed to fetch inventory");
    }
  };

  useEffect(() => {
    fetchData();
  }, [warehouseId, locationId]);

  const columns = [
    { title: "Inventory ID", dataIndex: "id", key: "id" },
    {
      title: "Warehouse",
      dataIndex: "warehouseId",
      key: "warehouse",
      render: (id: string) => warehouses.find((w) => w.value === id)?.label || id,
    },
    {
      title: "Location",
      dataIndex: "locationId",
      key: "location",
      render: (id: string) => locationMap[id] || id,
    },
    { title: "Product ID", dataIndex: "productId", key: "productId" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Locked Quantity", dataIndex: "lockedQuantity", key: "lockedQuantity" },
    {
    title: "Action",
    key: "action",
    render: (_: any, record: InventoryDto) => (
      <Button
        type="link"
        onClick={() => window.open(`/inventory/${record.productId}/history`, "_blank")}
      >
        View History
      </Button>
    ),
  },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Select
          placeholder="Warehouse"
          onChange={handleWarehouseChange}
          allowClear
          style={{ width: 200 }}
          options={warehouses}
        />
        <Select
          placeholder="Location"
          onChange={(v) => setLocationId(v)}
          allowClear
          style={{ width: 200 }}
          options={locations}
        />
        <Button onClick={fetchData}>Filter</Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={data} />
    </>
  );
}
