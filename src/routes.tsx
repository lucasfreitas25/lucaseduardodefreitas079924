import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import PetList from './pages/Pets/PetList';
import React, { Suspense } from 'react';

// Lazy loading Tutors module
const TutorList = React.lazy(() => import('./pages/Tutors/TutorList'));

import { PrivateRoute } from './components/Auth/PrivateRoute';
import Login from './pages/Auth/Login';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
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
                        element: <PetList />,
                    },
                    {
                        path: 'tutors',
                        element: (
                            <Suspense fallback={<div className="p-4 text-center">Carregando módulo...</div>}>
                                <TutorList />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
]);
