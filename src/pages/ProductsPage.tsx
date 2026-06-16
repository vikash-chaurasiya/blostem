import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductsByCategory, searchProducts } from "@/api/product.api";
import ProductCard from "@/components/product/ProductCard";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";

const LIMIT = 10;

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category") ?? "";
    const search = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? "1");

    const skip = (page - 1) * LIMIT;

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["products", page, category, search],
        queryFn: () => {
            if (search) return searchProducts(search, LIMIT, skip);
            if (category) return getProductsByCategory(category, LIMIT, skip);
            return getProducts(LIMIT, skip);
        },
    });

    const setPage = (next: number) => {
        const params: Record<string, string> = {};
        if (category) params.category = category;
        if (search) params.search = search;
        if (next > 1) params.page = String(next);
        setSearchParams(params);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
    }

    const products = data?.products ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                    {search
                        ? `Results for "${search}"`
                        : category
                        ? category.replace(/-/g, " ")
                        : "All Products"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {total} product{total !== 1 ? "s" : ""}
                </p>

                {products.length === 0 ? (
                    <EmptyState message="No products found." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Prev
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {page} / {totalPages}
                            </span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
