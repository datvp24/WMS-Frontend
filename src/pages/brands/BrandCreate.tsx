import { Form, Input, Button, Card, message } from "antd";
import { brandApi } from "../../api/brand.api";
import { useNavigate } from "react-router-dom";

export default function BrandCreate() {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            // Nếu Code trống → gửi null
            if (!values.code || values.code.trim() === "")
                values.code = null;

                values.isActive = values.isActive === "true";

            await brandApi.create(values);
            message.success("Brand created successfully");
            navigate("/master/brands");
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data || "Failed to create brand");
        }
    };

    return (
        <Card title="Create Brand" style={{ width: 500, margin: "20px auto" }}>
            <Form layout="vertical" onFinish={onFinish}>

                <Form.Item label="Code" name="code">
                    <Input placeholder="(Optional) Leave blank to auto generate" />
                </Form.Item>

                <Form.Item
                    label="Brand Name"
                    name="name"
                    rules={[{ required: true, message: "Name is required" }]}
                >
                    <Input placeholder="Brand name" />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} placeholder="Description (optional)" />
                </Form.Item>
                <Form.Item label="Active" name="isActive" initialValue={true}>
                    <select>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </Form.Item>


                <Button type="primary" htmlType="submit" block>
                    Create
                </Button>
            </Form>
        </Card>
    );
}
