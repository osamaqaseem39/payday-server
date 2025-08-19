import { useState } from 'react'
import { 
  HiUser, 
  HiBell, 
  HiCog, 
  HiShieldCheck, 
  HiGlobe, 
  HiKey,
  HiDownload,
  HiEye,
  HiEyeOff,
  HiCheck
} from 'react-icons/hi'

interface UserProfile {
  name: string
  email: string
  role: string
  avatar: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  applicationAlerts: boolean
  interviewReminders: boolean
  weeklyReports: boolean
  marketingEmails: boolean
}

const userProfile: UserProfile = {
  name: 'John Smith',
  email: 'john.smith@company.com',
  role: 'HR Manager',
  avatar: 'JS',
  timezone: 'America/New_York',
  language: 'English'
}

const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  applicationAlerts: true,
  interviewReminders: true,
  weeklyReports: false,
  marketingEmails: false
}

const timezoneOptions = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' }
]

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Français' },
  { value: 'German', label: 'Deutsch' },
  { value: 'Chinese', label: '中文' },
  { value: 'Japanese', label: '日本語' }
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile>(userProfile)
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotificationSettings)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleProfileUpdate = () => {
    setIsEditing(false)
    // Implement profile update logic here
    console.log('Profile updated:', profile)
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    // Implement password change logic here
    console.log('Password changed')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: HiUser },
    { id: 'notifications', name: 'Notifications', icon: HiBell },
    { id: 'security', name: 'Security', icon: HiShieldCheck },
    { id: 'preferences', name: 'Preferences', icon: HiCog },
    { id: 'integrations', name: 'Integrations', icon: HiGlobe }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 inline mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleProfileUpdate}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="input mt-1 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="input mt-1 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="input mt-1 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Avatar</label>
                <div className="mt-1 flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-lg">
                    {profile.avatar}
                  </div>
                  <button
                    disabled={!isEditing}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Email Notifications</h3>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive email notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(key as keyof NotificationSettings)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      value ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <HiEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input mt-1"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input mt-1"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handlePasswordChange}
                  className="btn-primary"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Two-factor authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button className="btn-secondary">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Regional Settings</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  className="input mt-1"
                >
                  {timezoneOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="input mt-1"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Data Export</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Export your data</h4>
                  <p className="text-sm text-gray-500">Download a copy of your data in JSON format</p>
                </div>
                <button className="btn-secondary flex items-center">
                  <HiDownload className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Connected Services</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                    <HiGlobe className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">LinkedIn</h4>
                    <p className="text-sm text-gray-500">Connected for job posting automation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <HiCheck className="h-3 w-3 mr-1" />
                    Connected
                  </span>
                  <button className="text-danger-600 hover:text-danger-900 text-sm font-medium">
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                    <HiKey className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Indeed</h4>
                    <p className="text-sm text-gray-500">Job board integration</p>
                  </div>
                </div>
                <button className="btn-primary text-sm">
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 