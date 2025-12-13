export interface PermissionDto {
    id: number;
    code: string;
    description: string;
    createdAt: string;      // datetime string
    createdBy: number | null;
    isDeleted: boolean;
}


export interface CreatePermissionDto {
    code: string;
    description?: string;
}

export interface UpdatePermissionDto {
    code: string;
    description?: string;
}
