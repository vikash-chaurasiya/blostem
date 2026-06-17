import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/providers/QueryProvider'
import { useAuthStore } from '@/store/auth.store'
import AppRouter from '@/router/AppRouter'
import ErrorBoundary from '@/components/common/ErrorBoundary'

function AppInit() {
    const restoreSession = useAuthStore((s) => s.restoreSession)

    useEffect(() => {
        restoreSession()
    }, [restoreSession])

    return <AppRouter />
}

export default function App() {
    return (
        <ErrorBoundary>
        <QueryProvider>
            <AppInit />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "var(--bg-card)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        fontSize: "0.8125rem",
                    },
                    success: { iconTheme: { primary: "var(--moss)", secondary: "var(--bg-card)" } },
                    error: { iconTheme: { primary: "var(--red-err)", secondary: "var(--bg-card)" } },
                }}
            />
        </QueryProvider>
        </ErrorBoundary>
    )
}
