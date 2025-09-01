// Base API response types
export interface ApiResponse<T> {
    status: 'success' | 'error'
    message?: string
    data?: T
    errors?: Record<string, string[]>
  }
  
  // Authentication types
  export interface User {
    id: string
    username: string
    name: string
    role: 'admin' | 'employee'
  }
  
  export interface AuthResponse {
    user: User
    token: string
  }
  
  export interface LoginRequest {
    username: string
    password: string
  }
  
  // Category types
  export interface Category {
    id: string
    name: string
    description?: string
    rateNormal: number
    rateSpecial: number
  }
  
  // Zone types
  export interface Zone {
    id: string
    name: string
    categoryId: string
    gateIds: string[]
    totalSlots: number
    occupied: number
    free: number
    reserved: number
    availableForVisitors: number
    availableForSubscribers: number
    rateNormal: number
    rateSpecial: number
    open: boolean
  }
  
  // Gate types
  export interface Gate {
    id: string
    name: string
    zoneIds: string[]
    location: string
  }
  
  // Subscription types
  export interface Car {
    plate: string
    brand: string
    model: string
    color: string
  }
  
  export interface CurrentCheckin {
    ticketId: string
    zoneId: string
    checkinAt: string
  }
  
  export interface Subscription {
    id: string
    userName: string
    active: boolean
    category: string
    cars: Car[]
    startsAt: string
    expiresAt: string
    currentCheckins: CurrentCheckin[]
  }
  
  // Ticket types
  export interface Ticket {
    id: string
    type: 'visitor' | 'subscriber'
    zoneId: string
    gateId: string
    checkinAt: string
    checkoutAt?: string
    subscriptionId?: string
  }
  
  export interface CheckinRequest {
    gateId: string
    zoneId: string
    type: 'visitor' | 'subscriber'
    subscriptionId?: string
  }
  
  export interface CheckinResponse {
    ticket: Ticket
    zoneState: Zone
  }
  
  export interface BreakdownSegment {
    from: string
    to: string
    hours: number
    rateMode: 'normal' | 'special'
    rate: number
    amount: number
  }
  
  export interface CheckoutRequest {
    ticketId: string
    forceConvertToVisitor?: boolean
  }
  
  export interface CheckoutResponse {
    ticketId: string
    checkinAt: string
    checkoutAt: string
    durationHours: number
    breakdown: BreakdownSegment[]
    amount: number
    zoneState: Zone
  }
  
  // Rush hours and vacations
  export interface RushHour {
    id: string
    weekDay: number
    from: string
    to: string
  }
  
  export interface Vacation {
    id: string
    name: string
    from: string
    to: string
  }
  
  // Admin reports
  export interface ParkingStateReport {
    id: string
    name: string
    categoryId: string
    totalSlots: number
    occupied: number
    free: number
    reserved: number
    availableForVisitors: number
    availableForSubscribers: number
    subscriberCount: number
    open: boolean
  }
  
  // WebSocket types
  export interface WebSocketSubscribeMessage {
    type: 'subscribe' | 'unsubscribe'
    payload: {
      gateId: string
    }
  }
  
  export interface WebSocketZoneUpdate {
    type: 'zone-update'
    payload: Zone
  }
  
  export interface WebSocketAdminUpdate {
    type: 'admin-update'
    payload: {
      adminId: string
      action: string
      targetType: string
      targetId: string
      details?: any
      timestamp: string
    }
  }
  
  export type WebSocketMessage = WebSocketZoneUpdate | WebSocketAdminUpdate