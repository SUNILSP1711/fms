import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Building2, CalendarCheck, AlertTriangle,
  LogOut, Menu, X, Users
} from 'lucide-react'
import { useState } from 'react'
import AdminDashboard  from './AdminDashboard'
import FacilitiesPage  from './FacilitiesPage'
import BookingsPage    from './BookingsPage'
import IssuesPage      from './IssuesPage'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { to: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: 'facilities', label: 'Facilities',  icon: Building2 },
  { to: 'bookings',   label: 'Bookings',    icon: CalendarCheck },
  { to: 'issues',     label: 'Issues',      icon: AlertTriangle },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [open, setOpen]  = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600/20 border border-primary-500/30
                          flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-primary-400" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">FMS Admin</p>
            <p className="text-gray-500 text-xs">Facility Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center
                          text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center px-4 py-3 border-b border-gray-800 bg-gray-900">
          <button onClick={() => setOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="ml-3 font-semibold text-white text-sm">FMS Admin</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"  element={<AdminDashboard />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="bookings"   element={<BookingsPage />} />
            <Route path="issues"     element={<IssuesPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
