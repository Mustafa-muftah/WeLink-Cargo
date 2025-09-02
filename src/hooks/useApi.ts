import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest, ApiError } from '../services/api'
import { useToast } from '../store'
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
} from '../types/api'

// Query keys
export const QUERY_KEYS = {
  gates: ['gates'],
  zones: (gateId?: string) => gateId ? ['zones', gateId] : ['zones'],
  categories: ['categories'],
  subscription: (id: string) => ['subscription', id],
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