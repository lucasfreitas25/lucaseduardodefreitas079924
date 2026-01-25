import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import PetList from './pages/Pets/PetList';
import PetDetails from './pages/Pets/PetDetails';
import PetEdit from './pages/Pets/PetEdit';
import PetAdd from './pages/Pets/PetAdd';


import TutorList from './pages/Tutors/TutorList';

import { PrivateRoute } from './components/Auth/PrivateRoute';
import Login from './pages/Auth/Login';
import TutorAdd from './pages/Tutors/TutorAdd';
import TutorEdit from './pages/Tutors/TutorEdit';

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
                        path: 'pets/new',
                        element: <PetAdd />,
                    },
                    {
                        path: 'pets/:id',
                        element: <PetDetails />,
                    },
                    {
                        path: 'pets/:id/edit',
                        element: <PetEdit />,
                    },
                    {
                        path: 'tutors',
                        element: <TutorList />
                    },
                    {
                        path: 'tutors/new',
                        element: <TutorAdd />,
                    },
                    {
                        path: 'tutors/:id/edit',
                        element: <TutorEdit />,
                    },
                ],
            },
        ],
    },
]);
