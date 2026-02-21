import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    apiLogin,
    apiRegister,
    apiGetUser,
    apiLogout,
    getToken,
    removeToken,
    type User,
} from '@/services/api';

// ─── Types ──────────────────────────────────────────────────
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string,
        password_confirmation: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

// ─── Provider ───────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar si hay sesión activa al iniciar la app
    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const token = await getToken();
            if (token) {
                const userData = await apiGetUser();
                setUser(userData);
            }
        } catch {
            await removeToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const response = await apiLogin(email, password);
        setUser(response.user);
    }

    async function register(
        name: string,
        email: string,
        password: string,
        password_confirmation: string
    ) {
        const response = await apiRegister(name, email, password, password_confirmation);
        setUser(response.user);
    }

    async function logout() {
        try {
            await apiLogout();
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
