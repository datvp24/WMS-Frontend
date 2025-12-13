// src/pages/unit/UnitList.tsx
import { Button, Popconfirm, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { unitApi } from "../../api/unit.api";
import PageHeader from "../../components/PageHeader";
import WmsTable from "../../components/Wmstable";
import { useNavigate } from "react-router-dom";
import type { UnitDto } from "../../types/unit";

export default function UnitList() {
    const [data, setData] = useState<UnitDto[]>([]);
    const navigate = useNavigate();

    const load = async () => {
        try {
            const res = await unitApi.getAll();
            setData(res.data);
        } catch (err) {
            message.error("Failed to load units");
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: number) => {
        try {
            await unitApi.delete(id);
            message.success("Unit deleted");
            load();
        } catch {
            message.error("Delete failed");
        }
    };

    return (
        <>
            <PageHeader
                title="Units Management"
                button={<Button type="primary" onClick={() => navigate("/unit/create")}>Create Unit</Button>}
            />

            <WmsTable
                dataSource={data}
                rowKey="id"
                columns={[
                    { title: "ID", dataIndex: "id", width: 70 },
                    { title: "Code", dataIndex: "code", render: (v: string) => <Tag color="blue">{v}</Tag> },
                    { title: "Name", dataIndex: "name" },
                    { title: "Active", dataIndex: "isActive", render: (v: boolean) => v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag> },
                    { title: "Created At", dataIndex: "createAt", render: (v: string) => v ? new Date(v).toLocaleString("vi-VN") : "—" },
                    
                    {
                        title: "Actions",
                        width: 150,
                        render: (_: unknown, row: UnitDto) => (
                            <>
                                <Button size="small" onClick={() => navigate(`/unit/edit/${row.id}`)}>Edit</Button>
                                <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(row.id)}>
                                    <Button danger size="small" style={{ marginLeft: 8 }}>Delete</Button>
                                </Popconfirm>
                            </>
                        ),
                    }
                ]}
            />
        </>
    );
}
