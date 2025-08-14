const API_BASE_URL = 'http://localhost:3002'

// Generic API functions
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Jobs API
export const jobsApi = {
  getAll: () => apiRequest<Job[]>('/jobs'),
  getById: (id: number) => apiRequest<Job>(`/jobs/${id}`),
  create: (job: Omit<Job, 'id'>) => apiRequest<Job>('/jobs', {
    method: 'POST',
    body: JSON.stringify(job),
  }),
  update: (id: number, job: Partial<Job>) => apiRequest<Job>(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(job),
  }),
  delete: (id: number) => apiRequest<{}>(`/jobs/${id}`, {
    method: 'DELETE',
  }),
}

// Applications API
export const applicationsApi = {
  getAll: () => apiRequest<Application[]>('/applications'),
  getById: (id: number) => apiRequest<Application>(`/applications/${id}`),
  create: (application: Omit<Application, 'id'>) => apiRequest<Application>('/applications', {
    method: 'POST',
    body: JSON.stringify(application),
  }),
  update: (id: number, application: Partial<Application>) => apiRequest<Application>(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(application),
  }),
  delete: (id: number) => apiRequest<{}>(`/applications/${id}`, {
    method: 'DELETE',
  }),
}

// Candidates API
export const candidatesApi = {
  getAll: () => apiRequest<Candidate[]>('/candidates'),
  getById: (id: number) => apiRequest<Candidate>(`/candidates/${id}`),
  create: (candidate: Omit<Candidate, 'id'>) => apiRequest<Candidate>('/candidates', {
    method: 'POST',
    body: JSON.stringify(candidate),
  }),
  update: (id: number, candidate: Partial<Candidate>) => apiRequest<Candidate>(`/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(candidate),
  }),
  delete: (id: number) => apiRequest<{}>(`/candidates/${id}`, {
    method: 'DELETE',
  }),
}

// Interviews API
export const interviewsApi = {
  getAll: () => apiRequest<Interview[]>('/interviews'),
  getById: (id: number) => apiRequest<Interview>(`/interviews/${id}`),
  create: (interview: Omit<Interview, 'id'>) => apiRequest<Interview>('/interviews', {
    method: 'POST',
    body: JSON.stringify(interview),
  }),
  update: (id: number, interview: Partial<Interview>) => apiRequest<Interview>(`/interviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(interview),
  }),
  delete: (id: number) => apiRequest<{}>(`/interviews/${id}`, {
    method: 'DELETE',
  }),
}

// Types (you can move these to a separate types file)
export interface Job {
  id: number
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience: string
  salary: string
  description: string
  deadline: string
  status: 'active' | 'closed' | 'draft'
  postedDate: string
  applicationsCount: number
}

export interface Application {
  id: number
  jobId: number
  candidateId: number
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  appliedDate: string
  resume: string
  coverLetter: string
  experience: string
}

export interface Candidate {
  id: number
  name: string
  email: string
  phone: string
  experience: string
  skills: string[]
  status: 'active' | 'inactive' | 'hired'
  appliedDate: string
}

export interface Interview {
  id: number
  candidateId: number
  jobId: number
  date: string
  type: 'technical' | 'behavioral' | 'final'
  interviewer: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string
} 