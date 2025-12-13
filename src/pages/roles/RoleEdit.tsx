import { Form, Input, Button, Card, message } from "antd";
import { roleApi } from "../../api/role.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function RoleEdit() {
    const { id } = useParams();
    const roleId = Number(id ?? 0);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const load = async () => {
        const role = (await roleApi.get(roleId)).data;
        form.setFieldsValue(role);
    };

    useEffect(() => { load(); }, []);

    const onFinish = async (values: any) => {
        await roleApi.update(roleId, values);
        message.success("Updated");
        navigate("/roles");
    };

    return (
        <Card title="Edit Role" style={{ width: 400, margin: "40px auto" }}>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item label="Role Name" name="roleName" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Save
                </Button>
            </Form>
        </Card>
    );
}
