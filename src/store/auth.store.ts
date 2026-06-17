import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi, getMe } from "@/api/auth.api";
import { queryClient } from "@/lib/queryClient";
import { useFavoritesStore } from "@/store/favorites.store";
import type { User } from "@/types/auth";

interface AuthState {
   accessToken: string | null;
   refreshToken: string | null;
   user: User | null;
   isAuthenticated: boolean;
   isInitialized: boolean;
   login: (username: string, password: string) => Promise<void>;
   logout: () => void;
   restoreSession: () => Promise<void>;
   setUser: (user: User) => void;
   setTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => ({
         accessToken: null,
         refreshToken: null,
         user: null,
         isAuthenticated: false,
         isInitialized: false,

         login: async (username, password) => {
            const data = await loginApi(username, password);
            set({
               accessToken: data.accessToken,
               refreshToken: data.refreshToken,
               user: {
                  id: data.id,
                  username: data.username,
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  image: data.image,
               },
               isAuthenticated: true,
            });
         },

         logout: () => {
            const userId = get().user?.id;
            if (userId != null) {
               useFavoritesStore.getState().clearUserFavorites(userId);
            }
            queryClient.clear();
            set({
               accessToken: null,
               refreshToken: null,
               user: null,
               isAuthenticated: false,
            });
         },

         restoreSession: async () => {
            const { accessToken } = get();
            if (!accessToken) {
               set({ isInitialized: true });
               return;
            }
            try {
               const user = await getMe();
               set({ user, isAuthenticated: true, isInitialized: true });
            } catch {
               set({
                  accessToken: null,
                  refreshToken: null,
                  user: null,
                  isAuthenticated: false,
                  isInitialized: true,
               });
            }
         },

         setUser: (user) => set({ user }),
         setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      }),
      {
         name: "auth-storage",
         partialize: (state) => ({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
         }),
      },
   ),
);
