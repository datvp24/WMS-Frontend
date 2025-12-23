import { Table, Button, Tag, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { salesApi } from "../../api/sale.api";

interface SalesOrderDto {
  id: string;
  code: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function SalesOrderList() {
  const [data, setData] = useState<SalesOrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await salesApi.query();
      setData(res.data);
    } catch {
      message.error("Failed to load sales orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approve = async (id: string) => {
    try {
      await salesApi.approve(id);
      message.success("Sales Order approved");
      fetchData();
    } catch {
      message.error("Approve failed");
    }
  };

  const reject = async (id: string) => {
    try {
      await salesApi.reject(id);
      message.success("Sales Order rejected");
      fetchData();
    } catch {
      message.error("Reject failed");
    }
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

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={statusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Action",
      render: (_: any, record: SalesOrderDto) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`${record.id}`)}
          >
            View
          </Button>

          {record.status === "DRAFT" && (
            <>
              <Button
                type="link"
                onClick={() => approve(record.id)}
              >
                Approve
              </Button>
              <Button
                danger
                type="link"
                onClick={() => reject(record.id)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Sales Orders</h2>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/sales/orders/create")}
      >
        Create Sales Order
      </Button>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
      />
    </>
  );
}
