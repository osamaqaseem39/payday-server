import { useState, useEffect } from 'react'
import { 
  HiSearch, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiEye,
  HiGlobe,
  HiClock,
  HiUsers,
  HiLocationMarker,
  HiCurrencyDollar,
  HiXCircle,
  HiBriefcase,
  HiExclamation
} from 'react-icons/hi'
import { jobsApi } from '../services/api'

interface Job {
  id: number
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  status: 'active' | 'closed' | 'draft'
  applicationsCount: number
  salary: string
  experience: string
  postedDate: string
  deadline: string
  description: string
}

interface JobFormData {
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience: string
  salary: string
  description: string
  deadline: string
}

const [jobs, setJobs] = useState<Job[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' }
]

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Analytics', label: 'Analytics' }
]

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'closed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'draft':
      return <HiClock className="h-4 w-4" />
    case 'active':
      return <HiGlobe className="h-4 w-4" />
    case 'closed':
      return <HiXCircle className="h-4 w-4" />
    default:
      return <HiClock className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'full-time':
      return 'bg-blue-100 text-blue-800'
    case 'part-time':
      return 'bg-purple-100 text-purple-800'
    case 'contract':
      return 'bg-orange-100 text-orange-800'
    case 'internship':
      return 'bg-pink-100 text-pink-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDaysUntilDeadline = (deadline: string) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getDeadlineColor = (deadline: string) => {
  const days = getDaysUntilDeadline(deadline)
  if (days < 0) return 'text-red-600'
  if (days <= 7) return 'text-orange-600'
  if (days <= 30) return 'text-yellow-600'
  return 'text-gray-500'
}

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    experience: '',
    salary: '',
    description: '',
    deadline: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<JobFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const fetchedJobs = await jobsApi.getAll()
        setJobs(fetchedJobs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
        console.error('Error fetching jobs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter
    const matchesType = typeFilter === 'all' || job.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesType
  })

  const handleStatusChange = (jobId: number, newStatus: string) => {
    console.log(`Changing job ${jobId} status to ${newStatus}`)
    // Implement status change logic here
  }

  const validateForm = (): boolean => {
    const errors: Partial<JobFormData> = {}
    
    if (!formData.title.trim()) errors.title = 'Job title is required'
    if (!formData.department.trim()) errors.department = 'Department is required'
    if (!formData.location.trim()) errors.location = 'Location is required'
    if (!formData.experience.trim()) errors.experience = 'Experience requirement is required'
    if (!formData.salary.trim()) errors.salary = 'Salary range is required'
    if (!formData.description.trim()) errors.description = 'Job description is required'
    if (!formData.deadline) errors.deadline = 'Application deadline is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateJob = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      const newJob = await jobsApi.create({
        ...formData,
        status: 'draft',
        applicationsCount: 0,
        postedDate: new Date().toISOString().split('T')[0]
      })
      
      setJobs(prev => [...prev, newJob])
      setShowCreateModal(false)
      resetForm()
      // You could add a success notification here
    } catch (error) {
      console.error('Error creating job:', error)
      setError(error instanceof Error ? error.message : 'Failed to create job')
      // You could add an error notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      deadline: job.deadline
    })
    setShowEditModal(true)
  }

  const handleUpdateJob = async () => {
    if (!validateForm() || !editingJob) return
    
    setIsSubmitting(true)
    try {
      const updatedJob = await jobsApi.update(editingJob.id, formData)
      
      setJobs(prev => prev.map(job => job.id === editingJob.id ? updatedJob : job))
      setShowEditModal(false)
      setEditingJob(null)
      resetForm()
      // You could add a success notification here
    } catch (error) {
      console.error('Error updating job:', error)
      setError(error instanceof Error ? error.message : 'Failed to update job')
      // You could add an error notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      experience: '',
      salary: '',
      description: '',
      deadline: ''
    })
    setFormErrors({})
  }

  const handleDeleteJob = (jobId: number) => {
    setShowDeleteConfirm(jobId)
  }

  const confirmDeleteJob = async (jobId: number) => {
    try {
      await jobsApi.delete(jobId)
      
      setJobs(prev => prev.filter(job => job.id !== jobId))
      setShowDeleteConfirm(null)
      // You could add a success notification here
    } catch (error) {
      console.error('Error deleting job:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete job')
      // You could add an error notification here
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Create and manage job postings for your organization.</p>
        </div>
        <button 
          onClick={() => {
            resetForm()
            setShowCreateModal(true)
          }}
          className="btn-primary flex items-center"
        >
          <HiPlus className="h-4 w-4 mr-2" />
          Create Job
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading jobs...</p>
        </div>
      )}

      {error && (
        <div className="card border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <HiExclamation className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-40"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input w-40"
            >
              {departmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-40"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {!loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredJobs.map((job) => (
          <div key={job.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiLocationMarker className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiUsers className="h-4 w-4 mr-1" />
                  {job.department}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiCurrencyDollar className="h-4 w-4 mr-1" />
                  {job.salary}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiClock className="h-4 w-4 mr-1" />
                  {job.experience}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {getStatusIcon(job.status)}
                  <span className="ml-1 capitalize">{job.status}</span>
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                  {job.type.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>Applications: {job.applicationsCount}</span>
                <span>Posted: {formatDate(job.postedDate)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-xs ${getDeadlineColor(job.deadline)}`}>
                  Deadline: {formatDate(job.deadline)}
                  {getDaysUntilDeadline(job.deadline) < 0 && (
                    <span className="ml-1 text-red-600">(Expired)</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary-600 hover:text-primary-900">
                    <HiEye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditJob(job)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <HiPencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-danger-600 hover:text-danger-900"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                {job.status === 'draft' && (
                  <button 
                    onClick={() => handleStatusChange(job.id, 'active')}
                    className="btn-success text-xs flex-1"
                  >
                    Publish
                  </button>
                )}
                {job.status === 'active' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(job.id, 'draft')}
                      className="btn-warning text-xs flex-1"
                    >
                      Pause
                    </button>
                    <button 
                      onClick={() => handleStatusChange(job.id, 'closed')}
                      className="btn-danger text-xs flex-1"
                    >
                      Close
                    </button>
                  </>
                )}
                {job.status === 'draft' && (
                  <button 
                    onClick={() => handleStatusChange(job.id, 'active')}
                    className="btn-success text-xs flex-1"
                  >
                    Resume
                  </button>
                )}
                {job.status === 'closed' && (
                  <button 
                    onClick={() => handleStatusChange(job.id, 'active')}
                    className="btn-success text-xs flex-1"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredJobs.length === 0 && (
        <div className="card text-center py-12">
          <HiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Job</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                    <input 
                      type="text" 
                      className={`input mt-1 ${formErrors.title ? 'border-red-500' : ''}`} 
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department *</label>
                    <select 
                      className={`input mt-1 ${formErrors.department ? 'border-red-500' : ''}`}
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.slice(1).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.department && <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location *</label>
                    <input 
                      type="text" 
                      className={`input mt-1 ${formErrors.location ? 'border-red-500' : ''}`} 
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                    {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Job Type *</label>
                      <select 
                        className="input mt-1"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      >
                        {typeOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience *</label>
                      <input 
                        type="text" 
                        className={`input mt-1 ${formErrors.experience ? 'border-red-500' : ''}`} 
                        placeholder="e.g., 3+ years"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      />
                      {formErrors.experience && <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary Range *</label>
                    <input 
                      type="text" 
                      className={`input mt-1 ${formErrors.salary ? 'border-red-500' : ''}`} 
                      placeholder="e.g., $80k - $120k"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    />
                    {formErrors.salary && <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Deadline *</label>
                    <input 
                      type="date" 
                      className={`input mt-1 ${formErrors.deadline ? 'border-red-500' : ''}`}
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    />
                    {formErrors.deadline && <p className="mt-1 text-sm text-red-600">{formErrors.deadline}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description *</label>
                    <textarea 
                      className={`input mt-1 ${formErrors.description ? 'border-red-500' : ''}`} 
                      rows={4} 
                      placeholder="Job description..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  onClick={handleCreateJob}
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto sm:ml-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Job'}
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Job: {editingJob.title}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                    <input 
                      type="text" 
                      className={`input mt-1 ${formErrors.title ? 'border-red-500' : ''}`} 
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department *</label>
                    <select 
                      className={`input mt-1 ${formErrors.department ? 'border-red-500' : ''}`}
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.slice(1).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.department && <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location *</label>
                    <input 
                      type="text" 
                      className={`input mt-1 ${formErrors.location ? 'border-red-500' : ''}`} 
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                    {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Job Type *</label>
                      <select 
                        className="input mt-1"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      >
                        {typeOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience *</label>
                      <input 
                        type="text" 
                        className={`input mt-1 ${formErrors.experience ? 'border-red-500' : ''}`} 
                        placeholder="e.g., 3+ years"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      />
                      {formErrors.experience && <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary Range *</label>
                    <input 
                      type="text" 
                      className={`input mt-1 ${formErrors.salary ? 'border-red-500' : ''}`} 
                      placeholder="e.g., $80k - $120k"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    />
                    {formErrors.salary && <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Deadline *</label>
                    <input 
                      type="date" 
                      className={`input mt-1 ${formErrors.deadline ? 'border-red-500' : ''}`}
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    />
                    {formErrors.deadline && <p className="mt-1 text-sm text-red-600">{formErrors.deadline}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description *</label>
                    <textarea 
                      className={`input mt-1 ${formErrors.description ? 'border-red-500' : ''}`} 
                      rows={4} 
                      placeholder="Job description..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  onClick={handleUpdateJob}
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto sm:ml-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Job'}
                </button>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteConfirm(null)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <HiExclamation className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900">Delete Job</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this job posting? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  onClick={() => confirmDeleteJob(showDeleteConfirm)}
                  className="btn-danger w-full sm:w-auto sm:ml-3"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 