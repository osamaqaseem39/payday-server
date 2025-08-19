import { useState } from 'react'
import { 
  HiUsers, 
  HiBriefcase, 
  HiDocumentText, 
  HiCalendar,
  HiTrendingUp,
  HiTrendingDown,
  HiEye,
  HiCheckCircle,
  HiClock,
  HiXCircle
} from 'react-icons/hi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import LoanCalculator from '../components/LoanCalculator'

const stats = [
  { name: 'Total Applications', value: '2,847', change: '+12%', changeType: 'positive', icon: HiDocumentText },
  { name: 'Active Jobs', value: '23', change: '+5%', changeType: 'positive', icon: HiBriefcase },
  { name: 'Total Candidates', value: '1,234', change: '+8%', changeType: 'positive', icon: HiUsers },
  { name: 'Interviews This Week', value: '18', change: '-2%', changeType: 'negative', icon: HiCalendar },
]

const chartData = [
  { name: 'Jan', applications: 65, interviews: 28, hires: 12 },
  { name: 'Feb', applications: 59, interviews: 48, hires: 15 },
  { name: 'Mar', applications: 80, interviews: 40, hires: 18 },
  { name: 'Apr', applications: 81, interviews: 19, hires: 22 },
  { name: 'May', applications: 56, interviews: 96, hires: 25 },
  { name: 'Jun', applications: 55, interviews: 27, hires: 20 },
]

const pieData = [
  { name: 'Software Engineer', value: 35, color: '#3B82F6' },
  { name: 'Product Manager', value: 25, color: '#10B981' },
  { name: 'Designer', value: 20, color: '#F59E0B' },
  { name: 'Marketing', value: 15, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#8B5CF6' },
]

const recentApplications = [
  { id: 1, name: 'Sarah Johnson', position: 'Senior Software Engineer', status: 'reviewing', date: '2 hours ago', avatar: 'SJ' },
  { id: 2, name: 'Michael Chen', position: 'Product Manager', status: 'interviewing', date: '4 hours ago', avatar: 'MC' },
  { id: 3, name: 'Emily Davis', position: 'UX Designer', status: 'hired', date: '1 day ago', avatar: 'ED' },
  { id: 4, name: 'David Wilson', position: 'Marketing Specialist', status: 'rejected', date: '2 days ago', avatar: 'DW' },
  { id: 5, name: 'Lisa Brown', position: 'Data Analyst', status: 'pending', date: '3 days ago', avatar: 'LB' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'reviewing':
      return 'bg-blue-100 text-blue-800'
    case 'interviewing':
      return 'bg-yellow-100 text-yellow-800'
    case 'hired':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'reviewing':
      return <HiEye className="h-4 w-4" />
    case 'interviewing':
      return <HiClock className="h-4 w-4" />
    case 'hired':
      return <HiCheckCircle className="h-4 w-4" />
    case 'rejected':
      return <HiXCircle className="h-4 w-4" />
    case 'pending':
      return <HiClock className="h-4 w-4" />
    default:
      return <HiClock className="h-4 w-4" />
  }
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6M')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your career management.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-32"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <HiTrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                      ) : (
                        <HiTrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                      )}
                      <span className="sr-only">{stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Applications Trend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Applications Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="hires" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Job Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loan Calculator */}
      <LoanCalculator />

      {/* Recent Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
          <button className="btn-primary">View All</button>
        </div>
        <div className="overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
                        {application.avatar}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{application.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-900">{application.position}</td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">{application.date}</td>
                  <td>
                    <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 