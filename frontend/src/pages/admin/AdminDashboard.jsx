import { useEffect, useState } from 'react'
import { adminService } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Building2, CalendarCheck, AlertTriangle, Users, Clock, CheckCircle } from 'lucide-react'

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value ?? '—'}</p>
          {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats()
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-enter space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Facilities"   value={stats?.totalFacilities}
          sub={`${stats?.availableFacilities} available`} icon={Building2}      color="bg-primary-600" />
        <StatCard label="Pending Bookings"   value={stats?.pendingBookings}
          sub={`${stats?.totalBookings} total`}           icon={Clock}           color="bg-amber-600" />
        <StatCard label="Approved Bookings"  value={stats?.approvedBookings}
          sub="Active reservations"                       icon={CheckCircle}     color="bg-emerald-600" />
        <StatCard label="Open Issues"        value={stats?.openIssues}
          sub={`${stats?.totalIssues} total reported`}   icon={AlertTriangle}   color="bg-red-600" />
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Maintenance"  value={stats?.maintenanceFacilities}
          sub="Facilities under maintenance"  icon={Building2}  color="bg-orange-600" />
        <StatCard label="Total Bookings" value={stats?.totalBookings}
          sub="All time"                      icon={CalendarCheck} color="bg-blue-600" />
        <StatCard label="Total Users"  value={stats?.totalUsers}
          sub="Registered accounts"           icon={Users}      color="bg-violet-600" />
      </div>

      {/* Quick summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Facility Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Available',    value: stats?.availableFacilities,   color: 'bg-emerald-500' },
              { label: 'Maintenance',  value: stats?.maintenanceFacilities, color: 'bg-amber-500' },
              { label: 'Unavailable',  value: stats?.totalFacilities - stats?.availableFacilities - stats?.maintenanceFacilities, color: 'bg-gray-600' },
            ].map(({ label, value, color }) => {
              const pct = stats?.totalFacilities ? Math.round((value / stats.totalFacilities) * 100) : 0
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Booking Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Pending',   value: stats?.pendingBookings,  color: 'bg-amber-500' },
              { label: 'Approved',  value: stats?.approvedBookings, color: 'bg-emerald-500' },
              { label: 'Other',     value: stats?.totalBookings - stats?.pendingBookings - stats?.approvedBookings, color: 'bg-gray-600' },
            ].map(({ label, value, color }) => {
              const pct = stats?.totalBookings ? Math.round((value / stats.totalBookings) * 100) : 0
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
