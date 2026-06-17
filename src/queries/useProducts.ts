import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts, getProductsByCategory } from "@/api/product.api";
import { PAGE_LIMIT } from "@/lib/constants";

export function useProducts(category: string, enabled = true) {
    return useInfiniteQuery({
        queryKey: ["products", category],
        queryFn: ({ pageParam }) =>
            category
                ? getProductsByCategory(category, PAGE_LIMIT, pageParam)
                : getProducts(PAGE_LIMIT, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const loaded = lastPage.skip + lastPage.limit;
            return loaded < lastPage.total ? loaded : undefined;
        },
        enabled,
    });
}
