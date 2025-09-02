'use client'
import React from 'react'
import { useUIStore } from '@/store'
import { useEffect } from 'react'

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
  }
  onRemove: () => void
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    // Auto-remove toast after animation
    const timer = setTimeout(() => {
      onRemove()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onRemove])

  const typeConfig = {
    success: {
      bg: 'bg-success-50 border-success-200',
      text: 'text-success-800',
      icon: (
        <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-error-50 border-error-200',
      text: 'text-error-800',
      icon: (
        <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-warning-50 border-warning-200',
      text: 'text-warning-800',
      icon: (
        <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-primary-50 border-primary-200',
      text: 'text-primary-800',
      icon: (
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }[toast.type]

  return (
    <div 
      className={`${typeConfig.bg} border rounded-lg p-4 shadow-lg animate-slide-in-right max-w-sm`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {typeConfig.icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${typeConfig.text}`}>
            {toast.title}
          </p>
          {toast.message && (
            <p className={`mt-1 text-sm ${typeConfig.text} opacity-90`}>
              {toast.message}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onRemove}
            className={`inline-flex rounded-md ${typeConfig.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}