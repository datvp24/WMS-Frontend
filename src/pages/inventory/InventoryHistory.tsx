import { Table, message, Select } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { inventoryApi } from "../../api/inventory.api";
import { productApi } from "../../api/product.api";
import type { InventoryHistoryDto } from "../../types/inventory";
import type { Product } from "../../types/product";

export default function InventoryHistory() {
    // param khi click từ Inventory List
    const { productId } = useParams<{ productId: string }>();
    const productIdNum = productId ? +productId : undefined;

    const [data, setData] = useState<InventoryHistoryDto[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number | undefined>(productIdNum);

    // 1) Load danh sách product
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

    // 2) Fetch history theo selectedProduct
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

    const columns = [
        { title: "ID", dataIndex: "id" },
        { title: "Warehouse", dataIndex: "warehouseId" },
        { title: "Location", dataIndex: "locationId" },
        { title: "Qty Change", dataIndex: "quantityChange" },
        { title: "Action", dataIndex: "actionType" },
        { title: "Reference", dataIndex: "referenceCode" },
        { title: "Created At", dataIndex: "createdAt" },
    ];

    return (
        <div>
            <h2>Inventory History</h2>

            {/* Dropdown chọn product */}
            <div style={{ marginBottom: 16, width: 300 }}>
                <Select
                    placeholder="Select a product"
                    value={selectedProduct}
                    allowClear
                    onChange={(value) => setSelectedProduct(value)}
                    options={products.map(p => ({
                        label: p.name,
                        value: p.id
                    }))}
                />
            </div>

            <Table rowKey="id" columns={columns} dataSource={data} />
        </div>
    );
}
