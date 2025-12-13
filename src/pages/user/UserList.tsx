import { Button, Popconfirm, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { userApi } from "../../api/user.api";
import PageHeader from "../../components/PageHeader";
import WmsTable from "../../components/Wmstable";
import { useNavigate } from "react-router-dom";
import type { UserDto } from "../../types/user";

export default function UserList() {
    const [data, setData] = useState<UserDto[]>([]);
    const navigate = useNavigate();

    const load = async () => {
        try {
            const res = await userApi.getAll();
            setData(res.data);
        } catch (err) {
            message.error("Failed to load users");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await userApi.delete(id);
            message.success("User deleted");
            load();
        } catch {
            message.error("Delete failed");
        }
    };

    return (
        <>
            <PageHeader
                title="Users Management"
                button={
                    <Button type="primary" onClick={() => navigate("/users/create")}>
                        Create User
                    </Button>
                }
            />

            <WmsTable
                dataSource={data}
                rowKey="id"
                columns={[
                    { title: "ID", dataIndex: "id", width: 70 },

                    {
                        title: "Full Name",
                        dataIndex: "fullName",
                        render: (v: string) => <Tag color="blue">{v}</Tag>
                    },

                    { title: "Email", dataIndex: "email" },

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
                            v ? <Tag color="purple">User #{v}</Tag> : <Tag>-</Tag>
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
                            v ? <Tag color="orange">User #{v}</Tag> : <Tag>-</Tag>
                    },

                    {
                        title: "Actions",
                        width: 150,
                        render: (_: unknown, row: UserDto) => (
                            <>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/users/edit/${row.id}`)}
                                >
                                    Edit
                                </Button>

                                <Popconfirm
                                    title="Are you sure you want to delete?"
                                    onConfirm={() => handleDelete(row.id)}
                                >
                                    <Button danger size="small" style={{ marginLeft: 8 }}>
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </>
                        ),
                    }
                ]}
            />
        </>
    );
}
