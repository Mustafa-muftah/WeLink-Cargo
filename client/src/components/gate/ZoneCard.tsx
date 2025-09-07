'use client'

import { useState } from 'react'
import { Zone } from '@/types/api'
import { useCheckin, useSubscription } from '@/hooks/useApi'
import { ButtonSpinner } from '@/components/common/Loading'

interface ZoneCardProps {
  zone: Zone
  gateId: string
  currentTab: 'visitor' | 'subscriber'
  onTicketCreated: (ticket: any, zone: Zone) => void
}

export default function ZoneCard({ zone, gateId, currentTab, onTicketCreated }: ZoneCardProps) {
  const [subscriptionId, setSubscriptionId] = useState('')
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  
  const checkinMutation = useCheckin()
  const subscriptionQuery = useSubscription(subscriptionId)

  // Check if special rate is active (this would be determined by server in real implementation)
  const isSpecialRate = false // Placeholder - server should provide this

  const isZoneAvailable = () => {
    if (!zone.open) return false
    
    if (currentTab === 'visitor') {
      return zone.availableForVisitors > 0
    } else {
      return zone.availableForSubscribers > 0
    }
  }

  const getAvailabilityText = () => {
    if (!zone.open) return 'Closed'
    
    if (currentTab === 'visitor') {
      return `${zone.availableForVisitors} available for visitors`
    } else {
      return `${zone.availableForSubscribers} available for subscribers`
    }
  }

  const getAvailabilityColor = () => {
    if (!zone.open) return 'text-gray-500'
    
    const available = currentTab === 'visitor' 
      ? zone.availableForVisitors 
      : zone.availableForSubscribers
    
    if (available === 0) return 'text-error-600'
    if (available <= 5) return 'text-warning-600'
    return 'text-success-600'
  }

  const handleVisitorCheckin = async () => {
    try {
      const response = await checkinMutation.mutateAsync({
        gateId,
        zoneId: zone.id,
        type: 'visitor'
      })
      
      onTicketCreated(response.ticket, zone)
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const handleSubscriberCheckin = async () => {
    if (!subscriptionId.trim()) {
      setSubscriptionError('Please enter subscription ID')
      return
    }

    // First verify subscription
    try {
      const subscription = await subscriptionQuery.refetch()
      
      if (!subscription.data) {
        setSubscriptionError('Subscription not found')
        return
      }

      if (!subscription.data.active) {
        setSubscriptionError('Subscription is not active')
        return
      }

      // Check if subscription category matches zone category
      if (subscription.data.category !== zone.categoryId) {
        setSubscriptionError(`This subscription is for ${subscription.data.category} zones only`)
        return
      }

      // Proceed with check-in
      const response = await checkinMutation.mutateAsync({
        gateId,
        zoneId: zone.id,
        type: 'subscriber',
        subscriptionId
      })
      
      onTicketCreated(response.ticket, zone)
      setSubscriptionId('')
      setSubscriptionError(null)
    } catch (error: any) {
      setSubscriptionError(error.message || 'Failed to verify subscription')
    }
  }

  const currentRate = isSpecialRate ? zone.rateSpecial : zone.rateNormal
  const rateLabel = isSpecialRate ? 'Special Rate' : 'Normal Rate'

  return (
    <div className={`card hover:shadow-md transition-shadow ${!zone.open ? 'opacity-60' : ''}`}>
      {/* Zone Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
          <p className="text-sm text-gray-600">Category: {zone.categoryId.replace('cat_', '').charAt(0).toUpperCase() + zone.categoryId.replace('cat_', '').slice(1)}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${zone.open ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'}`}>
          {zone.open ? 'Open' : 'Closed'}
        </div>
      </div>

      {/* Occupancy Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{zone.occupied}</div>
          <div className="text-xs text-gray-600">Occupied</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{zone.free}</div>
          <div className="text-xs text-gray-600">Free</div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <div className={`text-sm font-medium ${getAvailabilityColor()}`}>
          {getAvailabilityText()}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {zone.reserved} reserved • {zone.totalSlots} total slots
        </div>
      </div>

      {/* Rate Information */}
      <div className="mb-4 p-3 bg-primary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-primary-900">
              ${currentRate}/hour
            </div>
            <div className="text-xs text-primary-700">
              {rateLabel}
              {isSpecialRate && (
                <span className="ml-1 px-1 py-0.5 bg-warning-100 text-warning-800 rounded text-xs">
                  ACTIVE
                </span>
              )}
            </div>
          </div>
          {isSpecialRate && (
            <div className="text-xs text-primary-600">
              Normal: ${zone.rateNormal}/hr
            </div>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="space-y-3">
        {currentTab === 'visitor' ? (
          <button
            onClick={handleVisitorCheckin}
            disabled={!isZoneAvailable() || checkinMutation.isPending}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {checkinMutation.isPending ? (
              <>
                <ButtonSpinner className="mr-2" />
                Checking in...
              </>
            ) : (
              'Check In as Visitor'
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor={`subscription-${zone.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Subscription ID
              </label>
              <input
                id={`subscription-${zone.id}`}
                type="text"
                value={subscriptionId}
                onChange={(e) => {
                  setSubscriptionId(e.target.value)
                  setSubscriptionError(null)
                }}
                placeholder="Enter subscription ID"
                className="input-field text-sm"
                disabled={checkinMutation.isPending}
              />
            </div>
            
            {subscriptionError && (
              <div className="text-sm text-error-600">
                {subscriptionError}
              </div>
            )}

            <button
              onClick={handleSubscriberCheckin}
              disabled={!isZoneAvailable() || !subscriptionId.trim() || checkinMutation.isPending}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {checkinMutation.isPending ? (
                <>
                  <ButtonSpinner className="mr-2" />
                  Checking in...
                </>
              ) : (
                'Check In as Subscriber'
              )}
            </button>
          </div>
        )}
      </div>

      {!isZoneAvailable() && zone.open && (
        <div className="mt-3 text-center text-sm text-warning-600 bg-warning-50 rounded p-2">
          No slots available for {currentTab}s
        </div>
      )}
    </div>
  )
}