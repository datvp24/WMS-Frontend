import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { useEffect } from "react";
import { permissionApi } from "../../api/permission.api";
import PageHeader from "../../components/PageHeader";

export default function PermissionEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const load = async () => {
        const res = await permissionApi.getAll();
        const item = res.data.find((x: any) => x.id == id);
        form.setFieldsValue(item);
    };

    useEffect(() => { load(); }, []);

    const onFinish = async (values: any) => {
        await permissionApi.update(Number(id), values);
        message.success("Updated");
        navigate("/permissions");
    };

    return (
        <>
            <PageHeader title="Edit Permission" />

            <Card>
                <Form form={form} layout="vertical" onFinish={onFinish}>
    <Form.Item label="Code" name="code" rules={[{ required: true }]}>
        <Input />
    </Form.Item>

    <Form.Item label="Description" name="description">
        <Input.TextArea rows={3} />
    </Form.Item>

    <Button type="primary" htmlType="submit">Save</Button>
</Form>

            </Card>
        </>
    );
}
