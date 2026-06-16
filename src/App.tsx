import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/providers/QueryProvider'
import { useAuthStore } from '@/store/auth.store'
import AppRouter from '@/router/AppRouter'

function AppInit() {
    const restoreSession = useAuthStore((s) => s.restoreSession)

    useEffect(() => {
        restoreSession()
    }, [restoreSession])

    return <AppRouter />
}

export default function App() {
    return (
        <QueryProvider>
            <AppInit />
            <Toaster position="top-right" />
        </QueryProvider>
    )
}
