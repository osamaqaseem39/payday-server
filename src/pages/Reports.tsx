import { useState } from 'react'
import { 
  HiDownload, 
  HiUsers, 
  HiDocumentText, 
  HiCheckCircle,
  HiClock,
  HiTrendingUp,
  HiTrendingDown
} from 'react-icons/hi'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const timeRanges = [
  { value: '7D', label: 'Last 7 Days' },
  { value: '30D', label: 'Last 30 Days' },
  { value: '90D', label: 'Last 90 Days' },
  { value: '1Y', label: 'Last Year' }
]

const applicationTrends = [
  { month: 'Jan', applications: 245, interviews: 89, hires: 23, rejections: 156 },
  { month: 'Feb', applications: 289, interviews: 102, hires: 31, rejections: 187 },
  { month: 'Mar', applications: 312, interviews: 118, hires: 28, rejections: 194 },
  { month: 'Apr', applications: 298, interviews: 95, hires: 25, rejections: 203 },
  { month: 'May', applications: 356, interviews: 134, hires: 35, rejections: 221 },
  { month: 'Jun', applications: 334, interviews: 128, hires: 32, rejections: 206 }
]

const departmentStats = [
  { name: 'Engineering', applications: 45, interviews: 18, hires: 8, avgTime: 12 },
  { name: 'Product', applications: 32, interviews: 14, hires: 6, avgTime: 15 },
  { name: 'Design', applications: 28, interviews: 12, hires: 5, avgTime: 18 },
  { name: 'Marketing', applications: 25, interviews: 10, hires: 4, avgTime: 14 },
  { name: 'Sales', applications: 22, interviews: 8, hires: 3, avgTime: 16 }
]

const sourceData = [
  { name: 'LinkedIn', value: 35, color: '#0077B5' },
  { name: 'Company Website', value: 25, color: '#3B82F6' },
  { name: 'Indeed', value: 20, color: '#2164F3' },
  { name: 'Referrals', value: 15, color: '#10B981' },
  { name: 'Other', value: 5, color: '#6B7280' }
]

const kpiData = [
  { 
    title: 'Total Applications', 
    value: '2,847', 
    change: '+12%', 
    changeType: 'positive',
    icon: HiDocumentText,
    color: 'text-blue-600'
  },
  { 
    title: 'Interview Rate', 
    value: '32.5%', 
    change: '+5.2%', 
    changeType: 'positive',
    icon: HiUsers,
    color: 'text-green-600'
  },
  { 
    title: 'Hire Rate', 
    value: '8.7%', 
    change: '+1.8%', 
    changeType: 'positive',
    icon: HiCheckCircle,
    color: 'text-purple-600'
  },
  { 
    title: 'Time to Hire', 
    value: '14.2 days', 
    change: '-2.1 days', 
    changeType: 'positive',
    icon: HiClock,
    color: 'text-orange-600'
  }
]

export default function Reports() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('90D')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const filteredDepartmentStats = selectedDepartment === 'all' 
    ? departmentStats 
    : departmentStats.filter(dept => dept.name === selectedDepartment)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your recruitment performance and insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="input w-40"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="btn-secondary flex items-center">
            <HiDownload className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <div key={kpi.title} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{kpi.title}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{kpi.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      kpi.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {kpi.changeType === 'positive' ? (
                        <HiTrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                      ) : (
                        <HiTrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                      )}
                      <span className="sr-only">{kpi.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                      {kpi.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Application Trends */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="interviews" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="hires" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Application Sources */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Application Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Department Performance</h3>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Departments</option>
            {departmentStats.map(dept => (
              <option key={dept.name} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredDepartmentStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="applications" fill="#3B82F6" name="Applications" />
            <Bar dataKey="interviews" fill="#10B981" name="Interviews" />
            <Bar dataKey="hires" fill="#F59E0B" name="Hires" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Stats Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Applications</th>
                <th>Interviews</th>
                <th>Hires</th>
                <th>Interview Rate</th>
                <th>Hire Rate</th>
                <th>Avg Time to Hire</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept) => (
                <tr key={dept.name}>
                  <td className="font-medium text-gray-900">{dept.name}</td>
                  <td>{dept.applications}</td>
                  <td>{dept.interviews}</td>
                  <td>{dept.hires}</td>
                  <td>{((dept.interviews / dept.applications) * 100).toFixed(1)}%</td>
                  <td>{((dept.hires / dept.applications) * 100).toFixed(1)}%</td>
                  <td>{dept.avgTime} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <HiTrendingUp className="h-5 w-5 text-success-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Applications increased by 12%</p>
                <p className="text-sm text-gray-500">LinkedIn campaigns showing strong results</p>
              </div>
            </div>
            <div className="flex items-start">
              <HiTrendingDown className="h-5 w-5 text-danger-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Time to hire increased by 2 days</p>
                <p className="text-sm text-gray-500">Consider streamlining interview process</p>
              </div>
            </div>
            <div className="flex items-start">
              <HiCheckCircle className="h-5 w-5 text-success-500 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Engineering department performing well</p>
                <p className="text-sm text-gray-500">8 hires this quarter, above target</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Optimize Job Descriptions</p>
              <p className="text-sm text-blue-700">Update job postings to improve application quality</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Expand Referral Program</p>
              <p className="text-sm text-green-700">Referrals show highest conversion rates</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Review Interview Process</p>
              <p className="text-sm text-yellow-700">Consider reducing interview rounds for faster decisions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 