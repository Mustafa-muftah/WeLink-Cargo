import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock the store
jest.mock('@/store/authStore')
jest.mock('@/store/uiStore', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }),
}))

// Mock API hook
jest.mock('@/hooks/useApi', () => ({
  useLogin: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

describe('useAuth', () => {
  const mockAuthStore = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    setLoading: jest.fn(),
    hasRole: jest.fn(),
    isAdmin: jest.fn(),
    isEmployee: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthStore.mockReturnValue(mockAuthStore)
  })

  it('should return correct initial state', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle logout correctly', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(mockAuthStore.logout).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('should check authentication requirement', () => {
    const { result } = renderHook(() => useAuth())

    const isAuthenticated = result.current.requireAuth()

    expect(isAuthenticated).toBe(false)
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('should check role requirements for admin', () => {
    mockAuthStore.isAuthenticated = true
    mockAuthStore.hasRole.mockReturnValue(false)

    const { result } = renderHook(() => useAuth())

    const hasAdminRole = result.current.requireRole('admin')

    expect(hasAdminRole).toBe(false)
    expect(mockAuthStore.hasRole).toHaveBeenCalledWith('admin')
  })

  it('should allow access for authenticated admin', () => {
    mockAuthStore.isAuthenticated = true
    mockAuthStore.hasRole.mockReturnValue(true)

    const { result } = renderHook(() => useAuth())

    const hasAdminRole = result.current.requireRole('admin')

    expect(hasAdminRole).toBe(true)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should handle role checking functions', () => {
    mockAuthStore.isAdmin.mockReturnValue(true)
    mockAuthStore.isEmployee.mockReturnValue(false)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAdmin()).toBe(true)
    expect(result.current.isEmployee()).toBe(false)
  })
})