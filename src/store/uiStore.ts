import { create } from 'zustand'
import { WebSocketConnectionState } from '../services/websocket'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface Modal {
  id: string
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  onClose?: () => void
}

interface UIState {
  // Loading states
  isLoading: boolean
  loadingMessage?: string
  
  // WebSocket connection state
  wsConnectionState: WebSocketConnectionState
  
  // Toast notifications
  toasts: Toast[]
  
  // Modal management
  modals: Modal[]
  
  // Gate-specific UI state
  selectedGateTab: 'visitor' | 'subscriber'
  selectedZoneId: string | null
  
  // Admin audit log
  adminAuditLog: Array<{
    id: string
    timestamp: string
    adminId: string
    action: string
    details: string
  }>
}

interface UIActions {
  // Loading
  setLoading: (loading: boolean, message?: string) => void
  
  // WebSocket
  setWsConnectionState: (state: WebSocketConnectionState) => void
  
  // Toasts
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Modals
  openModal: (modal: Omit<Modal, 'isOpen'>) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
  
  // Gate UI
  setSelectedGateTab: (tab: 'visitor' | 'subscriber') => void
  setSelectedZone: (zoneId: string | null) => void
  
  // Admin audit log
  addAuditLogEntry: (entry: Omit<UIState['adminAuditLog'][0], 'id'>) => void
  clearAuditLog: () => void
}

type UIStore = UIState & UIActions

const initialState: UIState = {
  isLoading: false,
  loadingMessage: undefined,
  wsConnectionState: 'disconnected',
  toasts: [],
  modals: [],
  selectedGateTab: 'visitor',
  selectedZoneId: null,
  adminAuditLog: [],
}

export const useUIStore = create<UIStore>((set, get) => ({
  ...initialState,

  // Loading actions
  setLoading: (isLoading: boolean, loadingMessage?: string) =>
    set({ isLoading, loadingMessage }),

  // WebSocket actions
  setWsConnectionState: (wsConnectionState: WebSocketConnectionState) =>
    set({ wsConnectionState }),

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast,
    }
    
    set(state => ({
      toasts: [...state.toasts, newToast]
    }))

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }
  },

  removeToast: (id: string) =>
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    })),

  clearToasts: () => set({ toasts: [] }),

  // Modal actions
  openModal: (modal: Omit<Modal, 'isOpen'>) =>
    set(state => ({
      modals: [...state.modals, { ...modal, isOpen: true }]
    })),

  closeModal: (id: string) =>
    set(state => ({
      modals: state.modals.map(modal => 
        modal.id === id ? { ...modal, isOpen: false } : modal
      )
    })),

  closeAllModals: () =>
    set(state => ({
      modals: state.modals.map(modal => ({ ...modal, isOpen: false }))
    })),

  // Gate UI actions
  setSelectedGateTab: (selectedGateTab: 'visitor' | 'subscriber') =>
    set({ selectedGateTab }),

  setSelectedZone: (selectedZoneId: string | null) =>
    set({ selectedZoneId }),

  // Admin audit log actions
  addAuditLogEntry: (entry: Omit<UIState['adminAuditLog'][0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newEntry = { id, ...entry }
    
    set(state => ({
      adminAuditLog: [newEntry, ...state.adminAuditLog].slice(0, 50) // Keep last 50 entries
    }))
  },

  clearAuditLog: () => set({ adminAuditLog: [] }),
}))

// Convenience hooks for common toast types
export const useToast = () => {
  const addToast = useUIStore(state => state.addToast)
  
  return {
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
  }
}