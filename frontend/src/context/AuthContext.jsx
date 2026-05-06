import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token     = localStorage.getItem('fms_token')
    const savedUser = localStorage.getItem('fms_user')
    if (token && savedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('fms_token', token)
    localStorage.setItem('fms_user',  JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('fms_token')
    localStorage.removeItem('fms_user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
