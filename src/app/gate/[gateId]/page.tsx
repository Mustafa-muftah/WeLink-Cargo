'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useZonesByGate, useGates } from '@/hooks/useApi'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useUIStore } from '@/store'
import { Zone, WebSocketZoneUpdate } from '@/types/api'
import GateHeader from '../../../components/gate/GateHeader'
import ZoneCard from '../../../components/gate/ZoneCard'
import TicketModal from '../../../components/gate/TicketModal'
import Loading from '../../../components/common/Loading'
import { ErrorMessage } from '../../../components/common/ErrorBoundry'

export default function GatePage() {
  const params = useParams()
  const gateId = params.gateId as string
  
  const [zones, setZones] = useState<Zone[]>([])
  const [ticketModal, setTicketModal] = useState<{
    isOpen: boolean
    ticket?: any
    zoneInfo?: Zone
  }>({ isOpen: false })

  const { selectedGateTab } = useUIStore()
  
  // Fetch initial data
  const { data: gatesData } = useGates()
  const { data: zonesData, isLoading, error, refetch } = useZonesByGate(gateId)
  
  const gate = gatesData?.find(g => g.id === gateId)

  // Update local zones state when API data changes
  useEffect(() => {
    if (zonesData) {
      setZones(zonesData)
    }
  }, [zonesData])

  // WebSocket integration
  const { subscribeToGate, unsubscribeFromGate, isConnected } = useWebSocket({
    onZoneUpdate: (update: WebSocketZoneUpdate) => {
      // Update the specific zone with real-time data
      setZones(prevZones => 
        prevZones.map(zone => 
          zone.id === update.payload.id ? update.payload : zone
        )
      )
    }
  })

  // Subscribe to gate WebSocket updates
  useEffect(() => {
    if (gateId && isConnected) {
      subscribeToGate(gateId)
      return () => unsubscribeFromGate(gateId)
    }
  }, [gateId, isConnected, subscribeToGate, unsubscribeFromGate])

  const handleTicketCreated = (ticket: any, zone: Zone) => {
    setTicketModal({
      isOpen: true,
      ticket,
      zoneInfo: zone
    })
  }

  const closeTicketModal = () => {
    setTicketModal({ isOpen: false })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" message="Loading gate information..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage 
          title="Failed to load gate data"
          message={error.message}
          retry={refetch}
        />
      </div>
    )
  }

  if (!gate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage 
          title="Gate not found"
          message="The requested gate does not exist."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GateHeader gate={gate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Zone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              gateId={gateId}
              currentTab={selectedGateTab}
              onTicketCreated={handleTicketCreated}
            />
          ))}
        </div>

        {zones.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No zones available
            </h3>
            <p className="text-gray-500">
              This gate doesn't have any zones configured.
            </p>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <TicketModal
        isOpen={ticketModal.isOpen}
        ticket={ticketModal.ticket}
        zone={ticketModal.zoneInfo}
        gate={gate}
        onClose={closeTicketModal}
      />
    </div>
  )
}