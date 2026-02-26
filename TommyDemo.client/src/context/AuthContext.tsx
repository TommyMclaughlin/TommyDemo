/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthUser {
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    login: () => void;
    logout: () => void;
    loading: boolean; // track whether auth check is done
    role: string | null
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // initially loading
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/getCurrentUser", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (!response.ok) {
                logout();
                setLoading(false);
                return;
            }

            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
        } catch (err) {
            console.error(err);
            logout();
        } finally {
            setLoading(false);
        }
    };

            fetchUser();
    }, []);

    const login = async () => {
        setIsAuthenticated(true);

        const response = await fetch("/api/auth/getCurrentUser", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            logout();
            return;
        }

        const userData = await response.json();

        setUser(userData);
        setIsAuthenticated(true);

    };
    const logout = () => {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, role: user?.role ?? null }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};