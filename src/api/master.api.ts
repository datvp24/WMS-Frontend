import http from "./http";
import type { OptionItem } from "../types/master";

export const masterApi = {
    getCategories: () => http.get<OptionItem[]>("/category"),
    getBrands: () => http.get<OptionItem[]>("/brand"),
    getUnits: () => http.get<OptionItem[]>("/unit"),
    getSuppliers: () => http.get<OptionItem[]>("/supplier"),
};
