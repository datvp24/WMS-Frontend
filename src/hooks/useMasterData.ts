import { useEffect, useState } from "react";
import { masterApi } from "../api/master.api";
import type { OptionItem } from "../types/master";

export function useMasterData() {
    const [categories, setCategories] = useState<OptionItem[]>([]);
    const [brands, setBrands] = useState<OptionItem[]>([]);
    const [units, setUnits] = useState<OptionItem[]>([]);
    const [suppliers, setSuppliers] = useState<OptionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [c, b, u, s] = await Promise.all([
                masterApi.getCategories(),
                masterApi.getBrands(),
                masterApi.getUnits(),
                masterApi.getSuppliers(),
            ]);

            setCategories(c.data);
            setBrands(b.data);
            setUnits(u.data);
            setSuppliers(s.data);

            setLoading(false);
        })();
    }, []);

    return { categories, brands, units, suppliers, loading };
}
