'use client'

import { useParkingStateReport } from '@/hooks/useApi'
import { useUIStore } from '@/store'
import Loading from '@/components/common/Loading'
import { ErrorMessage } from '@/components/common/ErrorBoundry'

export default function AdminDashboard() {
  const { data: reportData, isLoading, error } = useParkingStateReport()
  const { adminAuditLog } = useUIStore()

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading size="lg" message="Loading dashboard data..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage 
          title="Failed to load dashboard data"
          message={error.message}
        />
      </div>
    )
  }

  const totalSlots = reportData?.reduce((sum, zone) => sum + zone.totalSlots, 0) || 0
  const totalOccupied = reportData?.reduce((sum, zone) => sum + zone.occupied, 0) || 0
  const totalFree = reportData?.reduce((sum, zone) => sum + zone.free, 0) || 0
  const occupancyRate = totalSlots > 0 ? (totalOccupied / totalSlots * 100) : 0

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and quick actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Slots</p>
              <p className="text-2xl font-bold text-gray-900">{totalSlots}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-gray-900">{totalOccupied}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{totalFree}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {adminAuditLog.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {adminAuditLog.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{entry.action}</p>
                    <p className="text-gray-600">{entry.details}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone Status Overview</h3>
          {reportData && reportData.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {reportData.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{zone.name}</p>
                    <p className="text-sm text-gray-600">
                      {zone.occupied}/{zone.totalSlots} occupied
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      zone.open 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {zone.open ? 'Open' : 'Closed'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((zone.occupied / zone.totalSlots) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No zone data available</p>
          )}
        </div>
      </div>
    </div>
  )
}