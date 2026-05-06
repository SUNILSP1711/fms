import { useEffect, useState } from 'react'
import { bookingService, issueService, facilityService } from '../../services'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import Badge from '../../components/Badge'
import { CalendarCheck, AlertTriangle, Building2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

export default function StaffDashboard() {
  const { user }      = useAuth()
  const navigate      = useNavigate()
  const [bookings, setBookings] = useState([])
  const [issues,   setIssues]   = useState([])
  const [facilities, setFacilities] = useState(0)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      bookingService.getMy({ page: 0, size: 5 }),
      issueService.getMy({ page: 0, size: 5 }),
      facilityService.getAll({ page: 0, size: 1, status: 'AVAILABLE' }),
    ]).then(([b, i, f]) => {
      setBookings(b.data.content)
      setIssues(i.data.content)
      setFacilities(f.data.totalElements ?? f.data.content?.length ?? 0)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length
  const openIssues      = issues.filter(i => i.status === 'OPEN').length

  return (
    <div className="page-enter space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.name} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Here's a summary of your activity.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Available Facilities', value: facilities, icon: Building2,
            color: 'bg-primary-600', action: () => navigate('../facilities', { relative: 'path' }) },
          { label: 'Pending Bookings',     value: pendingBookings, icon: Clock,
            color: 'bg-amber-600',   action: () => navigate('../bookings',   { relative: 'path' }) },
          { label: 'Open Issues',          value: openIssues, icon: AlertTriangle,
            color: 'bg-red-600',     action: () => navigate('../issues',     { relative: 'path' }) },
        ].map(({ label, value, icon: Icon, color, action }) => (
          <button key={label} onClick={action}
            className="stat-card text-left hover:border-gray-700 w-full transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}
                              group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <CalendarCheck size={18} className="text-primary-400" /> Recent Bookings
            </h2>
            <button onClick={() => navigate('../bookings', { relative: 'path' })}
              className="text-primary-400 text-xs hover:underline">View all →</button>
          </div>
          {bookings.length === 0
            ? <p className="text-gray-500 text-sm text-center py-6">No bookings yet.</p>
            : <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3
                                             bg-gray-800/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{b.facility?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {b.startDate ? format(new Date(b.startDate), 'dd MMM yyyy') : '—'}
                      </p>
                    </div>
                    <Badge value={b.status} />
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Recent Issues */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" /> Recent Issues
            </h2>
            <button onClick={() => navigate('../issues', { relative: 'path' })}
              className="text-primary-400 text-xs hover:underline">View all →</button>
          </div>
          {issues.length === 0
            ? <p className="text-gray-500 text-sm text-center py-6">No issues reported.</p>
            : <div className="space-y-3">
                {issues.map(i => (
                  <div key={i.id} className="flex items-center justify-between p-3
                                             bg-gray-800/50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{i.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{i.facility?.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge value={i.status} />
                      <Badge value={i.priority} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  )
}
