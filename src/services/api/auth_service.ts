import axios from 'axios';
import type { LoginCredentials, AuthResponse } from '../../types';

// Using a separate axios instance or absolute URL for auth trying to avoid circular dependencies or base URL conflicts
// But strictly speaking, if the auth endpoint is on the same server, we can use 'api' instance IF we are careful about interceptors.
// However, the base URL for 'api' is /v1. Auth is at /autenticacao. So we need a different Base URL or absolute path.

const AUTH_URL = 'https://pet-manager-api.geia.vip/autenticacao';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${AUTH_URL}/login`, credentials);
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            if (response.data.refresh_token) {
                localStorage.setItem('refresh_token', response.data.refresh_token);
            }
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    },

    getToken: () => localStorage.getItem('token'),

    isAuthenticated: () => !!localStorage.getItem('token'),
};
