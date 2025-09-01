import {
    WebSocketMessage,
    WebSocketSubscribeMessage,
    WebSocketZoneUpdate,
    WebSocketAdminUpdate
  } from '../types/api'
  
  const WS_URL = process.env.WS_URL || 'ws://localhost:3000/api/v1/ws'
  
  export type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'
  
  export class WebSocketService {
    private ws: WebSocket | null = null
    private connectionState: WebSocketConnectionState = 'disconnected'
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectInterval = 1000 // 1 second, will increase exponentially
    private heartbeatInterval: NodeJS.Timeout | null = null
    private subscriptions = new Set<string>()
    
    // Event listeners
    private onConnectionStateChange: ((state: WebSocketConnectionState) => void) | null = null
    private onZoneUpdate: ((update: WebSocketZoneUpdate) => void) | null = null
    private onAdminUpdate: ((update: WebSocketAdminUpdate) => void) | null = null
    private onError: ((error: Event) => void) | null = null
  
    constructor() {
      if (typeof window !== 'undefined') {
        this.connect()
      }
    }
  
    // Connection management
    connect(): void {
      if (this.ws?.readyState === WebSocket.CONNECTING || 
          this.ws?.readyState === WebSocket.OPEN) {
        return
      }
  
      this.setConnectionState('connecting')
      
      try {
        this.ws = new WebSocket(WS_URL)
        this.setupEventListeners()
      } catch (error) {
        console.error('WebSocket connection failed:', error)
        this.setConnectionState('error')
        this.scheduleReconnect()
      }
    }
  
    disconnect(): void {
      this.clearHeartbeat()
      this.reconnectAttempts = 0
      
      if (this.ws) {
        this.ws.close(1000, 'Manual disconnect')
        this.ws = null
      }
      
      this.setConnectionState('disconnected')
    }
  
    private setupEventListeners(): void {
      if (!this.ws) return
  
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.setConnectionState('connected')
        this.reconnectAttempts = 0
        this.startHeartbeat()
        
        // Re-subscribe to previously subscribed gates
        this.subscriptions.forEach(gateId => {
          this.subscribeToGate(gateId)
        })
      }
  
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.setConnectionState('disconnected')
        this.clearHeartbeat()
        
        // Reconnect unless it was a manual disconnect
        if (event.code !== 1000) {
          this.scheduleReconnect()
        }
      }
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.setConnectionState('error')
        this.onError?.(error)
      }
  
      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
    }
  
    private handleMessage(message: WebSocketMessage): void {
      switch (message.type) {
        case 'zone-update':
          this.onZoneUpdate?.(message)
          break
        case 'admin-update':
          this.onAdminUpdate?.(message)
          break
        default:
          console.warn('Unknown message type:', message)
      }
    }
  
    private scheduleReconnect(): void {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
        return
      }
  
      const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts)
      this.reconnectAttempts++
      
      console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
      
      setTimeout(() => {
        if (this.connectionState !== 'connected') {
          this.connect()
        }
      }, delay)
    }
  
    private startHeartbeat(): void {
      this.heartbeatInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          // Send a ping message as heartbeat
          this.ws.send(JSON.stringify({ type: 'ping' }))
        }
      }, 30000) // Send heartbeat every 30 seconds
    }
  
    private clearHeartbeat(): void {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval)
        this.heartbeatInterval = null
      }
    }
  
    private setConnectionState(state: WebSocketConnectionState): void {
      this.connectionState = state
      this.onConnectionStateChange?.(state)
    }
  
    // Public methods
    subscribeToGate(gateId: string): void {
      this.subscriptions.add(gateId)
      
      if (this.ws?.readyState === WebSocket.OPEN) {
        const message: WebSocketSubscribeMessage = {
          type: 'subscribe',
          payload: { gateId }
        }
        this.ws.send(JSON.stringify(message))
      }
    }
  
    unsubscribeFromGate(gateId: string): void {
      this.subscriptions.delete(gateId)
      
      if (this.ws?.readyState === WebSocket.OPEN) {
        const message: WebSocketSubscribeMessage = {
          type: 'unsubscribe',
          payload: { gateId }
        }
        this.ws.send(JSON.stringify(message))
      }
    }
  
    // Event listeners
    setOnConnectionStateChange(callback: (state: WebSocketConnectionState) => void): void {
      this.onConnectionStateChange = callback
    }
  
    setOnZoneUpdate(callback: (update: WebSocketZoneUpdate) => void): void {
      this.onZoneUpdate = callback
    }
  
    setOnAdminUpdate(callback: (update: WebSocketAdminUpdate) => void): void {
      this.onAdminUpdate = callback
    }
  
    setOnError(callback: (error: Event) => void): void {
      this.onError = callback
    }
  
    // Getters
    getConnectionState(): WebSocketConnectionState {
      return this.connectionState
    }
  
    isConnected(): boolean {
      return this.connectionState === 'connected'
    }
  }
  
  // Singleton instance
  let webSocketInstance: WebSocketService | null = null
  
  export function getWebSocketService(): WebSocketService {
    if (!webSocketInstance) {
      webSocketInstance = new WebSocketService()
    }
    return webSocketInstance
  }