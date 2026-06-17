import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/api/product.api";
import { PAGE_LIMIT } from "@/lib/constants";

export function useSearchProducts(term: string, page: number, enabled = true) {
    const skip = (page - 1) * PAGE_LIMIT;
    return useQuery({
        queryKey: ["search", term, page],
        queryFn: () => searchProducts(term, PAGE_LIMIT, skip),
        enabled: enabled && term.trim().length > 0,
    });
}
