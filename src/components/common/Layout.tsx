'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store'
import ConnectionStatus from './ConnectionStatus'
import UserMenu from './UserMenu'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()

  // Don't show navigation on home and login pages
  const isPublicPage = pathname === '/' || pathname === '/login'
  const isGatePage = pathname.startsWith('/gate/')

  if (isPublicPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isGatePage={isGatePage} />
      <main className="pb-6">
        {children}
      </main>
      <ConnectionStatus />
    </div>
  )
}

interface HeaderProps {
  isGatePage: boolean
}

function Header({ isGatePage }: HeaderProps) {
  const pathname = usePathname()
  const { isAuthenticated, user, isAdmin } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 11v-4m-4 4h8m4-8H4" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Parking System
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - only show for authenticated users */}
          {isAuthenticated && !isGatePage && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/checkpoint"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === '/checkpoint' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Checkpoint
              </Link>

              {isAdmin() && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname.startsWith('/admin') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Admin
                </Link>
              )}

              <Link
                href="/gate/gate_1"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname.startsWith('/gate') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Gates
              </Link>
            </nav>
          )}

          {/* Gate-specific current time display */}
          {isGatePage && (
            <div className="hidden sm:block text-sm text-gray-600">
              <CurrentTime />
            </div>
          )}

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {isAuthenticated && !isGatePage && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* User menu or login */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && isAuthenticated && !isGatePage && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/checkpoint"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === '/checkpoint' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Checkpoint
              </Link>

              {isAdmin() && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname.startsWith('/admin') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Admin
                </Link>
              )}

              <Link
                href="/gate/gate_1"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname.startsWith('/gate') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Gates
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <span>
      {currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })}
    </span>
  )
}