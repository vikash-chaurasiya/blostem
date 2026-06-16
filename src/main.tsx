import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useThemeStore } from '@/store/theme.store'

// Apply persisted theme before first render to avoid dark/light flash
const { mode } = useThemeStore.getState()
document.documentElement.classList.toggle('dark', mode === 'dark')

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
