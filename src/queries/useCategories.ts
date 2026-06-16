import { useQuery } from "@tanstack/react-query";
import { getCategoryList } from "@/api/product.api";

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategoryList,
        staleTime: Infinity,
    });
}
