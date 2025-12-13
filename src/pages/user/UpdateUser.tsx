import { useEffect } from "react";
import { Form, Input, Button, Card, message, Switch } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../api/user.api";
import type { UpdateUserDto } from "../../types/user";

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const loadUser = async () => {
        const res = await userApi.getById(Number(id));
        const data: UpdateUserDto = res.data;

        form.setFieldsValue({
            fullName: data.fullName,
            email: data.email,
            isActive: data.isActive,
        });
    };

    useEffect(() => {
        loadUser();
    }, []);

    const onFinish = async (values: any) => {
        const dto: UpdateUserDto = {
            fullName: values.fullName,
            email: values.email,
            isActive: values.isActive,
            password: values.password || undefined, // bỏ qua nếu trống
        };

        await userApi.update(Number(id), dto);
        message.success("User updated successfully");
        navigate("/users");
    };

    return (
        <Card title="Edit User" style={{ width: 500, margin: "20px auto" }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Password (leave blank to keep current)" name="password">
                    <Input.Password />
                </Form.Item>

                <Form.Item label="Active" name="isActive" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form>
        </Card>
    );
}
