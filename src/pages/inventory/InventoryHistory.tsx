import { Table, message, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { inventoryApi } from "../../api/inventory.api";
import { productApi } from "../../api/product.api";
import type { InventoryHistoryDto } from "../../types/inventory";
import type { Product } from "../../types/product";
import dayjs from "dayjs";

export default function InventoryHistory() {
  const { productId } = useParams<{ productId: string }>();
  const productIdNum = productId ? Number(productId) : undefined;

  const [data, setData] = useState<InventoryHistoryDto[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(
    productIdNum
  );

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productApi.getAll();
        setProducts(res.data);
      } catch {
        message.error("Failed to fetch products");
      }
    };
    loadProducts();
  }, []);

  // =========================
  // FETCH INVENTORY HISTORY
  // =========================
  const fetchData = async (pid: number) => {
    try {
      const res = await inventoryApi.history(pid);
      setData(res.data);
    } catch {
      message.error("Failed to fetch inventory history");
    }
  };

  useEffect(() => {
    if (selectedProduct) fetchData(selectedProduct);
  }, [selectedProduct]);

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Warehouse", dataIndex: "warehouseId" },
    { title: "Location", dataIndex: "locationId" },
    {
      title: "Qty Change",
      dataIndex: "quantityChange",
      render: (v: number) =>
        v > 0 ? <span style={{ color: "green" }}>+{v}</span> : <span style={{ color: "red" }}>{v}</span>,
    },
    {
      title: "Action",
      dataIndex: "actionType",
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    { title: "Reference", dataIndex: "referenceCode" },
    { title: "Note", dataIndex: "note" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div>
      <h2>Inventory History</h2>

      {/* PRODUCT SELECT */}
      <div style={{ marginBottom: 16, width: 300 }}>
        <Select
          placeholder="Select product"
          value={selectedProduct}
          allowClear
          onChange={(value) => setSelectedProduct(value)}
          options={products.map((p) => ({
            label: p.name,
            value: p.id,
          }))}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}
