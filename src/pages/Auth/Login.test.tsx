import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { authService } from '../../services/api/auth_service';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock do authService
vi.mock('../../services/api/auth_service', () => ({
    authService: {
        login: vi.fn(),
        getToken: vi.fn(),
        refreshToken: vi.fn(),
        logout: vi.fn(),
    },
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(authService.getToken).mockReturnValue(null);
    });

    it('deve renderizar o formulário de login corretamente', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('deve chamar o serviço de login com as credenciais corretas', async () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({ username: 'admin', password: '123456' });
        });
    });

    it('deve redirecionar para /pets após login bem-sucedido', async () => {
        vi.mocked(authService.login).mockResolvedValue({ token: 'fake-token' } as any);

        render(
            <AuthProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            // Updated to match the replace: true option if added in Login.tsx
            expect(mockNavigate).toHaveBeenCalledWith('/pets', expect.any(Object));
        });
    });

    it('deve exibir mensagem de erro quando o login falha', async () => {
        vi.mocked(authService.login).mockRejectedValue(new Error('Credenciais inválidas'));

        render(
            <AuthProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Falha no login');
        });
    });

    it('deve mostrar estado de loading durante a requisição', async () => {
        // Promise que não se resolve imediatamente para testar o loading state
        vi.mocked(authService.login).mockReturnValue(new Promise(() => { }));

        render(
            <AuthProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            expect(screen.getByRole('button')).toHaveTextContent(/entrando/i);
            expect(screen.getByRole('button')).toBeDisabled();
        });
    });
});
