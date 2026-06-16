import apiClient from "./client";
import type { Product, ProductsResponse } from "@/types/product";
import type { Category } from "@/types/category";

export const getProducts = async (limit: number, skip: number): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>("/products", {
        params: { limit, skip },
    });
    return data;
};

export const getProductsByCategory = async (
    category: string,
    limit: number,
    skip: number
): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>(
        `/products/category/${category}`,
        { params: { limit, skip } }
    );
    return data;
};

export const searchProducts = async (
    q: string,
    limit: number,
    skip: number
): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>("/products/search", {
        params: { q, limit, skip },
    });
    return data;
};  

export const getProduct = async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
};

export const getCategories = async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/products/categories");
    return data;
};

export const getCategoryList = async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>("/products/category-list");
    return data;
};
