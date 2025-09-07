'use client'

import { useState, useEffect } from 'react'
import { 
  useAdminZones, 
  useUpdateZoneStatus, 
  useAdminCategories, 
  useUpdateCategory,
  useCreateRushHour,
  useCreateVacation
} from '@/hooks/useApi'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useUIStore } from '@/store'
import { ButtonSpinner } from '@/components/common/Loading'
import { ErrorMessage } from '@/components/common/ErrorBoundry'
import Loading from '@/components/common/Loading'

const weekDays = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
]

function RushHourManagement() {
  const [formData, setFormData] = useState({
    weekDay: 1,
    from: '07:00',
    to: '09:00'
  })

  const createRushHourMutation = useCreateRushHour()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRushHourMutation.mutateAsync(formData)
      setFormData({ weekDay: 1, from: '07:00', to: '09:00' })
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-900">Rush Hours</h3>
      </div>
      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
            <select
              value={formData.weekDay}
              onChange={(e) => setFormData(prev => ({ ...prev, weekDay: parseInt(e.target.value) }))}
              className="w-full text-sm px-2 py-1 border rounded"
            >
              {weekDays.map(day => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
            <input
              type="time"
              value={formData.from}
              onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
              className="w-full text-sm px-2 py-1 border rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
            <input
              type="time"
              value={formData.to}
              onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
              className="w-full text-sm px-2 py-1 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={createRushHourMutation.isPending}
          className="text-sm btn-primary disabled:opacity-50"
        >
          {createRushHourMutation.isPending ? 'Adding...' : 'Add Rush Hour'}
        </button>
      </form>
      <p className="text-sm text-gray-500">Note: Existing rush hours cannot be listed or deleted (backend limitation).</p>
    </div>
  )
}

function VacationManagement() {
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: ''
  })

  const createVacationMutation = useCreateVacation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createVacationMutation.mutateAsync(formData)
      setFormData({ name: '', from: '', to: '' })
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-900">Vacation Periods</h3>
      </div>
      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full text-sm px-2 py-1 border rounded"
            placeholder="Holiday name"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={formData.from}
              onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
              className="w-full text-sm px-2 py-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={formData.to}
              onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
              className="w-full text-sm px-2 py-1 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={createVacationMutation.isPending}
          className="text-sm btn-primary disabled:opacity-50"
        >
          {createVacationMutation.isPending ? 'Adding...' : 'Add Vacation'}
        </button>
      </form>
      <p className="text-sm text-gray-500">Note: Existing vacations cannot be listed or deleted (backend limitation).</p>
    </div>
  )
}

