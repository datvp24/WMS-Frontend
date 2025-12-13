import { Card, Select, Button, message, Table } from "antd";
import { useEffect, useState } from "react";
import { roleApi } from "../../api/role.api";
import { permissionApi } from "../../api/permission.api";

export default function RolePermissionAssign() {
    const [roles, setRoles] = useState<any[]>([]);
    const [roleId, setRoleId] = useState<number | null>(null);

    const [role, setRole] = useState<any>(null);
    const [allPermissions, setAllPermissions] = useState<any[]>([]);
    const [selected, setSelected] = useState<number | null>(null);

    const loadData = async () => {
        setRoles((await roleApi.getAll()).data);
        setAllPermissions((await permissionApi.getAll()).data);
    };

    const loadRoleDetail = async (id: number) => {
        setRole((await roleApi.get(id)).data);
    };

    useEffect(() => { loadData(); }, []);

    // khi chọn role => load permission của nó
    useEffect(() => {
        if (roleId) loadRoleDetail(roleId);
    }, [roleId]);

    const assign = async () => {
        if (!roleId) return message.error("Select role first");
        if (!selected) return message.error("Select permission first");

        await roleApi.assignPermission({
            roleId: roleId,
            permissionId: selected
        });

        message.success("Assigned");
        loadRoleDetail(roleId);
    };

    const remove = async (permId: number) => {
        if (!roleId) return;

        await roleApi.removePermission(roleId, permId);
        message.success("Removed");
        loadRoleDetail(roleId);
    };

    return (
        <Card title="Assign Permissions to Role">
            
            {/* Select Role */}
            <div style={{ marginBottom: 20 }}>
                <Select
                    style={{ width: 300 }}
                    placeholder="Select role"
                    onChange={(v) => setRoleId(Number(v))}
                    options={roles.map(r => ({ value: r.id, label: r.roleName }))}
                />
            </div>

            {/* Select Permission */}
            <Select
                style={{ width: 300 }}
                placeholder="Select permission"
                onChange={(v) => setSelected(Number(v))}
                options={allPermissions.map(p => ({ value: p.id, label: p.code }))}
                disabled={!roleId}
            />

            <Button 
                type="primary" 
                style={{ marginLeft: 10 }} 
                onClick={assign}
                disabled={!roleId}
            >
                Add
            </Button>

            {/* Table */}
            <Table
                style={{ marginTop: 20 }}
                dataSource={role?.permissions || []}
                rowKey="id"
                columns={[
                    { title: "ID", dataIndex: "id", width: 80 },
                    { title: "Permission", dataIndex: "code" },
                    {
                        title: "Action",
                        render: (r: any) => (
                            <Button 
                                danger 
                                onClick={() => remove(r.id)}
                            >
                                Remove
                            </Button>
                        ),
                    },
                ]}
            />
        </Card>
    );
}
