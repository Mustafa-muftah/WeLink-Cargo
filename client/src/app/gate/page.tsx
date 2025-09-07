'use client'

import { useRouter } from 'next/navigation'
import { useGates } from '@/hooks/useApi'
import Loading from '@/components/common/Loading'
import { ErrorMessage } from '@/components/common/ErrorBoundry'

export default function GateListPage() {
  const { data: gates, isLoading, error } = useGates()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" message="Loading gates..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage title="Failed to load gates" message={error.message} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Select a Gate</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gates?.map((gate) => (
            <button
              key={gate.id}
              onClick={() => router.push(`/gate/${gate.id}`)}
              className="card hover:shadow-md transition-shadow p-6 text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">{gate.name}</h3>
              <p className="text-sm text-gray-600">{gate.location}</p>
              <p className="text-xs text-gray-500 mt-1">Gate ID: {gate.id}</p>
            </button>
          ))}
        </div>
        {gates?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No gates available</h3>
            <p className="text-gray-500">No gates are configured in the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}