import { useState } from 'react'
import { 
  HiSearch, 
  HiFilter, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiEye,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiAcademicCap,
  HiBriefcase,
  HiStar,
  HiUsers
} from 'react-icons/hi'

interface Candidate {
  id: number
  name: string
  email: string
  phone: string
  location: string
  experience: string
  education: string
  skills: string[]
  rating: number
  status: 'active' | 'inactive' | 'shortlisted'
  lastContact: string
  avatar: string
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    experience: '5 years',
    education: 'BS Computer Science, Stanford University',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    rating: 4.8,
    status: 'active',
    lastContact: '2024-01-15',
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    experience: '7 years',
    education: 'MBA, Harvard Business School',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
    rating: 4.6,
    status: 'shortlisted',
    lastContact: '2024-01-14',
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Los Angeles, CA',
    experience: '4 years',
    education: 'BFA Design, Parsons School of Design',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    rating: 4.9,
    status: 'active',
    lastContact: '2024-01-13',
    avatar: 'ED'
  }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'shortlisted', label: 'Shortlisted' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'shortlisted':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <HiStar
      key={i}
      className={`h-4 w-4 ${
        i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ))
}

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600">Manage your candidate database and profiles.</p>
        </div>
        <button className="btn-primary flex items-center">
          <HiPlus className="h-4 w-4 mr-2" />
          Add Candidate
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
                placeholder="Search candidates..."
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
            <button className="btn-secondary flex items-center">
              <HiFilter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-lg">
                  {candidate.avatar}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <HiStar className="h-4 w-4 text-yellow-400 mr-1" />
                    {candidate.rating} ({candidate.experience})
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                {candidate.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <HiMail className="h-4 w-4 mr-2 text-gray-400" />
                {candidate.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <HiPhone className="h-4 w-4 mr-2 text-gray-400" />
                {candidate.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <HiLocationMarker className="h-4 w-4 mr-2 text-gray-400" />
                {candidate.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <HiAcademicCap className="h-4 w-4 mr-2 text-gray-400" />
                {candidate.education}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <HiBriefcase className="h-4 w-4 mr-2 text-gray-400" />
                {candidate.experience} experience
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>Last Contact: {candidate.lastContact}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="text-primary-600 hover:text-primary-900">
                    <HiEye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <HiPencil className="h-4 w-4" />
                  </button>
                  <button className="text-danger-600 hover:text-danger-900">
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
                <button className="btn-primary text-sm">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="card text-center py-12">
          <HiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
} 