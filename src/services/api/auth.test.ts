import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';
import { authService } from './auth_service';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('authService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('login deveria armazenar tokens e retornar dados', async () => {
        const mockResponse = {
            data: {
                access_token: 'fake-access-token',
                refresh_token: 'fake-refresh-token'
            }
        };
        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await authService.login({ username: 'admin', password: 'password' });

        expect(mockedAxios.post).toHaveBeenCalledWith(expect.stringContaining('/login'), {
            username: 'admin',
            password: 'password'
        });
        expect(localStorage.getItem('token')).toBe('fake-access-token');
        expect(localStorage.getItem('refresh_token')).toBe('fake-refresh-token');
        expect(result).toEqual(mockResponse.data);
    });

    it('logout deveria limpar os tokens', () => {
        localStorage.setItem('token', 'token');
        localStorage.setItem('refresh_token', 'refresh');

        // Mock window.location.href
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, href: '' },
        });

        authService.logout();

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });

    it('isAuthenticated deveria retornar true se o token existir', () => {
        localStorage.setItem('token', 'exists');
        expect(authService.isAuthenticated()).toBe(true);
    });

    it('isAuthenticated deveria retornar false se o token não existir', () => {
        expect(authService.isAuthenticated()).toBe(false);
    });

    it('refreshToken deveria atualizar os tokens', async () => {
        localStorage.setItem('refresh_token', 'old-refresh');
        const mockResponse = {
            data: {
                access_token: 'new-access-token',
                refresh_token: 'new-refresh-token'
            }
        };
        mockedAxios.put.mockResolvedValue(mockResponse);

        const result = await authService.refreshToken();

        expect(mockedAxios.put).toHaveBeenCalledWith(expect.stringContaining('/refresh'), {
            refresh_token: 'old-refresh'
        });
        expect(localStorage.getItem('token')).toBe('new-access-token');
        expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token');
        expect(result).toEqual(mockResponse.data);
    });
});
