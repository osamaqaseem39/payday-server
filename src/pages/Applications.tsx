import { useState } from 'react'
import { 
  HiSearch, 
  HiFilter, 
  HiEye, 
  HiPencil, 
  HiTrash, 
  HiDownload,
  HiPlus,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiEye as HiEyeIcon
} from 'react-icons/hi'

interface Application {
  id: number
  name: string
  email: string
  position: string
  department: string
  status: 'pending' | 'reviewing' | 'interviewing' | 'hired' | 'rejected'
  experience: string
  date: string
  resume: string
  coverLetter: string
}

const applications: Application[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    status: 'reviewing',
    experience: '5 years',
    date: '2024-01-15',
    resume: 'resume_sarah_johnson.pdf',
    coverLetter: 'cover_sarah_johnson.pdf'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    position: 'Product Manager',
    department: 'Product',
    status: 'interviewing',
    experience: '7 years',
    date: '2024-01-14',
    resume: 'resume_michael_chen.pdf',
    coverLetter: 'cover_michael_chen.pdf'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    position: 'UX Designer',
    department: 'Design',
    status: 'hired',
    experience: '4 years',
    date: '2024-01-13',
    resume: 'resume_emily_davis.pdf',
    coverLetter: 'cover_emily_davis.pdf'
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    position: 'Marketing Specialist',
    department: 'Marketing',
    status: 'rejected',
    experience: '3 years',
    date: '2024-01-12',
    resume: 'resume_david_wilson.pdf',
    coverLetter: 'cover_david_wilson.pdf'
  },
  {
    id: 5,
    name: 'Lisa Brown',
    email: 'lisa.brown@email.com',
    position: 'Data Analyst',
    department: 'Analytics',
    status: 'pending',
    experience: '2 years',
    date: '2024-01-11',
    resume: 'resume_lisa_brown.pdf',
    coverLetter: 'cover_lisa_brown.pdf'
  },
  {
    id: 6,
    name: 'James Miller',
    email: 'james.miller@email.com',
    position: 'Frontend Developer',
    department: 'Engineering',
    status: 'reviewing',
    experience: '3 years',
    date: '2024-01-10',
    resume: 'resume_james_miller.pdf',
    coverLetter: 'cover_james_miller.pdf'
  }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' }
]

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Analytics', label: 'Analytics' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    case 'reviewing':
      return 'bg-blue-100 text-blue-800'
    case 'interviewing':
      return 'bg-yellow-100 text-yellow-800'
    case 'hired':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <HiClock className="h-4 w-4" />
    case 'reviewing':
      return <HiEyeIcon className="h-4 w-4" />
    case 'interviewing':
      return <HiClock className="h-4 w-4" />
    case 'hired':
      return <HiCheckCircle className="h-4 w-4" />
    case 'rejected':
      return <HiXCircle className="h-4 w-4" />
    default:
      return <HiClock className="h-4 w-4" />
  }
}

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selectedApplications, setSelectedApplications] = useState<number[]>([])

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || app.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([])
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id))
    }
  }

  const handleSelectApplication = (id: number) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(appId => appId !== id))
    } else {
      setSelectedApplications([...selectedApplications, id])
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for applications:`, selectedApplications)
    // Implement bulk actions here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600">Manage and review job applications from candidates.</p>
        </div>
        <button className="btn-primary flex items-center">
          <HiPlus className="h-4 w-4 mr-2" />
          New Application
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
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
            <button className="btn-secondary flex items-center">
              <HiFilter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedApplications.length} application(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="btn-success text-sm"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="btn-danger text-sm"
              >
                Reject Selected
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="btn-secondary text-sm"
              >
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th>Candidate</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Experience</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={() => handleSelectApplication(application.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{application.name}</div>
                      <div className="text-sm text-gray-500">{application.email}</div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-900">{application.position}</td>
                  <td className="text-sm text-gray-900">{application.department}</td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">{application.experience}</td>
                  <td className="text-sm text-gray-500">{application.date}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <HiEye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <HiDownload className="h-4 w-4" />
                      </button>
                      <button className="text-danger-600 hover:text-danger-900">
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
            <span className="font-medium">{filteredApplications.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary text-sm">Previous</button>
            <button className="btn-secondary text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
} 