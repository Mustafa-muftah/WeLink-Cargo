'use client'

import { useEffect, useRef } from 'react'
import { Gate, Zone, Ticket } from '@/types/api'

interface TicketModalProps {
  isOpen: boolean
  ticket?: Ticket
  zone?: Zone
  gate?: Gate
  onClose: () => void
}

export default function TicketModal({ isOpen, ticket, zone, gate, onClose }: TicketModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Simulate gate opening animation
  const handleGateOpen = () => {
    // In a real implementation, this would trigger actual gate hardware
    const gateAnimation = modalRef.current?.querySelector('.gate-animation')
    if (gateAnimation) {
      gateAnimation.classList.add('animate-gate-open')
    }
    
    // Auto-close after animation
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  if (!isOpen || !ticket || !zone || !gate) {
    return null
  }

  const checkinTime = new Date(ticket.checkinAt)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Parking Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ticket Content - Printable */}
        <div className="p-6 print-ticket">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Check-in Successful!</h3>
            <p className="text-sm text-gray-600 mt-1">Your parking ticket has been generated</p>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="text-center border-b border-gray-100 pb-4">
              <h4 className="text-lg font-bold text-gray-900">PARKING TICKET</h4>
              <div className="text-2xl font-mono font-bold text-primary-600 mt-1">
                {ticket.id}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in Time:</span>
                <span className="font-medium">
                  {checkinTime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Current Rate:</span>
                <span className="font-medium">${zone.rateNormal}/hour</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{ticket.type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Gate:</span>
                <span className="font-medium">{gate.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Zone:</span>
                <span className="font-medium">{zone.name}</span>
              </div>

              {ticket.subscriptionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscription:</span>
                  <span className="font-medium">{ticket.subscriptionId}</span>
                </div>
              )}
            </div>

            {/* QR Code Placeholder */}
            <div className="text-center py-4 border-t border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">Scan for checkout</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important:</p>
                <p className="text-yellow-700 mt-1">
                  Keep this ticket with you. Present it at checkout to calculate parking fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gate Animation */}
        <div className="gate-animation px-6 pb-4">
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-success-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Gate Ready</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">The gate will open automatically</p>
            
            {/* Animated Gate Bars */}
            <div className="flex items-center justify-center space-x-1">
              <div className="gate-bar bg-gray-400 w-12 h-1 rounded-full transition-transform duration-1000"></div>
              <div className="gate-bar bg-gray-400 w-12 h-1 rounded-full transition-transform duration-1000"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex space-x-3 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 btn-secondary flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ticket
          </button>
          
          <button
            onClick={handleGateOpen}
            className="flex-1 btn-primary flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Open Gate
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-gate-open .gate-bar:first-child {
          transform: rotate(-45deg) translateY(-8px);
        }
        .animate-gate-open .gate-bar:last-child {
          transform: rotate(45deg) translateY(-8px);
        }
      `}</style>
    </div>
  )
}