import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="group rounded-xl bg-gray-100 dark:bg-slate-900 overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all"
        >
            <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        ${product.price}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        ⭐ {product.rating}
                    </span>
                </div>
            </div>
        </Link>
    );
}
