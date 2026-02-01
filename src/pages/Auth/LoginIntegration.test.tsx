import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../../contexts/AuthContext';
import { authService } from '../../services/api/auth_service';

// Mock authService
vi.mock('../../services/api/auth_service', () => ({
    authService: {
        login: vi.fn(),
        getToken: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
    },
}));

describe('Login Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: no token
        vi.mocked(authService.getToken).mockReturnValue(null);
    });

    const renderLogin = () => {
        return render(
            <AuthProvider>
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/pets" element={<div>Pets Dashboard</div>} />
                    </Routes>
                </MemoryRouter>
            </AuthProvider>
        );
    };

    it('should update context state and redirect after successful login', async () => {
        // Setup mock success
        vi.mocked(authService.login).mockResolvedValue({ access_token: 'valid', refresh_token: 'valid' } as any);

        renderLogin();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/Usuário/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByPlaceholderText(/Senha/i), { target: { value: 'password' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

        await waitFor(() => {
            // Check if redirect happened
            expect(screen.getByText('Pets Dashboard')).toBeInTheDocument();
        });

        expect(authService.login).toHaveBeenCalled();
    });
});
