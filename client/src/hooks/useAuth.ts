import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useToast } from '../store'
import { useLogin } from './useApi'
import { LoginRequest } from '../types/api'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()
  const loginMutation = useLogin()

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      authStore.setLoading(true)
      const response = await loginMutation.mutateAsync(credentials)
      
      authStore.login(response.user, response.token)
      toast.success('Login successful!')
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/checkpoint')
      }
      
      return { success: true, user: response.user }
    } catch (error: any) {
      const message = error.message || 'Login failed. Please check your credentials.'
      return { success: false, error: message }
    } finally {
      authStore.setLoading(false)
    }
  }, [authStore, router, toast, loginMutation])

  const logout = useCallback(() => {
    authStore.logout()
    router.push('/login')
    toast.info('Logged out successfully')
  }, [authStore, router, toast])

  const requireAuth = useCallback((redirectTo: string = '/login') => {
    if (!authStore.isAuthenticated) {
      router.push(redirectTo)
      return false
    }
    return true
  }, [authStore.isAuthenticated, router])

  const requireRole = useCallback((role: 'admin' | 'employee') => {
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return false
    }

    if (!authStore.hasRole(role)) {
      toast.error('Access denied', `This action requires ${role} permissions`)
      return false
    }

    return true
  }, [authStore, router, toast])

  return {
    // State
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading || loginMutation.isPending,
    
    // Role checks
    isAdmin: authStore.isAdmin,
    isEmployee: authStore.isEmployee,
    hasRole: authStore.hasRole,
    
    // Actions
    login,
    logout,
    requireAuth,
    requireRole,
  }
}