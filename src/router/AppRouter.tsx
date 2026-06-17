import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import LoginPage from '@/pages/LoginPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import DashboardPage from '@/pages/DashboardPage'
import CategoriesPage from '@/pages/CategoriesPage'
import ProfilePage from '@/pages/ProfilePage'

function Layout() {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            // Public — accessible without login
            { path: '/', element: <ProductsPage /> },
            { path: '/product/:id', element: <ProductDetailPage /> },
            { path: '/categories', element: <CategoriesPage /> },

            // Guest-only — redirect away if already logged in
            {
                element: <GuestRoute />,
                children: [
                    { path: '/login', element: <LoginPage /> },
                ],
            },

            // Protected — require login
            {
                element: <ProtectedRoute />,
                children: [
                    { path: '/favorites', element: <DashboardPage /> }, // placeholder
                    { path: '/profile', element: <ProfilePage /> },
                ],
            },
        ],
    },
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}