function CategoryRates() {
  const { data: categories, isLoading } = useAdminCategories()
  const updateCategoryMutation = useUpdateCategory()
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ rateNormal: 0, rateSpecial: 0 })

  const handleEdit = (category: any) => {
    setEditingCategory(category.id)
    setEditValues({
      rateNormal: category.rateNormal,
      rateSpecial: category.rateSpecial
    })
  }

  const handleSave = async (categoryId: string) => {
    try {
      await updateCategoryMutation.mutateAsync({
        id: categoryId,
        rateNormal: editValues.rateNormal,
        rateSpecial: editValues.rateSpecial
      })
      setEditingCategory(null)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setEditValues({ rateNormal: 0, rateSpecial: 0 })
  }

  if (isLoading) {
    return <Loading size="md" message="Loading categories..." />
  }

  return (
    <div className="space-y-4">
      {categories?.map((category) => (
        <div key={category.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>

            {editingCategory === category.id ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <label className="block text-gray-600">Normal Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.rateNormal}
                    onChange={(e) => setEditValues(prev => ({ ...prev, rateNormal: parseFloat(e.target.value) || 0 }))}
                    className="w-20 px-2 py-1 border rounded text-center"
                  />
                </div>
                <div className="text-sm">
                  <label className="block text-gray-600">Special Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.rateSpecial}
                    onChange={(e) => setEditValues(prev => ({ ...prev, rateSpecial: parseFloat(e.target.value) || 0 }))}
                    className="w-20 px-2 py-1 border rounded text-center"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(category.id)}
                    disabled={updateCategoryMutation.isPending}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {updateCategoryMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Normal: ${category.rateNormal}/hr</div>
                  <div className="text-sm text-gray-600">Special: ${category.rateSpecial}/hr</div>
                </div>
                <button
                  onClick={() => handleEdit(category)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                >
                  Edit Rates
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminControlPage() {
  const [processingZones, setProcessingZones] = useState<Set<string>>(new Set())
  const { adminAuditLog } = useUIStore()

  const { data: zones, isLoading, error } = useAdminZones()
  const updateZoneStatusMutation = useUpdateZoneStatus()

  // Use the WebSocket hook to connect and receive admin updates
  useWebSocket({
    onAdminUpdate: (update) => {
      // The useWebSocket hook already adds to the UIStore audit log
      // We can add additional handling here if needed
      console.log('Admin update received in control panel:', update)
    }
  })

  const handleToggleZone = async (zoneId: string, currentStatus: boolean) => {
    setProcessingZones(prev => new Set(Array.from(prev).concat(zoneId)))
    try {
      await updateZoneStatusMutation.mutateAsync({
        id: zoneId,
        open: !currentStatus
      })
    } catch (error) {
      // Handled by mutation
    } finally {
      setProcessingZones(prev => {
        const newSet = new Set(prev)
        newSet.delete(zoneId)
        return newSet
      })
    }
  }

  const handleEmergency = async (open: boolean) => {
    if (!zones) return
    if (!confirm(`Confirm ${open ? 'open' : 'close'} all zones?`)) return
    setProcessingZones(new Set(zones.map(z => z.id)))
    for (const zone of zones) {
      try {
        await updateZoneStatusMutation.mutateAsync({ id: zone.id, open })
      } catch (err) {
        console.error(`Failed for zone ${zone.id}`, err)
      }
    }
    setProcessingZones(new Set())
  }

  if (isLoading) return <div className="p-6"><Loading size="lg" message="Loading control panel..." /></div>
  if (error) return <div className="p-6"><ErrorMessage title="Load failed" message={error.message} /></div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Control Panel</h1>
      <div className="space-y-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Zone Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones?.map((zone) => (
              <div key={zone.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{zone.name}</h3>
                    <p className="text-sm text-gray-500">Category: {zone.categoryId}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {zone.occupied}/{zone.totalSlots} occupied
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleZone(zone.id, zone.open)}
                    disabled={processingZones.has(zone.id)}
                    className={`px-3 py-1 text-xs rounded ${zone.open ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'} disabled:opacity-50`}
                  >
                    {processingZones.has(zone.id) ? <ButtonSpinner /> : zone.open ? 'Close' : 'Open'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Schedule Management</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RushHourManagement />
            <VacationManagement />
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Rate Management</h2>
          <CategoryRates />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Live Audit Log</h2>
          {adminAuditLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No admin updates yet.</p>
              <p className="text-sm mt-2">Actions performed by admins will appear here in real-time.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {adminAuditLog.slice(0, 20).map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3 text-sm border-b pb-2">
                  <div className="flex-1">
                    <span className="text-gray-600">{new Date(entry.timestamp).toLocaleString()}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="font-medium text-gray-900">
                      Admin {entry.adminId}
                    </span>
                    <span className="mx-2 text-gray-400">:</span>
                    <span className="text-gray-700">
                      {entry.action.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                    </span>
                    {entry.details && (
                      <span className="text-gray-500 ml-2">({entry.details})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Emergency Actions</h2>
          <div className="flex space-x-4">
            <button 
              onClick={() => handleEmergency(false)} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close All Zones
            </button>
            <button 
              onClick={() => handleEmergency(true)} 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Open All Zones
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}