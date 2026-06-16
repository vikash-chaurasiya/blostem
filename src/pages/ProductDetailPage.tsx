import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Product Detail
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Product ID: {id}
                </p>
            </div>
        </div>
    );
}
