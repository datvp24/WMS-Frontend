import { useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { brandApi } from "../../api/brand.api";
import { useNavigate, useParams } from "react-router-dom";

export default function BrandEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const load = async () => {
        const res = await brandApi.getById(Number(id));
        const data = res.data;

        form.setFieldsValue({
            code: data.code ?? "",
            name: data.name,
            description: data.description ?? "",
            isActive: data.isActive ? "true" : "false"  
        });
    };

    useEffect(() => { load(); }, []);

    const onFinish = async (values: any) => {
        const dto = {
            ...values,
            code: values.code?.trim() === "" ? null : values.code,
            isActive: values.isActive === "true"
        };

        await brandApi.update(Number(id), dto);

        message.success("Updated");
        navigate("/master/brands");
    };

    return (
        <Card title="Edit Brand" style={{ width: 500, margin: "20px auto" }}>
            <Form layout="vertical" form={form} onFinish={onFinish}>

                <Form.Item label="Brand Code" name="code">
                    <Input placeholder="Optional: Leave blank for auto or no code" />
                </Form.Item>
                <Form.Item label="Active" name="isActive" initialValue={true}>
    <select>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
    </select>
</Form.Item>

                <Form.Item label="Brand Name" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form>
        </Card>
    );
}
