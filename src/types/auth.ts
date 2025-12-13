export interface LoginRequestDto {
    email: string;
    password: string;
}

export interface LoginResponseDto {
    id: number;
    fullName: string;
    email: string;
    token: string;
    permissions: string[];
}

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AssignRoleDto {
    userId: number;
    roleId: number;
}

export interface AssignPermissionDto {
    userId: number;
    permissionId: number;
}

export interface AuthState {
    user: LoginResponseDto | null;
    token: string | null;
    login: (dto: LoginRequestDto) => Promise<void>;
    logout: () => void;
}
