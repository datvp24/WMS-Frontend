import { Button, Popconfirm, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { permissionApi } from "../../api/permission.api";
import PageHeader from "../../components/PageHeader";
import WmsTable from "../../components/Wmstable";
import { useNavigate } from "react-router-dom";

export default function PermissionList() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const load = async () => {
        setData((await permissionApi.getAll()).data);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: number) => {
        await permissionApi.delete(id);
        message.success("Deleted");
        load();
    };

    return (
        <>
            <PageHeader
                title="Permissions Management"
                button={
                    <Button type="primary" onClick={() => navigate("/permissions/create")}>
                        Create Permission
                    </Button>
                }
            />

            <WmsTable
                dataSource={data}
                rowKey="id"
                columns={[
    { title: "ID", dataIndex: "id", width: 80 },

    {
        title: "Code",
        dataIndex: "code",
        render: (code: string) => <Tag color="blue">{code}</Tag>
    },

    { 
        title: "Description", 
        dataIndex: "description" 
    },

    {
        title: "Created At",
        dataIndex: "createdAt",
        render: (v: string) => new Date(v).toLocaleString()
    },
    {
        title: "Created By",
        dataIndex: "createdBy",
        width: 120,
        render: (v: number | null) =>
            v ? <Tag color="purple">User #{v}</Tag> : <Tag>null</Tag>
    },

    {
        title: "Is Deleted",
        dataIndex: "isDeleted",
        render: (v: boolean) =>
            v ? <Tag color="red">Deleted</Tag> : <Tag color="green">Active</Tag>
    },
    


    {
        title: "Actions",
        render: (_: any, row: any) => (
            <>
                <Button size="small"
                    onClick={() => navigate(`/permissions/edit/${row.id}`)}>
                    Edit
                </Button>

                <Popconfirm
                    title="Sure delete?"
                    onConfirm={() => handleDelete(row.id)}
                >
                    <Button danger size="small" style={{ marginLeft: 8 }}>
                        Delete
                    </Button>
                </Popconfirm>
            </>
        ),
    },
]}

            />
        </>
    );
}
