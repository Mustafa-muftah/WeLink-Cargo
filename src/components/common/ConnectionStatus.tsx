'use client'
import React from 'react'
import { useUIStore } from '../../store'

export default function ConnectionStatus() {
  const wsConnectionState = useUIStore(state => state.wsConnectionState)

  // Don't show anything when connected
  if (wsConnectionState === 'connected') {
    return null
  }

  const getStatusConfig = () => {
    switch (wsConnectionState) {
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          text: 'Connecting...',
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )
        }
      case 'disconnected':
        return {
          color: 'bg-gray-500',
          text: 'Disconnected',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
            </svg>
          )
        }
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Connection Error',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`${config.color} text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm`}>
        {config.icon}
        <span>{config.text}</span>
      </div>
    </div>
  )
}