import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';

// Lazy load pages
const PetList = lazy(() => import('./pages/Pets/PetList'));
const PetDetails = lazy(() => import('./pages/Pets/PetDetails'));
const PetEdit = lazy(() => import('./pages/Pets/PetEdit'));
const PetAdd = lazy(() => import('./pages/Pets/PetAdd'));
const TutorList = lazy(() => import('./pages/Tutors/TutorList'));
const Login = lazy(() => import('./pages/Auth/Login'));
const TutorAdd = lazy(() => import('./pages/Tutors/TutorAdd'));
const TutorEdit = lazy(() => import('./pages/Tutors/TutorEdit'));

import { PrivateRoute } from './components/Auth/PrivateRoute';

// Loading fallback component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<PageLoader />}>
                <Login />
            </Suspense>
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
                                <PetList />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'pets/new',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <PetAdd />
                            </Suspense>
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
                                <TutorList />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'tutors/new',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <TutorAdd />
                            </Suspense>
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
