import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

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
            navigate(from, { replace: true })
        } catch {
            setApiError('Invalid username or password.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
                    Sign in
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                        <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
                    )}

                    <Button type="submit" loading={isSubmitting} className="w-full mt-2">
                        Sign in
                    </Button>
                </form>

                <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Test credentials</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">username: <span className="font-mono">emilys</span></p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">password: <span className="font-mono">emilyspass</span></p>
                </div>
            </div>
        </div>
    )
}
