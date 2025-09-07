// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/api/v1/ws',
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  } as const
  
  // Local Storage Keys
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    GATE_PREFERENCES: 'gate_preferences',
  } as const
  
  // Application Routes
  export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    GATE: '/gate',
    CHECKPOINT: '/checkpoint',
    ADMIN: '/admin',
    ADMIN_EMPLOYEES: '/admin/employees',
    ADMIN_REPORTS: '/admin/reports',
    ADMIN_CONTROL: '/admin/control',
  } as const
  
  // User Roles
  export const USER_ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
  } as const
  
  // Ticket Types
  export const TICKET_TYPES = {
    VISITOR: 'visitor',
    SUBSCRIBER: 'subscriber',
  } as const
  
  // Rate Modes
  export const RATE_MODES = {
    NORMAL: 'normal',
    SPECIAL: 'special',
  } as const
  
  // WebSocket Message Types
  export const WS_MESSAGE_TYPES = {
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    ZONE_UPDATE: 'zone-update',
    ADMIN_UPDATE: 'admin-update',
  } as const
  
  // Admin Action Types
  export const ADMIN_ACTIONS = {
    CATEGORY_RATES_CHANGED: 'category-rates-changed',
    ZONE_CLOSED: 'zone-closed',
    ZONE_OPENED: 'zone-opened',
    VACATION_ADDED: 'vacation-added',
    RUSH_UPDATED: 'rush-updated',
  } as const
  
  // Category IDs (from seed data)
  export const CATEGORY_IDS = {
    PREMIUM: 'cat_premium',
    REGULAR: 'cat_regular',
    ECONOMY: 'cat_economy',
    VIP: 'cat_vip',
  } as const
  
  // Gate IDs (from seed data)
  export const GATE_IDS = {
    MAIN: 'gate_1',
    EAST: 'gate_2',
    SOUTH: 'gate_3',
    WEST: 'gate_4',
    VIP: 'gate_5',
  } as const
  
  // Time formats
  export const TIME_FORMATS = {
    DISPLAY_DATE: 'MMM dd, yyyy',
    DISPLAY_TIME: 'HH:mm',
    DISPLAY_DATETIME: 'MMM dd, yyyy HH:mm',
    API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  } as const
  
  // Validation patterns
  export const VALIDATION = {
    SUBSCRIPTION_ID: /^sub_\d{3}$/,
    TICKET_ID: /^t_\d{3}$/,
    LICENSE_PLATE: /^[A-Z]{3}-\d{3}$/,
  } as const
  
  // UI Constants
  export const UI = {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 5000,
    MODAL_ANIMATION_DURATION: 200,
    POLLING_INTERVAL: 30000, // 30 seconds
  } as const
  
  // Error Messages
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SUBSCRIPTION_EXPIRED: 'Your subscription has expired.',
    SUBSCRIPTION_INACTIVE: 'Your subscription is not active.',
    ZONE_FULL: 'This zone is currently full.',
    ZONE_CLOSED: 'This zone is currently closed.',
    TICKET_NOT_FOUND: 'Ticket not found.',
    ALREADY_CHECKED_OUT: 'This ticket has already been checked out.',
  } as const
  
  // Success Messages
  export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    CHECKIN_SUCCESS: 'Check-in completed successfully!',
    CHECKOUT_SUCCESS: 'Check-out completed successfully!',
    USER_CREATED: 'User created successfully!',
    SETTINGS_SAVED: 'Settings saved successfully!',
    ZONE_STATUS_UPDATED: 'Zone status updated successfully!',
  } as const