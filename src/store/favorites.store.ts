import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
    /** userId → productId[] — keeps favorites scoped per account on a shared device. */
    favoritesByUser: Record<number, number[]>;
    addFavorite: (userId: number, productId: number) => void;
    removeFavorite: (userId: number, productId: number) => void;
    /** Toggles and returns the new state (true if the product is now a favorite). */
    toggleFavorite: (userId: number, productId: number) => boolean;
    isFavorite: (userId: number, productId: number) => boolean;
    getFavorites: (userId: number) => number[];
    clearUserFavorites: (userId: number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favoritesByUser: {},

            addFavorite: (userId, productId) =>
                set((state) => {
                    const current = state.favoritesByUser[userId] ?? [];
                    if (current.includes(productId)) return state;
                    return {
                        favoritesByUser: { ...state.favoritesByUser, [userId]: [...current, productId] },
                    };
                }),

            removeFavorite: (userId, productId) =>
                set((state) => {
                    const current = state.favoritesByUser[userId] ?? [];
                    return {
                        favoritesByUser: {
                            ...state.favoritesByUser,
                            [userId]: current.filter((id) => id !== productId),
                        },
                    };
                }),

            toggleFavorite: (userId, productId) => {
                const willAdd = !get().isFavorite(userId, productId);
                if (willAdd) get().addFavorite(userId, productId);
                else get().removeFavorite(userId, productId);
                return willAdd;
            },

            isFavorite: (userId, productId) =>
                (get().favoritesByUser[userId] ?? []).includes(productId),

            getFavorites: (userId) => get().favoritesByUser[userId] ?? [],

            clearUserFavorites: (userId) =>
                set((state) => {
                    const next = { ...state.favoritesByUser };
                    delete next[userId];
                    return { favoritesByUser: next };
                }),
        }),
        { name: "favorites-storage" },
    ),
);
