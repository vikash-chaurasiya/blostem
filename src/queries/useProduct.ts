import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/api/product.api";

export function useProduct(id: number) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
        enabled: !isNaN(id),
    });
}
