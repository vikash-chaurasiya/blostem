import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/product.api";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Spinner from "@/components/common/Spinner";

const LIMIT = 10;

export default function ProductsPage() {
    const [page, setPage] = useState(1);

    const skip = (page - 1) * LIMIT;

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["products", page],
        queryFn: () => getProducts(LIMIT, skip),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950">
                <ErrorState
                    message={(error as Error).message}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    const products = data?.products ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Products
                </h1>

                {products.length === 0 ? (
                    <EmptyState message="No products found." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="rounded-xl bg-gray-100 dark:bg-slate-900 overflow-hidden"
                                >
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                                            ${product.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Prev
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {page} / {totalPages}
                            </span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
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
