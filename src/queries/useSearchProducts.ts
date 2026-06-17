import { useInfiniteQuery } from "@tanstack/react-query";
import { searchProducts } from "@/api/product.api";
import { PAGE_LIMIT } from "@/lib/constants";

export function useSearchProducts(term: string, enabled = true) {
    return useInfiniteQuery({
        queryKey: ["search", term],
        queryFn: ({ pageParam }) => searchProducts(term, PAGE_LIMIT, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const loaded = lastPage.skip + lastPage.limit;
            return loaded < lastPage.total ? loaded : undefined;
        },
        enabled: enabled && term.trim().length > 0,
    });
}
