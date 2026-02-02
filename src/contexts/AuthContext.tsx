import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/api/auth_service';
import type { LoginCredentials } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    login: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = authService.getToken();

        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            // Verificar expiração
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            const now = Date.now();

            if (now >= exp) {
                // Token expirado, tentar refresh
                console.log("Token expirado, tentando refresh...");
                await authService.refreshToken();
                setIsAuthenticated(true);
            } else {

                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Erro na verificação de autenticação:", error);
            authService.logout();
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await authService.login(credentials);
        setIsAuthenticated(true);
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
