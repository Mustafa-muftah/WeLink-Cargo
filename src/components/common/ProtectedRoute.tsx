'use client'
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../store'
import Loading from './Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: 'admin' | 'employee'
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requireRole,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, hasRole } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Check if user is not authenticated
    if (!isAuthenticated || !user) {
      router.push(redirectTo)
      return
    }

    // Check role requirement
    if (requireRole && !hasRole(requireRole)) {
      // Redirect based on user's actual role
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/checkpoint')
      }
      return
    }
  }, [isAuthenticated, user, requireRole, router, redirectTo, hasRole])

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" message="Checking authentication..." />
      </div>
    )
  }

  // Check role requirement
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: <span className="font-medium capitalize">{requireRole}</span>
          </p>
          <p className="text-sm text-gray-500">
            Your role: <span className="font-medium capitalize">{user.role}</span>
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}