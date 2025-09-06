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
  
  // Deduplication tracking for admin updates
  processedAdminUpdates: Set<string>
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
  processedAdminUpdates: new Set(),
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

  // Admin audit log actions with deduplication
  addAuditLogEntry: (entry: Omit<UIState['adminAuditLog'][0], 'id'>) => {
    const state = get()
    
    // Create a unique key for this admin update based on timestamp, adminId, action, and details
    const updateKey = `${entry.timestamp}-${entry.adminId}-${entry.action}-${entry.details}`
    
    // Check if we've already processed this update
    if (state.processedAdminUpdates.has(updateKey)) {
      console.log('Duplicate admin update detected, skipping:', updateKey)
      return
    }
    
    const id = Math.random().toString(36).substr(2, 9)
    const newEntry = { id, ...entry }
    
    // Add the update key to processed set and the entry to the log
    const newProcessedUpdates = new Set(state.processedAdminUpdates)
    newProcessedUpdates.add(updateKey)
    
    // Keep only the last 100 processed updates to prevent memory leaks
    if (newProcessedUpdates.size > 100) {
      const updatesArray = Array.from(newProcessedUpdates)
      const recentUpdates = updatesArray.slice(-50) // Keep last 50
      newProcessedUpdates.clear()
      recentUpdates.forEach(key => newProcessedUpdates.add(key))
    }
    
    set(state => ({
      adminAuditLog: [newEntry, ...state.adminAuditLog].slice(0, 50), // Keep last 50 entries
      processedAdminUpdates: newProcessedUpdates
    }))
    
    console.log('Added unique audit log entry:', {
      updateKey,
      action: entry.action,
      details: entry.details,
      adminId: entry.adminId,
      timestamp: entry.timestamp
    })
  },

  clearAuditLog: () => set({ 
    adminAuditLog: [],
    processedAdminUpdates: new Set() // Clear processed updates when clearing log
  }),
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

