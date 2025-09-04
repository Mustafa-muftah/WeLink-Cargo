'use client'

import { useState } from 'react'
import { 
  useAdminZones, 
  useUpdateZoneStatus, 
  useAdminCategories, 
  useUpdateCategory,
  useAdminRushHours,
  useCreateRushHour,
  useDeleteRushHour,
  useAdminVacations,
  useCreateVacation,
  useDeleteVacation
} from '@/hooks/useApi'
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
  { value: 7, label: 'Sunday' },
]

function RushHourManagement() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    weekDay: 1,
    from: '07:00',
    to: '09:00'
  })

  const { data: rushHours, isLoading } = useAdminRushHours()
  const createRushHourMutation = useCreateRushHour()
  const deleteRushHourMutation = useDeleteRushHour()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRushHourMutation.mutateAsync(formData)
      setFormData({ weekDay: 1, from: '07:00', to: '09:00' })
      setShowForm(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this rush hour?')) {
      await deleteRushHourMutation.mutateAsync(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-900">Rush Hours</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Rush Hour'}
        </button>
      </div>

      {showForm && (
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
      )}

      {isLoading ? (
        <Loading size="sm" />
      ) : (
        <div className="space-y-2">
          {rushHours?.map((rushHour) => (
            <div key={rushHour.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="text-sm">
                <span className="font-medium">
                  {weekDays.find(d => d.value === rushHour.weekDay)?.label}
                </span>
                <span className="text-gray-600 ml-2">
                  {rushHour.from} - {rushHour.to}
                </span>
              </div>
              <button
                onClick={() => handleDelete(rushHour.id)}
                disabled={deleteRushHourMutation.isPending}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
          {rushHours?.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No rush hours configured</p>
          )}
        </div>
      )}
    </div>
  )
}

function VacationManagement() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: ''
  })

  const { data: vacations, isLoading } = useAdminVacations()
  const createVacationMutation = useCreateVacation()
  const deleteVacationMutation = useDeleteVacation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createVacationMutation.mutateAsync(formData)
      setFormData({ name: '', from: '', to: '' })
      setShowForm(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vacation period?')) {
      await deleteVacationMutation.mutateAsync(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-900">Vacation Periods</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Vacation'}
        </button>
      </div>

      {showForm && (
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
      )}

      {isLoading ? (
        <Loading size="sm" />
      ) : (
        <div className="space-y-2">
          {vacations?.map((vacation) => (
            <div key={vacation.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="text-sm">
                <div className="font-medium">{vacation.name}</div>
                <div className="text-gray-600">
                  {new Date(vacation.from).toLocaleDateString()} - {new Date(vacation.to).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(vacation.id)}
                disabled={deleteVacationMutation.isPending}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
          {vacations?.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No vacation periods configured</p>
          )}
        </div>
      )}
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
  
  const { data: zones, isLoading, error } = useAdminZones()
  const updateZoneStatusMutation = useUpdateZoneStatus()

  const handleToggleZone = async (zoneId: string, currentStatus: boolean) => {
    setProcessingZones(prev => new Set(prev).add(zoneId))
    
    try {
      await updateZoneStatusMutation.mutateAsync({
        id: zoneId,
        open: !currentStatus
      })
    } catch (error) {
      // Error handled by mutation
    } finally {
      setProcessingZones(prev => {
        const newSet = new Set(prev)
        newSet.delete(zoneId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading size="lg" message="Loading control panel..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage 
          title="Failed to load control panel"
          message={error.message}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Control Panel</h1>
        <p className="text-gray-600 mt-1">Manage zones, rates, and system settings</p>
      </div>

      <div className="space-y-8">
        {/* Zone Controls */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Management</h2>
          <p className="text-sm text-gray-600 mb-6">
            Open or close parking zones. Closed zones will not accept new check-ins.
          </p>

          {zones && zones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.map((zone) => (
                <div key={zone.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{zone.name}</h3>
                      <p className="text-sm text-gray-500">
                        {zone.categoryId.replace('cat_', '').charAt(0).toUpperCase() + zone.categoryId.replace('cat_', '').slice(1)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {zone.occupied}/{zone.totalSlots} occupied
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        zone.open 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {zone.open ? 'Open' : 'Closed'}
                      </span>
                      
                      <button
                        onClick={() => handleToggleZone(zone.id, zone.open)}
                        disabled={processingZones.has(zone.id)}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          zone.open
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {processingZones.has(zone.id) ? (
                          <span className="flex items-center">
                            <ButtonSpinner className="w-3 h-3 mr-1" />
                            Processing...
                          </span>
                        ) : (
                          zone.open ? 'Close Zone' : 'Open Zone'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No zones found</p>
          )}
        </div>

        {/* Schedule Management */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Management</h2>
          <p className="text-sm text-gray-600 mb-6">
            Configure rush hours and vacation periods that affect special pricing.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RushHourManagement />
            <VacationManagement />
          </div>
        </div>

        {/* Rate Management */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate Management</h2>
          <p className="text-sm text-gray-600 mb-6">
            Update parking rates for different categories. Changes take effect immediately.
          </p>

          <CategoryRates />
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          
          {zones && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{zones.length}</div>
                <div className="text-sm text-blue-800">Total Zones</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {zones.filter(z => z.open).length}
                </div>
                <div className="text-sm text-green-800">Open Zones</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {zones.filter(z => !z.open).length}
                </div>
                <div className="text-sm text-red-800">Closed Zones</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {zones.reduce((sum, z) => sum + z.occupied, 0)}
                </div>
                <div className="text-sm text-yellow-800">Currently Occupied</div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Actions</h2>
          <p className="text-sm text-gray-600 mb-6">
            Use these actions only in emergency situations.
          </p>
          
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Close All Zones
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Open All Zones
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Warning:</p>
                <p>Emergency actions will affect all zones simultaneously and may impact current operations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}