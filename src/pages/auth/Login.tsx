import { Form, Input, Button, Card, message } from "antd";
import { useAuthStore } from "../../store/authStore";
import type { LoginRequestDto } from "../../types/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const login = useAuthStore(s => s.login);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginRequestDto) => {
        try {
            setLoading(true);
            await login(values);

            message.success("Đăng nhập thành công!");

            // 🎯 Redirect sang trang Dashboard hoặc Roles
            navigate("/dashboard");     // hoặc "/"
        } catch (err: any) {
            console.error(err);
            message.error("Sai email hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display:"flex", justifyContent:"center", marginTop:80 }}>
            <Card title="Đăng nhập" style={{ width: 400 }}>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" }
                        ]}
                    >
                        <Input placeholder="Nhập email..." />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu..." />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
