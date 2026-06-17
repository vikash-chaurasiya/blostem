import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductsByCategory } from "@/api/product.api";
import { PAGE_LIMIT } from "@/lib/constants";

export function useProducts(page: number, category: string, enabled = true) {
    const skip = (page - 1) * PAGE_LIMIT;
    return useQuery({
        queryKey: ["products", page, category],
        queryFn: () =>
            category
                ? getProductsByCategory(category, PAGE_LIMIT, skip)
                : getProducts(PAGE_LIMIT, skip),
        enabled,
    });
}
