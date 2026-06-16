import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export default function ProtectedRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const isInitialized = useAuthStore((s) => s.isInitialized)
    const location = useLocation()

    if (!isInitialized) return null

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
}
