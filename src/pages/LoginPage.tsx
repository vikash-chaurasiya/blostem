import { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof schema>

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const login = useAuthStore((s) => s.login)
    const [apiError, setApiError] = useState('')

    useDocumentTitle('Sign in')

    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({ resolver: zodResolver(schema) })

    const onSubmit = async (values: LoginFormData) => {
        setApiError('')
        try {
            await login(values.username, values.password)
            toast.success('Welcome back!')
            navigate(from, { replace: true })
        } catch {
            setApiError('Username or password is incorrect.')
            toast.error('Login failed — check your credentials.')
        }
    }

    return (
        <div
            style={{
                minHeight: "calc(100vh - 3.5rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--bg)",
                padding: "2rem 1rem",
            }}
        >
            <div style={{ width: "100%", maxWidth: "22rem" }}>

                {/* Brand mark */}
                <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
                    <span
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.75rem",
                            fontWeight: 700,
                            color: "var(--text)",
                            letterSpacing: "-0.02em",
                            display: "block",
                            marginBottom: "0.5rem",
                        }}
                    >
                        Blostem
                    </span>
                    <p
                        style={{
                            fontSize: "0.8125rem",
                            color: "var(--stone-400)",
                            letterSpacing: "0.01em",
                        }}
                    >
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <Input
                        label="Username"
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register('username')}
                    />
                    <Input
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    {apiError && (
                        <p style={{ fontSize: "0.8125rem", color: "var(--red-err)" }}>{apiError}</p>
                    )}

                    <Button type="submit" loading={isSubmitting} style={{ width: "100%", marginTop: "0.5rem" }}>
                        Sign in
                    </Button>
                </form>

                {/* Test credentials hint */}
                <div
                    style={{
                        marginTop: "2rem",
                        padding: "0.875rem",
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--bg-card)",
                    }}
                >
                    <p
                        style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "var(--stone-400)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        Test credentials
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--stone-600)", marginBottom: "0.25rem" }}>
                        Username:{" "}
                        <span
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.75rem",
                                color: "var(--text)",
                            }}
                        >
                            emilys
                        </span>
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--stone-600)" }}>
                        Password:{" "}
                        <span
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.75rem",
                                color: "var(--text)",
                            }}
                        >
                            emilyspass
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
