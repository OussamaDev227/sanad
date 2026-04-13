import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const getPersistedAuthState = () => {
  try {
    const persisted = JSON.parse(sessionStorage.getItem('sanad_auth') || '{}')
    return persisted?.state || {}
  } catch {
    return {}
  }
}

const patchPersistedAuthState = (nextState) => {
  try {
    const persisted = JSON.parse(sessionStorage.getItem('sanad_auth') || '{}')
    sessionStorage.setItem('sanad_auth', JSON.stringify({
      ...persisted,
      state: {
        ...(persisted?.state || {}),
        ...nextState,
      },
    }))
  } catch {
    // ignore storage edge cases and continue with in-memory flow
  }
}

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = getPersistedAuthState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config || {}
    const status = err.response?.status

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { refreshToken } = getPersistedAuthState()

      if (refreshToken) {
        try {
          const refreshRes = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken })
          const nextAccess = refreshRes.data?.access
          const nextRefresh = refreshRes.data?.refresh || refreshToken
          if (nextAccess) {
            patchPersistedAuthState({ token: nextAccess, refreshToken: nextRefresh, isAuthenticated: true })
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${nextAccess}`
            return api(originalRequest)
          }
        } catch {
          // fall through to logout redirect
        }
      }

      patchPersistedAuthState({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      sessionStorage.removeItem('sanad_auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  me: () => api.get('/auth/me/'),
  refresh: (refresh) => api.post('/auth/token/refresh/', { refresh }),
}

// ── Services ────────────────────────────────────────────────────────
export const servicesAPI = {
  list: (params) => api.get('/services/', { params }),
  detail: (id) => api.get(`/services/${id}/`),
  create: (data) => api.post('/services/', data),
  update: (id, data) => api.put(`/services/${id}/`, data),
  delete: (id) => api.delete(`/services/${id}/`),
}

// ── Categories ──────────────────────────────────────────────────────
export const categoriesAPI = {
  list: () => api.get('/services/categories/'),
}

// ── Requests ────────────────────────────────────────────────────────
export const requestsAPI = {
  create: (data) => api.post('/requests/', data),
  myRequests: (params) => api.get('/requests/', { params }),
  detail: (id) => api.get(`/requests/${id}/`),
  update: (id, data) => api.patch(`/requests/${id}/`, data),
}

// ── Admin ───────────────────────────────────────────────────────────
export const adminAPI = {
  stats: () => api.get('/auth/admin/stats/'),
  users: (params) => api.get('/auth/admin/users/', { params }),
  updateUser: (id, data) => api.patch(`/auth/admin/users/${id}/`, data),
}

export default api
