import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services'
import toast from 'react-hot-toast'
import { Building2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  const validate = () => {
    const e = {}
    if (!form.name || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email = 'Invalid email format'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm)             e.confirm  = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await authService.register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      })
      login(data.token, data.user)
      toast.success('Account created! Welcome 🎉')
      navigate('/staff', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const field = (id, label, type, icon, placeholder, extra = {}) => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={form[id]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
          className={`input pl-10 ${errors[id] ? 'border-red-500' : ''}`}
          {...extra}
        />
      </div>
      {errors[id] && <p className="text-red-400 text-xs mt-1">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                        bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md page-enter">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary-600/20 border border-primary-500/30
                          flex items-center justify-center">
            <Building2 className="text-primary-400" size={28} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Register as a Staff member</p>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {field('name',    'Full Name',        'text',     <User  size={16}/>, 'Alice Johnson')}
            {field('email',   'Email address',    'email',    <Mail  size={16}/>, 'you@company.com')}

            {/* Password with toggle */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
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

            {field('confirm', 'Confirm Password', 'password', <Lock  size={16}/>, 'Re-enter password')}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
