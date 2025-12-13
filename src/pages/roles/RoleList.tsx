import { Button, Popconfirm, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import WmsTable from "../../components/Wmstable";
import { roleApi } from "../../api/role.api";
import type { RoleDetailDto } from "../../types/role";

export default function RoleList() {
    const [data, setData] = useState<RoleDetailDto[]>([]);
    const navigate = useNavigate();

    const load = async () => {
        try {
            const res = await roleApi.getAll();
            setData(res.data);
        } catch (err) {
            message.error("Failed to load roles");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await roleApi.delete(id);
            message.success("Role deleted");
            load();
        } catch {
            message.error("Delete failed");
        }
    };

    return (
        <>
            <PageHeader
                title="Roles Management"
                button={
                    <Button type="primary" onClick={() => navigate("/roles/create")}>
                        Create Role
                    </Button>
                }
            />

            <WmsTable
                dataSource={data}
                rowKey="id"
                columns={[
                    { title: "ID", dataIndex: "id", width: 70 },

                    {
                        title: "Role Name",
                        dataIndex: "roleName",
                        render: (v: string) => <Tag color="blue">{v}</Tag>,
                    },

                    {
                        title: "Permissions",
                        dataIndex: "permissions",
                        render: (permissions: RoleDetailDto["Permissions"]) =>
                            permissions.length > 0
                                ? permissions.map(p => (
                                      <Tag color="green" key={p.id}>
                                          {p.code}
                                      </Tag>
                                  ))
                                : "—",
                    },

                    {
                        title: "Created At",
                        dataIndex: "createdAt",
                        render: (v: string | null) =>
                            v ? new Date(v).toLocaleString("vi-VN") : "—",
                    },

                    {
                        title: "Created By",
                        dataIndex: "createdBy",
                        render: (v: number | null) =>
                            v ? <Tag color="purple">User #{v}</Tag> : <Tag>-</Tag>,
                    },

                    {
                        title: "Updated At",
                        dataIndex: "updatedAt",
                        render: (v: string | null) =>
                            v ? new Date(v).toLocaleString("vi-VN") : "—",
                    },

                    {
                        title: "Updated By",
                        dataIndex: "updatedBy",
                        render: (v: number | null) =>
                            v ? <Tag color="orange">User #{v}</Tag> : <Tag>-</Tag>,
                    },

                    {
                        title: "Actions",
                        width: 180,
                        render: (_: unknown, row: RoleDetailDto) => (
                            <>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/roles/edit/${row.id}`)}
                                >
                                    Edit
                                </Button>

                                <Popconfirm
                                    title="Are you sure you want to delete?"
                                    onConfirm={() => handleDelete(row.id)}
                                >
                                    <Button
                                        danger
                                        size="small"
                                        style={{ marginLeft: 8 }}
                                    >
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
