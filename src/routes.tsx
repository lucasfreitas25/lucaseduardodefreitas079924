import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import Login from './pages/Auth/Login';
import PetAdd from './pages/Pets/PetAdd';
import TutorAdd from './pages/Tutors/TutorAdd';

const PetDetails = lazy(() => import('./pages/Pets/PetDetails'));
const PetEdit = lazy(() => import('./pages/Pets/PetEdit'));
const TutorEdit = lazy(() => import('./pages/Tutors/TutorEdit'));
const PetIndex = lazy(() => import('./pages/Pets/PetIndex'));
const TutorIndex = lazy(() => import('./pages/Tutors/TutorIndex'));

import { PrivateRoute } from './components/Auth/PrivateRoute';

// Aplicando lazy load nas rotas
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Login />
        ),
    },
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/pets" replace />,
                    },
                    {
                        path: 'pets',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <PetIndex />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'pets/new',
                        element: (
                            <PetAdd />
                        ),
                    },
                    {
                        path: 'pets/:id',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <PetDetails />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'pets/:id/edit',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <PetEdit />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'tutors',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <TutorIndex />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'tutors/new',
                        element: (
                            <TutorAdd />
                        ),
                    },
                    {
                        path: 'tutors/:id/edit',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <TutorEdit />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
]);
