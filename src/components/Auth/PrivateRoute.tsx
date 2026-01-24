import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/api/auth_service';

export function PrivateRoute() {
    const isAuthenticated = authService.isAuthenticated();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
