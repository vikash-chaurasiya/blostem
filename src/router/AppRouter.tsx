import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <GuestRoute />,
        children: [{ index: true, element: <LoginPage /> }],
    },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            { index: true, element: <DashboardPage /> },
        ],
    },
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}
