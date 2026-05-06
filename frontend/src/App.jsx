import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout  from './pages/admin/AdminLayout'
import StaffLayout  from './pages/staff/StaffLayout'
import LoadingSpinner from './components/LoadingSpinner'

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/staff'} replace />
  return children
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login"    element={!user ? <LoginPage />    : <Navigate to={user.role === 'ADMIN' ? '/admin' : '/staff'} />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/staff" />} />

      <Route path="/admin/*" element={
        <PrivateRoute role="ADMIN"><AdminLayout /></PrivateRoute>
      } />

      <Route path="/staff/*" element={
        <PrivateRoute role="STAFF"><StaffLayout /></PrivateRoute>
      } />

      <Route path="*" element={
        user
          ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/staff'} replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  )
}
