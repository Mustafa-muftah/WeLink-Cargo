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
    })

    // Zone updates
    wsService.setOnZoneUpdate((update: WebSocketZoneUpdate) => {
      options.onZoneUpdate?.(update)
    })

    // Admin updates
    wsService.setOnAdminUpdate((update: WebSocketAdminUpdate) => {
      // Add to audit log
      addAuditLogEntry({
        timestamp: update.payload.timestamp,
        adminId: update.payload.adminId,
        action: update.payload.action,
        details: `${update.payload.targetType}: ${update.payload.targetId}`,
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
    wsService.subscribeToGate(gateId)
  }, [])

  const unsubscribeFromGate = useCallback((gateId: string) => {
    wsService.unsubscribeFromGate(gateId)
  }, [])

  const disconnect = useCallback(() => {
    wsService.disconnect()
  }, [])

  const connect = useCallback(() => {
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