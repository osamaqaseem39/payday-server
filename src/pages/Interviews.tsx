import { useState } from 'react'
import { 
  HiSearch, 
  HiFilter, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiEye,
  HiCalendar,
  HiClock,
  HiUser,
  HiVideoCamera,
  HiPhone,
  HiLocationMarker,
  HiCheckCircle,
  HiXCircle,
  HiBriefcase,
  HiStar
} from 'react-icons/hi'

interface Interview {
  id: number
  candidate: string
  position: string
  interviewer: string
  date: string
  time: string
  type: 'phone' | 'video' | 'onsite'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  location: string
  notes: string
  candidateEmail: string
  candidatePhone: string
  duration: string
  rating?: number
  feedback?: string
}

const interviews: Interview[] = [
  {
    id: 1,
    candidate: 'Sarah Johnson',
    position: 'Senior Software Engineer',
    interviewer: 'John Smith',
    date: '2024-01-20',
    time: '10:00 AM',
    type: 'video',
    status: 'scheduled',
    location: 'Zoom Meeting',
    notes: 'Technical interview focusing on React and Node.js',
    candidateEmail: 'sarah.johnson@email.com',
    candidatePhone: '+1 (555) 123-4567',
    duration: '60 minutes'
  },
  {
    id: 2,
    candidate: 'Michael Chen',
    position: 'Product Manager',
    interviewer: 'Jane Doe',
    date: '2024-01-19',
    time: '2:00 PM',
    type: 'onsite',
    status: 'completed',
    location: 'Conference Room A',
    notes: 'Product strategy and leadership discussion',
    candidateEmail: 'michael.chen@email.com',
    candidatePhone: '+1 (555) 234-5678',
    duration: '90 minutes',
    rating: 4.5,
    feedback: 'Strong candidate with excellent product sense. Recommended for next round.'
  },
  {
    id: 3,
    candidate: 'Emily Davis',
    position: 'UX Designer',
    interviewer: 'Alex Johnson',
    date: '2024-01-22',
    time: '11:00 AM',
    type: 'video',
    status: 'scheduled',
    location: 'Google Meet',
    notes: 'Portfolio review and design challenge discussion',
    candidateEmail: 'emily.davis@email.com',
    candidatePhone: '+1 (555) 345-6789',
    duration: '45 minutes'
  },
  {
    id: 4,
    candidate: 'David Wilson',
    position: 'Marketing Specialist',
    interviewer: 'Lisa Brown',
    date: '2024-01-18',
    time: '3:00 PM',
    type: 'phone',
    status: 'completed',
    location: 'Phone Call',
    notes: 'Marketing strategy and campaign experience discussion',
    candidateEmail: 'david.wilson@email.com',
    candidatePhone: '+1 (555) 456-7890',
    duration: '30 minutes',
    rating: 3.8,
    feedback: 'Good experience but may need more senior role. Consider for junior position.'
  },
  {
    id: 5,
    candidate: 'James Miller',
    position: 'Frontend Developer',
    interviewer: 'Tom Wilson',
    date: '2024-01-21',
    time: '1:00 PM',
    type: 'onsite',
    status: 'cancelled',
    location: 'Conference Room B',
    notes: 'Technical coding interview and system design',
    candidateEmail: 'james.miller@email.com',
    candidatePhone: '+1 (555) 567-8901',
    duration: '75 minutes'
  }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rescheduled', label: 'Rescheduled' }
]

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'phone', label: 'Phone' },
  { value: 'video', label: 'Video' },
  { value: 'onsite', label: 'On-site' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'rescheduled':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'scheduled':
      return <HiClock className="h-4 w-4" />
    case 'completed':
      return <HiCheckCircle className="h-4 w-4" />
    case 'cancelled':
      return <HiXCircle className="h-4 w-4" />
    case 'rescheduled':
      return <HiClock className="h-4 w-4" />
    default:
      return <HiClock className="h-4 w-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <HiVideoCamera className="h-4 w-4" />
    case 'phone':
      return <HiPhone className="h-4 w-4" />
    case 'onsite':
      return <HiLocationMarker className="h-4 w-4" />
    default:
      return <HiPhone className="h-4 w-4" />
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

export default function Interviews() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter
    const matchesType = typeFilter === 'all' || interview.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleStatusChange = (interviewId: number, newStatus: string) => {
    console.log(`Changing interview ${interviewId} status to ${newStatus}`)
    // Implement status change logic here
  }

  const handleReschedule = (interviewId: number) => {
    console.log(`Rescheduling interview ${interviewId}`)
    // Implement reschedule logic here
  }

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600">Schedule and manage candidate interviews.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <HiPlus className="h-4 w-4 mr-2" />
          Schedule Interview
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search interviews..."
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
            <button className="btn-secondary flex items-center">
              <HiFilter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredInterviews.map((interview) => (
          <div key={interview.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{interview.candidate}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiBriefcase className="h-4 w-4 mr-1" />
                  {interview.position}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiUser className="h-4 w-4 mr-1" />
                  {interview.interviewer}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiCalendar className="h-4 w-4 mr-1" />
                  {interview.date} at {interview.time}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  {getTypeIcon(interview.type)}
                  <span className="ml-1 capitalize">{interview.type}</span>
                  <span className="mx-2">•</span>
                  {interview.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <HiLocationMarker className="h-4 w-4 mr-1" />
                  {interview.location}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                  {getStatusIcon(interview.status)}
                  <span className="ml-1 capitalize">{interview.status}</span>
                </span>
                {interview.rating && (
                  <div className="flex items-center">
                    {renderStars(interview.rating)}
                    <span className="ml-1 text-sm text-gray-600">({interview.rating})</span>
                  </div>
                )}
              </div>
            </div>

            {interview.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{interview.notes}</p>
              </div>
            )}

            {interview.feedback && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Feedback:</p>
                <p className="text-sm text-blue-700">{interview.feedback}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewDetails(interview)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <HiEye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <HiPencil className="h-4 w-4" />
                  </button>
                  <button className="text-danger-600 hover:text-danger-900">
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  {interview.status === 'scheduled' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(interview.id, 'completed')}
                        className="btn-success text-xs"
                      >
                        Mark Complete
                      </button>
                      <button 
                        onClick={() => handleReschedule(interview.id)}
                        className="btn-warning text-xs"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                  {interview.status === 'scheduled' && (
                    <button className="btn-primary text-xs">
                      Join
                    </button>
                  )}
                  {interview.status === 'completed' && (
                    <button className="btn-secondary text-xs">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInterviews.length === 0 && (
        <div className="card text-center py-12">
          <HiCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedInterview(null)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Interview Details</h3>
                  <button
                    onClick={() => setSelectedInterview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HiXCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Candidate</h4>
                    <p className="text-sm text-gray-900">{selectedInterview.candidate}</p>
                    <p className="text-sm text-gray-500">{selectedInterview.candidateEmail}</p>
                    <p className="text-sm text-gray-500">{selectedInterview.candidatePhone}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Position</h4>
                    <p className="text-sm text-gray-900">{selectedInterview.position}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Interview Details</h4>
                    <p className="text-sm text-gray-900">{selectedInterview.interviewer}</p>
                    <p className="text-sm text-gray-500">{selectedInterview.date} at {selectedInterview.time}</p>
                    <p className="text-sm text-gray-500">{selectedInterview.duration} • {selectedInterview.type}</p>
                    <p className="text-sm text-gray-500">{selectedInterview.location}</p>
                  </div>
                  
                  {selectedInterview.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                      <p className="text-sm text-gray-900">{selectedInterview.notes}</p>
                    </div>
                  )}
                  
                  {selectedInterview.feedback && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Feedback</h4>
                      <p className="text-sm text-gray-900">{selectedInterview.feedback}</p>
                      {selectedInterview.rating && (
                        <div className="flex items-center mt-2">
                          {renderStars(selectedInterview.rating)}
                          <span className="ml-2 text-sm text-gray-600">({selectedInterview.rating}/5)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  onClick={() => setSelectedInterview(null)}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Interview Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule New Interview</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Candidate</label>
                    <select className="input mt-1">
                      <option>Select candidate...</option>
                      <option>Sarah Johnson</option>
                      <option>Michael Chen</option>
                      <option>Emily Davis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <select className="input mt-1">
                      <option>Select position...</option>
                      <option>Senior Software Engineer</option>
                      <option>Product Manager</option>
                      <option>UX Designer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interviewer</label>
                    <select className="input mt-1">
                      <option>Select interviewer...</option>
                      <option>John Smith</option>
                      <option>Jane Doe</option>
                      <option>Alex Johnson</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input type="date" className="input mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <input type="time" className="input mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select className="input mt-1">
                        <option value="phone">Phone</option>
                        <option value="video">Video</option>
                        <option value="onsite">On-site</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <select className="input mt-1">
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location/Details</label>
                    <input type="text" className="input mt-1" placeholder="e.g., Zoom Meeting, Conference Room A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea className="input mt-1" rows={3} placeholder="Interview focus areas, special instructions..."></textarea>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button className="btn-primary w-full sm:w-auto sm:ml-3">
                  Schedule Interview
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
    </div>
  )
} 