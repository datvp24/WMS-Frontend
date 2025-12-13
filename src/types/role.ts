// Role DTOs

// Dùng khi tạo Role mới
export interface CreateRoleDto {
    roleName: string;
}

// Dùng khi cập nhật Role
export interface UpdateRoleDto {
    roleName: string;
}

// Dùng khi assign permission cho Role
export interface AssignPermissionToRoleDto {
    roleId: number;
    permissionId: number;
}

// Dùng khi hiển thị Role chi tiết trong list / detail page
export interface RoleDetailDto {
    id: number;
    roleName: string;

    // Danh sách permission đã assign
    Permissions: {
        id: number;
        code: string;
        description?: string; // nếu muốn hiển thị mô tả
    }[];

    // Audit info
    createdAt: string | null;
    createdBy: number | null;
    updatedAt: string | null;
    updatedBy: number | null;
}
