import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest, ApiError } from '@/services/api'
import { useToast } from '@/store'
import {
  AuthResponse,
  LoginRequest,
  Gate,
  Zone,
  Category,
  Subscription,
  CheckinRequest,
  CheckinResponse,
  CheckoutRequest,
  CheckoutResponse,
  User,
  ParkingStateReport,
} from '@/types/api'

// Query keys
export const QUERY_KEYS = {
  gates: ['gates'],
  zones: (gateId?: string) => gateId ? ['zones', gateId] : ['zones'],
  categories: ['categories'],
  subscription: (id: string) => ['subscription', id],
  adminUsers: ['admin', 'users'],
  adminCategories: ['admin', 'categories'],
  adminZones: ['admin', 'zones'],
  adminReports: ['admin', 'reports'],
} as const

// ==================== AUTHENTICATION ====================

export function useLogin() {
  const toast = useToast()
  
  return useMutation({
    mutationFn: (credentials: LoginRequest): Promise<AuthResponse> =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onError: (error: ApiError) => {
      toast.error('Login failed', error.message)
    },
  })
}

// ==================== MASTER DATA ====================

export function useGates() {
  return useQuery({
    queryKey: QUERY_KEYS.gates,
    queryFn: (): Promise<Gate[]> => apiRequest('/master/gates'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useZonesByGate(gateId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.zones(gateId),
    queryFn: (): Promise<Zone[]> => apiRequest(`/master/zones?gateId=${gateId}`),
    enabled: !!gateId,
    staleTime: 1 * 60 * 1000, // 1 minute - zones change frequently
  })
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: (): Promise<Category[]> => apiRequest('/master/categories'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ==================== SUBSCRIPTIONS ====================

export function useSubscription(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.subscription(id),
    queryFn: (): Promise<Subscription> => apiRequest(`/subscriptions/${id}`),
    enabled: !!id && id.length > 0,
    retry: false, // Don't retry on 404
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// ==================== TICKETS ====================

export function useCheckin() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (request: CheckinRequest): Promise<CheckinResponse> =>
      apiRequest('/tickets/checkin', {
        method: 'POST',
        body: JSON.stringify(request),
      }),
    onSuccess: (data, variables) => {
      toast.success('Check-in successful!')
      
      // Invalidate zone data to refresh availability
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.zones(variables.gateId) 
      })
      
      // Update the specific zone in cache if we have the updated state
      if (data.zoneState) {
        queryClient.setQueryData(
          QUERY_KEYS.zones(variables.gateId), 
          (oldZones: Zone[] | undefined) => {
            if (!oldZones) return [data.zoneState]
            return oldZones.map(zone => 
              zone.id === data.zoneState.id ? data.zoneState : zone
            )
          }
        )
      }
    },
    onError: (error: ApiError) => {
      toast.error('Check-in failed', error.message)
    },
  })
}

export function useCheckout() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (request: CheckoutRequest): Promise<CheckoutResponse> =>
      apiRequest('/tickets/checkout', {
        method: 'POST',
        body: JSON.stringify(request),
      }),
    onSuccess: (data) => {
      toast.success('Check-out successful!')
      
      // Invalidate all zone queries to refresh availability
      queryClient.invalidateQueries({ 
        queryKey: ['zones'] 
      })
    },
    onError: (error: ApiError) => {
      toast.error('Check-out failed', error.message)
    },
  })
}

// ==================== ADMIN - USERS ====================

export function useAdminUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.adminUsers,
    queryFn: (): Promise<User[]> => apiRequest('/admin/users'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (user: Omit<User, 'id'> & { password: string }): Promise<User> =>
      apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(user),
      }),
    onSuccess: () => {
      toast.success('User created successfully!')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to create user', error.message)
    },
  })
}

// ==================== ADMIN - CATEGORIES ====================

export function useAdminCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.adminCategories,
    queryFn: (): Promise<Category[]> => apiRequest('/admin/categories'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Category>): Promise<Category> =>
      apiRequest(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success('Category updated successfully!')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminCategories })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to update category', error.message)
    },
  })
}

// ==================== ADMIN - ZONES ====================

export function useAdminZones() {
  return useQuery({
    queryKey: QUERY_KEYS.adminZones,
    queryFn: (): Promise<Zone[]> => apiRequest('/admin/zones'),
    staleTime: 1 * 60 * 1000,
  })
}

export function useUpdateZoneStatus() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, open }: { id: string; open: boolean }): Promise<Zone> =>
      apiRequest(`/admin/zones/${id}/open`, {
        method: 'PUT',
        body: JSON.stringify({ open }),
      }),
    onSuccess: (_, variables) => {
      toast.success(`Zone ${variables.open ? 'opened' : 'closed'} successfully!`)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminZones })
      queryClient.invalidateQueries({ queryKey: ['zones'] })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to update zone status', error.message)
    },
  })
}

// ==================== ADMIN - REPORTS ====================

export function useParkingStateReport() {
  return useQuery({
    queryKey: QUERY_KEYS.adminReports,
    queryFn: (): Promise<ParkingStateReport[]> => apiRequest('/admin/reports/parking-state'),
    staleTime: 30 * 1000, // 30 seconds - reports need to be fresh
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  })
}

// ==================== ADMIN - RUSH HOURS & VACATIONS ====================

export function useAdminRushHours() {
  return useQuery({
    queryKey: ['admin', 'rushHours'],
    queryFn: (): Promise<{ id: string; weekDay: number; from: string; to: string }[]> => 
      apiRequest('/admin/rush-hours'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateRushHour() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (rushHour: { weekDay: number; from: string; to: string }) => 
      apiRequest('/admin/rush-hours', {
        method: 'POST',
        body: JSON.stringify(rushHour),
      }),
    onSuccess: () => {
      toast.success('Rush hour added successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'rushHours'] })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to add rush hour', error.message)
    },
  })
}

export function useDeleteRushHour() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id: string): Promise<void> =>
      apiRequest(`/admin/rush-hours/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('Rush hour deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'rushHours'] })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to delete rush hour', error.message)
    },
  })
}

export function useAdminVacations() {
  return useQuery({
    queryKey: ['admin', 'vacations'],
    queryFn: (): Promise<{ id: string; name: string; from: string; to: string }[]> => 
      apiRequest('/admin/vacations'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateVacation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (vacation: { name: string; from: string; to: string }) => 
      apiRequest('/admin/vacations', {
        method: 'POST',
        body: JSON.stringify(vacation),
      }),
    onSuccess: () => {
      toast.success('Vacation period added successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'vacations'] })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to add vacation period', error.message)
    },
  })
}

export function useDeleteVacation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id: string): Promise<void> =>
      apiRequest(`/admin/vacations/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('Vacation period deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'vacations'] })
    },
    onError: (error: ApiError) => {
      toast.error('Failed to delete vacation period', error.message)
    },
  })
}