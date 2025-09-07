'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGates } from '@/hooks/useApi'
import { useUIStore } from '@/store'
import { Gate } from '@/types/api'

interface GateHeaderProps {
  gate: Gate
}

export default function GateHeader({ gate }: GateHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { selectedGateTab, setSelectedGateTab, wsConnectionState } = useUIStore()
  const { data: gates } = useGates()
  const router = useRouter()

  const getConnectionStatusText = () => {
    switch (wsConnectionState) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting...'
      case 'disconnected': return 'Offline'
      case 'error': return 'Connection Error'
      default: return 'Unknown'
    }
  }

  const getConnectionStatusColor = () => {
    switch (wsConnectionState) {
      case 'connected': return 'text-success-600 bg-success-100'
      case 'connecting': return 'text-warning-600 bg-warning-100'
      case 'disconnected': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-error-600 bg-error-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConnectionIcon = () => {
    switch (wsConnectionState) {
      case 'connected':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      case 'connecting':
        return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      default:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
        </svg>
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleGateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/gate/${e.target.value}`)
  }

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{gate.name}</h1>
              <p className="text-sm text-gray-600">{gate.location} • Gate ID: {gate.id}</p>
            </div>
            <select
              value={gate.id}
              onChange={handleGateChange}
              className="text-sm border rounded px-2 py-1"
            >
              {gates?.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getConnectionStatusColor()}`}>
                {getConnectionIcon()}
                <span className="capitalize">{getConnectionStatusText()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-semibold text-gray-900">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </div>
              <div className="text-xs text-gray-500">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setSelectedGateTab('visitor')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              selectedGateTab === 'visitor' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Visitor</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedGateTab('subscriber')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              selectedGateTab === 'subscriber' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Subscriber</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}