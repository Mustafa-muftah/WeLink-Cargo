import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '../types/api'
import { STORAGE_KEYS } from '../utlis/constants'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
  hasRole: (role: 'admin' | 'employee') => boolean
  isAdmin: () => boolean
  isEmployee: () => boolean
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (user: User, token: string) => {
        // Store token in localStorage for API calls
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
        }
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        }
        
        set(initialState)
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        }
        set(initialState)
      },

      hasRole: (role: 'admin' | 'employee') => {
        const { user } = get()
        if (!user) return false
        
        if (role === 'admin') {
          return user.role === 'admin'
        }
        
        if (role === 'employee') {
          return user.role === 'employee' || user.role === 'admin'
        }
        
        return false
      },

      isAdmin: () => get().hasRole('admin'),

      isEmployee: () => get().hasRole('employee'),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage on client side
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      // Only persist user data, not sensitive token
      partialize: (state) => ({ 
        user: state.user,
        // Note: token is stored separately in localStorage for API calls
      }),
    }
  )
)