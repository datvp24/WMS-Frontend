import { Form, Select, Button, Card, message } from "antd";
import { useEffect, useState } from "react";
import { authApi } from "../../api/auth.api";
import { roleApi } from "../../api/role.api";
import { userApi } from "../../api/user.api";

interface Role {
    id: number;
    roleName: string;
}

interface User {
    id: number;
    email: string;
    fullName?: string;
}

export default function AssignRole() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [roleRes, userRes] = await Promise.all([
                    roleApi.getAll(),
                    userApi.getAll(),
                ]);

                setRoles(roleRes.data);
                setUsers(userRes.data);
            } catch (err) {
                message.error("Không tải được dữ liệu");
            }
        };

        loadData();
    }, []);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            await authApi.assignRole(values.userId, values.roleId);
            message.success("Gán Role thành công!");
        } catch {
            message.error("Gán Role thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
            <Card title="Gán Role cho User" style={{ width: 500 }}>
                <Form onFinish={onFinish} layout="vertical">

                    {/* USER */}
                    <Form.Item
                        name="userId"
                        label="User"
                        rules={[{ required: true, message: "Chọn user" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn user"
                            optionFilterProp="label"
                            options={users.map(u => ({
                                value: u.id,
                                label: `${u.email}${u.fullName ? " - " + u.fullName : ""}`,
                            }))}
                        />
                    </Form.Item>

                    {/* ROLE */}
                    <Form.Item
                        name="roleId"
                        label="Role"
                        rules={[{ required: true, message: "Chọn role" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn role"
                            optionFilterProp="label"
                            options={roles.map(r => ({
                                value: r.id,
                                label: r.roleName, // ✅ ĐÚNG FIELD
                            }))}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        Gán Role
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
