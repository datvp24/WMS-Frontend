import { Form, Input, Button, Card, message } from "antd";
import { roleApi } from "../../api/role.api";
import { useNavigate } from "react-router-dom";

export default function RoleCreate() {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        await roleApi.create(values);
        message.success("Role created");
        navigate("/roles");
    };

    return (
        <Card title="Create Role" style={{ width: 400, margin: "40px auto" }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Role Name" name="roleName" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Create
                </Button>
            </Form>
        </Card>
    );
}
