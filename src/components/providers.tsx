'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import Layout from '@/components/common/Layout'
import ToastContainer from '../components/common/ToastContainer'
import { useWebSocket } from '@/hooks/useWebSocket'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          return failureCount < 3
        }
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent>{children}</AppContent>
    </QueryClientProvider>
  )
}

// Separate component to use hooks after QueryClient is available
function AppContent({ children }: { children: React.ReactNode }) {
  // Initialize WebSocket connection
  useWebSocket()

  return (
    <Layout>
      {children}
      <ToastContainer />
    </Layout>
  )
}