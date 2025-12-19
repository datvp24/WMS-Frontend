import { create } from "zustand";
import { authApi } from "../api/auth.api";
import { storage } from "../utils/storage";

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;

    login: (dto: any) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: storage.getToken(),
    isAuthenticated: !!storage.getToken(),

    login: async (dto) => {
        const res = await authApi.login(dto);

        const token = res.data.token;
        const user = res.data.user;

        storage.setToken(token);

        set({
            user,
            token,
            isAuthenticated: true,
        });
    },

    logout: () => {
        storage.clearToken();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
        window.location.href ="/login";
    }
}));
