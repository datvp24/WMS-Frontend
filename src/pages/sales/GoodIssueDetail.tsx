import { Card, Table, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { goodsIssueApi } from "../../api/goodissue.api";

export default function GoodsIssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gi, setGi] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) loadGI(id);
  }, [id]);

  const loadGI = async (giId: string) => {
    const res = await goodsIssueApi.get(giId);
    setGi(res.data);
  };

  const completeGI = async () => {
    try {
      setLoading(true);
      await goodsIssueApi.complete(id!);
      message.success("Goods Issue completed");
      loadGI(id!);
    } catch {
      message.error("Complete failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelGI = async () => {
    try {
      setLoading(true);
      await goodsIssueApi.cancel(id!);
      message.success("Goods Issue cancelled");
      loadGI(id!);
    } catch {
      message.error("Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  if (!gi) return <div>Loading...</div>;

  return (
    <Card
      title={`Goods Issue: ${gi.code}`}
      extra={
        <>
          {gi.status === "PENDING" && (
            <>
              <Button
                type="primary"
                onClick={completeGI}
                loading={loading}
                style={{ marginRight: 8 }}
              >
                Complete
              </Button>
              <Button danger onClick={cancelGI} loading={loading}>
                Cancel
              </Button>
            </>
          )}
        </>
      }
    >
      <p>
        <b>Warehouse:</b> {gi.warehouseName} <br />
        <b>Status:</b> {gi.status} <br />
        <b>Issued At:</b> {new Date(gi.issuedAt).toLocaleString()}
      </p>

      <Table
        dataSource={gi.items}
        rowKey="id"
        pagination={false}
        columns={[
          { title: "Product", dataIndex: "productName" },
          { title: "Location", dataIndex: "locationCode" },
          { title: "Quantity", dataIndex: "quantity" },
        ]}
      />
    </Card>
  );
}
