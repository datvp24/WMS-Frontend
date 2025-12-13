import { Button, Form, Input, message, Switch } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supplierApi } from "../../api/supplier.api";
import type { SupplierDto, CreateSupplierDto, UpdateSupplierDto } from "../../types/supplier";

interface SupplierFormProps {
    mode: "create" | "edit";
}

export default function SupplierForm({ mode }: SupplierFormProps) {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (mode === "edit" && id) {
            supplierApi.get(+id).then(res => {
                const data: SupplierDto = res.data;
                form.setFieldsValue({
                    code: data.code,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    isActive: data.isActive
                });
            }).catch(() => {
                message.error("Failed to load supplier");
            });
        }
    }, [mode, id, form]);

    const onFinish = async (values: any) => {
        try {
            if (mode === "create") {
                const payload: CreateSupplierDto = values;
                await supplierApi.create(payload);
                message.success("Supplier created");
            } else if (mode === "edit" && id) {
                const payload: UpdateSupplierDto = values;
                await supplierApi.update(+id, payload);
                message.success("Supplier updated");
            }
            navigate("/supplier");
        } catch {
            message.error("Operation failed");
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
            <Form.Item label="Code" name="code" rules={[{ required: true, message: "Please enter code" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter name" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
                <Input />
            </Form.Item>
            <Form.Item label="Address" name="address">
                <Input />
            </Form.Item>
            {mode === "edit" && (
                <Form.Item label="Active" name="isActive" valuePropName="checked">
                    <Switch />
                </Form.Item>
            )}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {mode === "create" ? "Create" : "Update"}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => navigate("/suppliers")}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
}
