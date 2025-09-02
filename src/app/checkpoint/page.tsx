'use client'

import { useState } from 'react'
import { useCheckout } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import CheckoutPanel from '@/components/checkpoint/CheckoutPanel'
import Loading from '@/components/common/Loading'
import { CheckoutResponse } from '@/types/api'

export default function CheckpointPage() {
  return (
    <ProtectedRoute requireRole="employee">
      <CheckpointContent />
    </ProtectedRoute>
  )
}

function CheckpointContent() {
  const [ticketId, setTicketId] = useState('')
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null)
  
  const { user } = useAuth()
  const checkoutMutation = useCheckout()

  const handleTicketLookup = async (id: string) => {
    try {
      const result = await checkoutMutation.mutateAsync({
        ticketId: id,
      })
      
      setCheckoutResult(result)
      setTicketId(id)
    } catch (error: any) {
      setCheckoutResult(null)
    }
  }

  const handleNewTicket = () => {
    setTicketId('')
    setCheckoutResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Checkout Checkpoint
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Scan or enter ticket ID to process checkout
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Employee</div>
              <div className="font-medium text-gray-900">{user?.name}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ticket Lookup
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket ID
                  </label>
                  <div className="flex space-x-3">
                    <input
                      id="ticketId"
                      type="text"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      placeholder="Scan QR code or enter ticket ID (e.g., t_001)"
                      className="flex-1 input-field"
                      disabled={checkoutMutation.isPending}
                    />
                    <button
                      onClick={() => handleTicketLookup(ticketId)}
                      disabled={!ticketId.trim() || checkoutMutation.isPending}
                      className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checkoutMutation.isPending ? (
                        <Loading size="sm" />
                      ) : (
                        'Lookup'
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setTicketId('t_025')}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={checkoutMutation.isPending}
                    >
                      Demo Visitor (t_025)
                    </button>
                    <button
                      onClick={() => setTicketId('t_010')}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={checkoutMutation.isPending}
                    >
                      Demo Subscriber (t_010)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {checkoutResult ? (
              <CheckoutPanel 
                checkoutResult={checkoutResult}
                onNewTicket={handleNewTicket}
              />
            ) : (
              <div className="card">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready for Checkout
                  </h3>
                  <p className="text-gray-500">
                    Enter or scan a ticket ID to calculate parking fees and process checkout.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}