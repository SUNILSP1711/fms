import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — global error handling
api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || 'Something went wrong'
    const status  = err.response?.status

    if (status === 401) {
      localStorage.removeItem('fms_token')
      localStorage.removeItem('fms_user')
      window.location.href = '/login'
    } else if (status !== 404 && status !== 400) {
      // 400/404 validation errors shown by each component
      toast.error(message)
    }
    return Promise.reject(err)
  }
)

export default api
