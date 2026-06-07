import http from './http'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types'

export const authApi = {
  login(data: LoginRequest) {
    return http.post<LoginResponse>('/auth/login', data)
  },

  register(data: RegisterRequest) {
    return http.post<User>('/auth/register', data)
  },

  logout() {
    return http.post<{ message: string }>('/auth/logout')
  },
}
