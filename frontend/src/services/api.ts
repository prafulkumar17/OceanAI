import axios from 'axios'
import { Project, ProjectCreate } from '../types/project'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: async (email: string, password: string, fullName?: string) => {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      full_name: fullName,
    })
    return response.data
  },

  login: async (email: string, password: string) => {
    const formData = new FormData()
    formData.append('username', email)  // OAuth2 uses 'username' field
    formData.append('password', password)

    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const { access_token } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.removeItem('is_guest') // Clear guest flag on normal login
    return response.data
  },

  guestLogin: async () => {
    const response = await api.post('/api/auth/guest')
    const { access_token } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('is_guest', 'true')
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('is_guest')
  },
}

export const projectApi = {
  createProject: async (project: ProjectCreate): Promise<Project> => {
    const response = await api.post<Project>('/api/projects', project)
    return response.data
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/api/projects')
    return response.data
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/api/projects/${id}`)
    return response.data
  },

  generateDocument: async (id: number, topic?: string, document_type?: string): Promise<Project> => {
    const response = await api.post<Project>(`/api/projects/${id}/generate`, {
      project_id: id,
      topic,
      document_type
    })
    return response.data
  },

  refineDocument: async (id: number, refinementPrompt: string): Promise<Project> => {
    const response = await api.post<Project>(`/api/projects/${id}/refine`, {
      refinement_prompt: refinementPrompt,
    })
    return response.data
  },

  exportDocument: async (id: number): Promise<Blob> => {
    const response = await api.get(`/api/projects/${id}/export`, {
      responseType: 'blob',
    })
    return response.data
  },

  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/api/projects/${id}`)
  },

  updateProjectContent: async (id: number, content: any): Promise<Project> => {
    const response = await api.patch<Project>(`/api/projects/${id}/content`, {
      content
    })
    return response.data
  },

  getPdfPreview: async (id: number): Promise<Blob> => {
    const response = await api.get(`/api/projects/${id}/preview-pdf`, {
      responseType: 'blob',
    })
    return response.data
  },
}

export default api
