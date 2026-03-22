import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  githubLogin: () => {
    window.location.href = `${API_URL}/api/v1/auth/github`
  },
  callback: async (code: string) => {
    const response = await api.post('/auth/callback', { code })
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
    }
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  logout: () => {
    localStorage.removeItem('token')
  },
}

export const profilesAPI = {
  list: async (skip = 0, limit = 10) => {
    const response = await api.get('/profiles', { params: { skip, limit } })
    return response.data
  },
  get: async (username: string) => {
    const response = await api.get(`/profiles/${username}`)
    return response.data
  },
  create: async (username: string) => {
    const response = await api.post(`/profiles/create/${username}`)
    return response.data
  },
}

export const projectsAPI = {
  list: async (skip = 0, limit = 10, language?: string) => {
    const response = await api.get('/projects', { params: { skip, limit, language } })
    return response.data
  },
  get: async (owner: string, repo: string) => {
    const response = await api.get(`/projects/${owner}/${repo}`)
    return response.data
  },
  add: async (owner: string, repo: string) => {
    const response = await api.post(`/projects/add/${owner}/${repo}`)
    return response.data
  },
  discover: async (language?: string, minStars = 100, limit = 10) => {
    const response = await api.get('/projects/search/discover', {
      params: { language, min_stars: minStars, limit },
    })
    return response.data
  },
}

export const matchesAPI = {
  findForContributor: async (username: string, limit = 10) => {
    const response = await api.get(`/matches/contributor/${username}`, {
      params: { limit },
    })
    return response.data
  },
  findForProject: async (owner: string, repo: string, limit = 10) => {
    const response = await api.get(`/matches/project/${owner}/${repo}`, {
      params: { limit },
    })
    return response.data
  },
  save: async (matchData: any) => {
    const response = await api.post('/matches/save', matchData)
    return response.data
  },
  getSaved: async (userId: number) => {
    const response = await api.get(`/matches/saved/${userId}`)
    return response.data
  },
}

export const healthAPI = {
  analyze: async (owner: string, repo: string) => {
    const response = await api.get(`/health/analyze/${owner}/${repo}`)
    return response.data
  },
  getQuickScore: async (owner: string, repo: string) => {
    const response = await api.get(`/health/score/${owner}/${repo}`)
    return response.data
  },
}

export default api
