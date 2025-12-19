import { Card, Select, Checkbox, Button, message, Divider } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // <-- import useParams
import { roleApi } from "../../api/role.api";
import { permissionApi } from "../../api/permission.api";

interface Permission {
  id: number;
  code: string;
}

interface Role {
  id: number;
  roleName: string;
  permissions: Permission[];
}

export default function RolePermissionAssign() {
  const { id } = useParams<{ id: string }>(); // lấy role id từ route
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState<number | null>(id ? Number(id) : null);

  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [original, setOriginal] = useState<number[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all roles + permissions
  useEffect(() => {
    const loadInit = async () => {
      const [rolesRes, permsRes] = await Promise.all([
        roleApi.getAll(),
        permissionApi.getAll(),
      ]);
      setRoles(rolesRes.data);
      setAllPermissions(permsRes.data);
    };
    loadInit();
  }, []);

  // Load role permissions khi roleId thay đổi (bao gồm từ route)
  useEffect(() => {
    if (!roleId) return;

    const loadRole = async () => {
      const res = await roleApi.get(roleId);
      const permIds = res.data.permissions.map((p: Permission) => p.id);

      setOriginal(permIds);
      setChecked(permIds);
    };

    loadRole();
  }, [roleId]);

  const onSubmit = async () => {
    if (!roleId) return;

    setLoading(true);

    const toAdd = checked.filter(id => !original.includes(id));
    const toRemove = original.filter(id => !checked.includes(id));

    try {
      await Promise.all([
        ...toAdd.map(pid =>
          roleApi.assignPermission({ roleId, permissionId: pid })
        ),
        ...toRemove.map(pid =>
          roleApi.removePermission(roleId, pid)
        ),
      ]);

      message.success("Permissions updated");
      setOriginal(checked);
    } catch {
      message.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Assign Permissions to Role">
      {/* Role selector */}
      <Select
        style={{ width: 300, marginBottom: 20 }}
        placeholder="Select role"
        options={roles.map(r => ({
          value: r.id,
          label: r.roleName,
        }))}
        value={roleId || undefined} // <-- dropdown tự chọn role hiện tại
        onChange={setRoleId}
      />

      {roleId && (
        <>
          <Divider />

          <Checkbox.Group
            value={checked}
            onChange={(v) => setChecked(v as number[])}
            style={{ width: "100%" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
              }}
            >
              {allPermissions.map(p => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Checkbox value={p.id}>{p.code}</Checkbox>
                </div>
              ))}
            </div>
          </Checkbox.Group>

          <Divider />

          <Button
            type="primary"
            loading={loading}
            onClick={onSubmit}
          >
            Save Changes
          </Button>
        </>
      )}
    </Card>
  );
}
