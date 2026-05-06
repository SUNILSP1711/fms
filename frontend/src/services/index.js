import api from './api'

export const authService = {
  login:    (data) => api.post('/auth/login',    data),
  register: (data) => api.post('/auth/register', data),
}

export const facilityService = {
  getAll:  (params) => api.get('/facilities', { params }),
  getById: (id)     => api.get(`/facilities/${id}`),
  create:  (data)   => api.post('/facilities', data),
  update:  (id, data) => api.put(`/facilities/${id}`, data),
  delete:  (id)     => api.delete(`/facilities/${id}`),
}

export const bookingService = {
  getAll:     (params) => api.get('/bookings',    { params }),
  getMy:      (params) => api.get('/bookings/my', { params }),
  getById:    (id)     => api.get(`/bookings/${id}`),
  create:     (data)   => api.post('/bookings', data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  delete:     (id)     => api.delete(`/bookings/${id}`),
}

export const issueService = {
  getAll:     (params) => api.get('/issues',    { params }),
  getMy:      (params) => api.get('/issues/my', { params }),
  getById:    (id)     => api.get(`/issues/${id}`),
  create:     (data)   => api.post('/issues', data),
  updateStatus: (id, status) => api.patch(`/issues/${id}/status`, { status }),
  delete:     (id)     => api.delete(`/issues/${id}`),
}

export const adminService = {
  getStats: () => api.get('/admin/stats'),
}
