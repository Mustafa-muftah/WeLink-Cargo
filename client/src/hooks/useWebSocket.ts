import { useEffect, useCallback } from 'react'
import { getWebSocketService, WebSocketConnectionState } from '@/services/websocket'
import { WebSocketZoneUpdate, WebSocketAdminUpdate } from '@/types/api'
import { useUIStore } from '@/store'

interface UseWebSocketOptions {
  onZoneUpdate?: (update: WebSocketZoneUpdate) => void
  onAdminUpdate?: (update: WebSocketAdminUpdate) => void
  onError?: (error: Event) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const setWsConnectionState = useUIStore(state => state.setWsConnectionState)
  const addAuditLogEntry = useUIStore(state => state.addAuditLogEntry)

  const wsService = getWebSocketService()

  // Setup event listeners
  useEffect(() => {
    // Connection state changes
    wsService.setOnConnectionStateChange((state: WebSocketConnectionState) => {
      setWsConnectionState(state)
      console.log('WebSocket connection state changed:', state)
    })

    // Zone updates
    wsService.setOnZoneUpdate((update: WebSocketZoneUpdate) => {
      console.log('Zone update received:', update)
      options.onZoneUpdate?.(update)
    })

    // Admin updates
    wsService.setOnAdminUpdate((update: WebSocketAdminUpdate) => {
      console.log('Admin update received:', update)
      
      // Add to audit log with better formatting
      const actionText = update.payload.action.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())
      const detailsText = `${update.payload.targetType}: ${update.payload.targetId}`
      
      addAuditLogEntry({
        timestamp: update.payload.timestamp,
        adminId: update.payload.adminId,
        action: update.payload.action,
        details: detailsText,
      })
      
      console.log('Added audit log entry:', {
        action: actionText,
        details: detailsText,
        adminId: update.payload.adminId,
        timestamp: update.payload.timestamp
      })
      
      options.onAdminUpdate?.(update)
    })

    // Error handling
    wsService.setOnError((error: Event) => {
      console.error('WebSocket error:', error)
      options.onError?.(error)
    })

    // Initialize connection
    wsService.connect()

    // Cleanup on unmount
    return () => {
      // Don't disconnect on unmount as we want to keep the connection
      // across page navigation. The service manages its own lifecycle.
    }
  }, [options, setWsConnectionState, addAuditLogEntry])

  const subscribeToGate = useCallback((gateId: string) => {
    console.log('Subscribing to gate:', gateId)
    wsService.subscribeToGate(gateId)
  }, [])

  const unsubscribeFromGate = useCallback((gateId: string) => {
    console.log('Unsubscribing from gate:', gateId)
    wsService.unsubscribeFromGate(gateId)
  }, [])

  const disconnect = useCallback(() => {
    console.log('Disconnecting WebSocket')
    wsService.disconnect()
  }, [])

  const connect = useCallback(() => {
    console.log('Connecting WebSocket')
    wsService.connect()
  }, [])

  return {
    connectionState: wsService.getConnectionState(),
    isConnected: wsService.isConnected(),
    subscribeToGate,
    unsubscribeFromGate,
    disconnect,
    connect,
  }
}

