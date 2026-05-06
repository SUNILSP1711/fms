import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services'
import toast from 'react-hot-toast'
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await authService.login(form)
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/staff', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                        bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md page-enter">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary-600/20 border border-primary-500/30
                          flex items-center justify-center">
            <Building2 className="text-primary-400" size={28} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Facility Management</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
          </div>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Register
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 card text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-400 mb-2">Demo Credentials</p>
          <p>👑 Admin — <span className="text-gray-300">admin@fms.com</span> / <span className="text-gray-300">Admin@123</span></p>
          <p>👤 Staff — <span className="text-gray-300">staff1@fms.com</span> / <span className="text-gray-300">Staff@123</span></p>
        </div>
      </div>
    </div>
  )
}
