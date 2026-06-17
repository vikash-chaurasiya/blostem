import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

/**
 * Guards guest-only routes (e.g. /login).
 * An authenticated user is redirected away — back to the page they
 * originally came from if available, otherwise home.
 */
export default function GuestRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const isInitialized = useAuthStore((s) => s.isInitialized)
    const location = useLocation()

    if (!isInitialized) return null

    if (isAuthenticated) {
        const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'
        return <Navigate to={from} replace />
    }

    return <Outlet />
}
