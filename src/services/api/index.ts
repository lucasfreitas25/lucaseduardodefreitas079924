import axios from 'axios';
import { authService } from './auth_service';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://pet-manager-api.geia.vip/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await authService.refreshToken();
                if (response.access_token) {
                    // Update header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, logout
                authService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

