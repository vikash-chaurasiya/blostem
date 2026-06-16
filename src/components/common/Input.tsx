import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
                        border-gray-300 bg-white text-gray-900 placeholder-gray-400
                        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                        dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
                        dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
export default Input
