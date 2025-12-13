import { Form, InputNumber, Button, Card, message } from "antd";
import { authApi } from "../../api/auth.api";

export default function AssignRole() {
    const onFinish = async (values: any) => {
        await authApi.assignRole(values.userId, values.roleId);
        message.success("Gán Role thành công!");
    };

    return (
        <div style={{ display:"flex", justifyContent:"center", marginTop:80 }}>
            <Card title="Gán Role cho User" style={{ width: 400 }}>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width:"100%" }} />
                    </Form.Item>
                    <Form.Item name="roleId" label="Role ID" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width:"100%" }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Gán Role
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
