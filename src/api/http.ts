import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { handleMockRequest } from './mock'

const http = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach Bearer token
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Mock request interceptor — runs AFTER token (LIFO order).
// If mock mode is on and the request matches, override config.adapter
// to return fake data directly — no network call, no throwing.
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const useMock = localStorage.getItem('use_mock') !== 'false'
  console.log('[Mock] useMock:', useMock, 'url:', config.url)
  if (useMock) {
    const mockRes = handleMockRequest(config)
    console.log('[Mock] handleMockRequest result:', mockRes)
    if (mockRes) {
      // Override the adapter for THIS request only
      config.adapter = () => Promise.resolve(mockRes as unknown as AxiosResponse)
      console.log('[Mock] Adapter overridden for:', config.url)
    }
  }
  return config
})

// Response interceptor — unified error handling
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    if (error.response) {
      const { status } = error.response
      const detail = error.response.data?.detail
      switch (status) {
        case 401:
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          message.error(detail || '权限不足')
          break
        case 404:
          message.error(detail || '资源不存在')
          break
        case 500:
          message.error(detail || '服务器内部错误，请稍后重试')
          break
        default:
          if (status >= 400) {
            message.error(detail || `请求失败 (${status})`)
          }
      }
    } else if (error.request) {
      // Quiet during mock development — only warn if mock mode is off
      if (localStorage.getItem('use_mock') === 'false') {
        message.error('网络连接失败，请检查后端服务是否启动')
      }
    }
    return Promise.reject(error)
  },
)

export default http
