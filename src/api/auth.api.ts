import apiClient from './client'
import type { AuthResponse, User, ProfileUser, RefreshTokenResponse } from '@/types/auth'

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { username, password })
    return data
}

// Used only for silent session restore on load — a 401 here should quietly
// fail (the auth store handles cleanup), not redirect off a public page.
export const getMe = async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me', { _skipAuthRedirect: true })
    return data
}

export const getProfile = async (): Promise<ProfileUser> => {
    const { data } = await apiClient.get<ProfileUser>('/auth/me')
    return data
}

export const refreshToken = async (token: string): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken: token,
    })
    return data
}
