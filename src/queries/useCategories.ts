import { useQuery } from "@tanstack/react-query";
import { getCategoryList, getCategories } from "@/api/product.api";

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategoryList,
        staleTime: Infinity,
    });
}

export function useCategoriesWithMeta() {
    return useQuery({
        queryKey: ["categories-meta"],
        queryFn: getCategories,
        staleTime: Infinity,
    });
}
