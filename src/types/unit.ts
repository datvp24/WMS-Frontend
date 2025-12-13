export interface UnitDto {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    createdAt: string; // khớp với DB
}

export interface CreateUnitDto {
    code: string;
    name: string;
    isActive: boolean;
}

export interface UpdateUnitDto {
    code: string;
    name: string;
    isActive: boolean;
}
