import { Form, Input, Button, Card, Switch, message } from "antd";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/user.api";

export default function UserCreate() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const payload = {
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            isActive: values.isActive ?? true, // mặc định active
        };

        await userApi.create(payload);
        message.success("User created successfully");
        navigate("/users");
    };

    return (
        <Card title="Create User" style={{ width: 500, margin: "40px auto" }}>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }}>
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please enter full name" }]}
                >
                    <Input placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Invalid email" }
                    ]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter password" }]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item label="Active" name="isActive" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Create User
                </Button>
            </Form>
        </Card>
    );
}
