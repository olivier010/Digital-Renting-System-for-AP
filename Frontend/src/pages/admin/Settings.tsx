import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Users, 
  Mail, 
  Save, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  RefreshCw,
  Download,
  Upload,
  Monitor,
  Archive,
  Trash2,
  UserPlus,
  Ban
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Digital Renting System',
    siteDescription: 'Professional platform for property rentals',
    contactEmail: 'admin@digitalrenting.com',
    supportPhone: '+1 (555) 123-4567',
    timezone: 'UTC-5',
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    maintenanceMode: false,
    debugMode: false
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    ipWhitelist: '',
    allowedDomains: '',
    enforceHttps: true,
    apiRateLimit: 100,
    logLevel: 'info'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newUserAlerts: true,
    bookingAlerts: true,
    paymentAlerts: true,
    systemAlerts: true,
    securityAlerts: true,
    weeklyReports: true,
    marketingEmails: false
  })

  const [systemSettings, setSystemSettings] = useState({
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
    backupFrequency: 'daily',
    retentionPeriod: 90,
    cacheTimeout: 3600,
    maxConcurrentUsers: 1000,
    enableCaching: true,
    enableCDN: true,
    logLevel: 'info'
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@digitalrenting.com',
    smtpPassword: '••••••••',
    smtpEncryption: 'tls',
    fromName: 'Digital Renting System',
    fromEmail: 'noreply@digitalrenting.com',
    replyTo: 'support@digitalrenting.com'
  })

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'backup', label: 'Backup & Restore', icon: Archive }
  ]

  const handleSaveSettings = () => {
    console.log('Saving settings for tab:', activeTab)
    // API call to save settings
  }

  const handleTestEmail = () => {
    console.log('Testing email configuration')
    // API call to test email
  }

  const handleBackup = () => {
    console.log('Creating system backup')
    // API call to create backup
  }

  const handleRestore = () => {
    console.log('Restoring from backup')
    // API call to restore backup
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          System Settings
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Configure and manage your platform settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={generalSettings.supportPhone}
                      onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Timezone
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">GMT (UTC+0)</option>
                      <option value="UTC+1">Central European Time (UTC+1)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Language
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Currency
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-surface-200 dark:border-surface-600"
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Maintenance Mode</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-surface-200 dark:border-surface-600"
                      checked={generalSettings.debugMode}
                      onChange={(e) => setGeneralSettings({...generalSettings, debugMode: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Debug Mode</span>
                  </label>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">Security Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Password Minimum Length
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Lockout Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      API Rate Limit (requests/minute)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={securitySettings.apiRateLimit}
                      onChange={(e) => setSecuritySettings({...securitySettings, apiRateLimit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Log Level
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={securitySettings.logLevel}
                      onChange={(e) => setSecuritySettings({...securitySettings, logLevel: e.target.value})}
                    >
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    IP Whitelist (one per line)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    placeholder="192.168.1.1&#10;10.0.0.1"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => setSecuritySettings({...securitySettings, ipWhitelist: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-surface-200 dark:border-surface-600"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Two-Factor Authentication</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-surface-200 dark:border-surface-600"
                      checked={securitySettings.requireSpecialChars}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Require Special Characters in Password</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-surface-200 dark:border-surface-600"
                      checked={securitySettings.enforceHttps}
                      onChange={(e) => setSecuritySettings({...securitySettings, enforceHttps: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Enforce HTTPS</span>
                  </label>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Send notifications via email</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.emailNotifications ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">SMS Notifications</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Send notifications via SMS</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.smsNotifications ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Push Notifications</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Send browser push notifications</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.pushNotifications ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">New User Alerts</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Alert when new users register</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, newUserAlerts: !notificationSettings.newUserAlerts})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.newUserAlerts ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.newUserAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Booking Alerts</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Alert for new bookings</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, bookingAlerts: !notificationSettings.bookingAlerts})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.bookingAlerts ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.bookingAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Payment Alerts</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Alert for payment issues</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, paymentAlerts: !notificationSettings.paymentAlerts})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.paymentAlerts ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.paymentAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">System Alerts</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Alert for system issues</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, systemAlerts: !notificationSettings.systemAlerts})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.systemAlerts ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.systemAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Security Alerts</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Alert for security threats</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, securityAlerts: !notificationSettings.securityAlerts})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.securityAlerts ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Weekly Reports</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Send weekly activity reports</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, weeklyReports: !notificationSettings.weeklyReports})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.weeklyReports ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Marketing Emails</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Send marketing communications</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, marketingEmails: !notificationSettings.marketingEmails})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.marketingEmails ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* User Management */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">User Management Settings</h2>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          User Registration
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          Currently open for public registration. Consider requiring admin approval for new users.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Default User Role
                      </label>
                      <select className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white">
                        <option value="renter">Renter</option>
                        <option value="pending">Pending Approval</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Account Verification
                      </label>
                      <select className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white">
                        <option value="email">Email Verification</option>
                        <option value="admin">Admin Approval</option>
                        <option value="automatic">Automatic</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-surface-900 dark:text-white">User Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create User
                      </button>
                      <button className="flex items-center justify-center px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors">
                        <Ban className="w-4 h-4 mr-2" />
                        Ban Users
                      </button>
                      <button className="flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Users
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">System Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Cache Timeout (seconds)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={systemSettings.cacheTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, cacheTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Max Concurrent Users
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={systemSettings.maxConcurrentUsers}
                      onChange={(e) => setSystemSettings({...systemSettings, maxConcurrentUsers: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Retention Period (days)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={systemSettings.retentionPeriod}
                      onChange={(e) => setSystemSettings({...systemSettings, retentionPeriod: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Allowed File Types
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    value={systemSettings.allowedFileTypes}
                    onChange={(e) => setSystemSettings({...systemSettings, allowedFileTypes: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-surface-200 dark:border-surface-600"
                      checked={systemSettings.enableCaching}
                      onChange={(e) => setSystemSettings({...systemSettings, enableCaching: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Enable Caching</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-surface-200 dark:border-surface-600"
                      checked={systemSettings.enableCDN}
                      onChange={(e) => setSystemSettings({...systemSettings, enableCDN: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Enable CDN</span>
                  </label>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">Email Configuration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      SMTP Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 pr-10 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      SMTP Encryption
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={emailSettings.smtpEncryption}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpEncryption: e.target.value})}
                    >
                      <option value="none">None</option>
                      <option value="ssl">SSL</option>
                      <option value="tls">TLS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Reply To
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      value={emailSettings.replyTo}
                      onChange={(e) => setEmailSettings({...emailSettings, replyTo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleTestEmail}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Test Email
                  </button>
                </div>
              </div>
            )}

            {/* Backup & Restore */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">Backup & Restore</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Create Backup</h3>
                    <div className="space-y-4">
                      <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                        <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
                          Last backup: 2 days ago
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-surface-200 dark:border-surface-600" defaultChecked />
                            <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Database</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-surface-200 dark:border-surface-600" defaultChecked />
                            <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">User Files</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-surface-200 dark:border-surface-600" defaultChecked />
                            <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Configuration</span>
                          </label>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleBackup}
                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Create Backup
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Restore Backup</h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-surface-200 dark:border-surface-600 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                        <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                          Drop backup file here or click to browse
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          Supported formats: .zip, .sql, .json
                        </p>
                        <button className="mt-4 px-4 py-2 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg text-sm font-medium transition-colors">
                          Browse Files
                        </button>
                      </div>
                      
                      <button
                        onClick={handleRestore}
                        disabled
                        className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-surface-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restore Backup
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Warning
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Restoring from backup will overwrite all current data. This action cannot be undone. 
                        Please ensure you have a current backup before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={handleSaveSettings}
                className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings


