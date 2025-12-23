import { Card, Table, Tag, Button, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { salesApi } from "../../api/sale.api";
import { goodsIssueApi } from "../../api/goodissue.api";

interface SalesOrderDetailDto {
  id: string;
  code: string;
  customerName: string;
  status: string;
  totalAmount: number;
  items: SalesOrderItemDto[];
  goodsIssues: GoodsIssueDto[];
}

interface SalesOrderItemDto {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface GoodsIssueDto {
  id: string;
  code: string;
  status: string;
  issuedAt: string;
}

export default function SalesOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<SalesOrderDetailDto | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await salesApi.get(id);
      setData(res.data);
    } catch {
      message.error("Failed to load sales order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const createGI = async () => {
    if (!data) return;
    navigate(`/sales/goods-issue/create?soId=${data.id}`);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "default";
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "blue";
    }
  };

  if (!data) return null;

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate(-1)}>Back</Button>

        {data.status === "APPROVED" && (
          <Button type="primary" onClick={createGI}>
            Create Goods Issue
          </Button>
        )}
      </Space>

      <Card title={`Sales Order ${data.code}`} loading={loading}>
        <p><b>Customer:</b> {data.customerName}</p>
        <p>
          <b>Status:</b>{" "}
          <Tag color={statusColor(data.status)}>{data.status}</Tag>
        </p>
        <p><b>Total Amount:</b> {data.totalAmount.toLocaleString()}</p>
      </Card>

      {/* ITEMS */}
      <Card title="Order Items" style={{ marginTop: 16 }}>
        <Table
          rowKey="id"
          pagination={false}
          dataSource={data.items}
          columns={[
            { title: "Product", dataIndex: "productName" },
            { title: "Quantity", dataIndex: "quantity" },
            { title: "Unit Price", dataIndex: "unitPrice" },
            { title: "Total", dataIndex: "totalPrice" },
          ]}
        />
      </Card>

      {/* GOODS ISSUE */}
      <Card title="Goods Issues" style={{ marginTop: 16 }}>
        <Table
          rowKey="id"
          pagination={false}
          dataSource={data.goodsIssues}
          columns={[
            { title: "Code", dataIndex: "code" },
            {
              title: "Status",
              dataIndex: "status",
              render: (s: string) => <Tag>{s}</Tag>,
            },
            { title: "Issued At", dataIndex: "issuedAt" },
            {
              title: "Action",
              render: (_: any, gi: GoodsIssueDto) => (
                <Button
                  type="link"
                  onClick={() => navigate(`/sales/goods-issue/${gi.id}`)}
                >
                  View
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
