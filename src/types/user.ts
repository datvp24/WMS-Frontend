export interface UserDto {
    id: number;
    fullName: string;
    email: string;
    isActive: boolean;

    createdAt: string;
    createdBy?: number;
    updatedAt?: string;
    updatedBy?: number;
}

export interface CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    roleIds?: number[];
    permissionIds?: number[];
}

export interface UpdateUserDto {
    fullName: string;
    email: string;
    password?: string;
    isActive: boolean;
    roleIds?: number[];
    permissionIds?: number[];
}
