import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import DashboardPage from '@/pages/DashboardPage'

export const router = createBrowserRouter([
    // Public — accessible without login
    { path: '/', element: <ProductsPage /> },
    { path: '/product/:id', element: <ProductDetailPage /> },
    { path: '/login', element: <LoginPage /> },

    // Protected — require login
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/favorites', element: <DashboardPage /> }, // placeholder
            { path: '/profile', element: <DashboardPage /> },   // placeholder
        ],
    },
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}
