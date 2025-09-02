import { CheckoutResponse } from '@/types/api'

interface CheckoutPanelProps {
  checkoutResult: CheckoutResponse
  onNewTicket: () => void
}

export default function CheckoutPanel({ checkoutResult, onNewTicket }: CheckoutPanelProps) {
  const checkinTime = new Date(checkoutResult.checkinAt)
  const checkoutTime = new Date(checkoutResult.checkoutAt)

  const handlePrint = () => {
    window.print()
  }

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`
    }
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`
    }
    return `${wholeHours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Success Status */}
      <div className="card">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Checkout Complete</h2>
          <p className="text-gray-600 mt-1">Payment processed successfully</p>
        </div>

        {/* Ticket Summary */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6 print-ticket">
          <div className="text-center border-b border-gray-100 pb-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900">PARKING RECEIPT</h3>
            <div className="text-xl font-mono font-bold text-primary-600 mt-1">
              {checkoutResult.ticketId}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">
                {checkinTime.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">
                {checkoutTime.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{formatDuration(checkoutResult.durationHours)}</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Rate Breakdown</h3>
          
          {checkoutResult.breakdown.map((segment, index) => {
            const fromTime = new Date(segment.from)
            const toTime = new Date(segment.to)
            
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">
                    {fromTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })} - {toTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    segment.rateMode === 'special' 
                      ? 'bg-warning-100 text-warning-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {segment.rateMode === 'special' ? 'Special Rate' : 'Normal Rate'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {formatDuration(segment.hours)} × ${segment.rate}/hour
                  </div>
                  <div className="font-semibold text-gray-900">
                    ${segment.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-900">Total Amount:</span>
              <span className="text-primary-600">${checkoutResult.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 no-print">
        <button
          onClick={handlePrint}
          className="flex-1 btn-secondary flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Receipt
        </button>
        
        <button
          onClick={onNewTicket}
          className="flex-1 btn-primary flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Checkout
        </button>
      </div>
    </div>
  )
}