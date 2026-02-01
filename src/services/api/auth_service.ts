import axios from 'axios';
import type { LoginCredentials, AuthResponse } from '../../types';


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

    refreshToken: async (): Promise<AuthResponse> => {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.put<AuthResponse>(`${AUTH_URL}/refresh`, {
            refresh_token: refreshToken,
        });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            if (response.data.refresh_token) {
                localStorage.setItem('refresh_token', response.data.refresh_token);
            }
        }
        return response.data;
    },
};
