import { useState } from 'react'
import {
  Save, Eye, EyeOff, Bell, Moon, Sun, Lock, HelpCircle, User,
  Shield, Monitor, Camera, Mail, Phone, MessageSquare,
  ExternalLink, ChevronRight, Check, Palette, Globe, LogOut
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import PageHeader from '../../components/ui/PageHeader'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()

  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@digitalrenting.com',
    phone: '+27 12 345 6789',
    avatar: ''
  })

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailPayments: true,
    emailSystem: false,
    smsBookings: false,
    smsPayments: true,
    pushAll: true,
    pushBookings: true,
    pushMessages: true,
    digestFrequency: 'daily'
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true
  })

  const [appearance, setAppearance] = useState({
    accentColor: 'blue',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Africa/Johannesburg'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal info & avatar' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts & preferences' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme & display' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & 2FA' },
    { id: 'support', label: 'Help & Support', icon: HelpCircle, description: 'Get assistance' }
  ]

  const accentColors = [
    { id: 'blue', color: 'bg-blue-500', label: 'Ocean Blue' },
    { id: 'purple', color: 'bg-purple-500', label: 'Royal Purple' },
    { id: 'emerald', color: 'bg-emerald-500', label: 'Emerald' },
    { id: 'rose', color: 'bg-rose-500', label: 'Rose' },
    { id: 'amber', color: 'bg-amber-500', label: 'Amber' },
    { id: 'cyan', color: 'bg-cyan-500', label: 'Cyan' }
  ]

  const handleSaveSettings = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, label: '', color: '' }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    if (password.length >= 12) strength++

    if (strength <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-500' }
    if (strength <= 3) return { level: 3, label: 'Good', color: 'bg-blue-500' }
    return { level: 4, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(security.newPassword)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your account, preferences, and security"
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Navigation — horizontal scroll on mobile, vertical on lg+ */}
        <aside className="lg:w-72 flex-shrink-0">
          {/* Mobile: horizontal scrollable tabs */}
          <nav className="lg:hidden card-elevated p-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    id={`settings-tab-mobile-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 text-sm font-semibold ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Desktop: vertical sidebar */}
          <nav className="hidden lg:block card-elevated p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  id={`settings-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 hover:text-surface-900 dark:hover:text-surface-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-800/30'
                      : 'bg-surface-100 dark:bg-surface-700 group-hover:bg-surface-200 dark:group-hover:bg-surface-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{tab.label}</p>
                    <p className={`text-xs truncate ${
                      activeTab === tab.id
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-surface-400 dark:text-surface-500'
                    }`}>{tab.description}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    activeTab === tab.id ? 'text-primary-500' : 'text-surface-300 dark:text-surface-600'
                  }`} />
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 min-w-0">
          <div className="card-elevated">
            {/* ===== PROFILE TAB ===== */}
            {activeTab === 'profile' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in-up">
                {/* Section Header */}
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">Profile Information</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Update your personal details and public profile
                  </p>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl bg-surface-50 dark:bg-surface-700/30 border border-surface-200/60 dark:border-surface-700/50 text-center sm:text-left">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </span>
                    </div>
                    <button className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{profile.email}</p>
                    <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      <Shield className="w-3 h-3" />
                      Administrator
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      First Name
                    </label>
                    <input
                      id="settings-first-name"
                      type="text"
                      className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                      value={profile.firstName}
                      onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Last Name
                    </label>
                    <input
                      id="settings-last-name"
                      type="text"
                      className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                      value={profile.lastName}
                      onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                      <input
                        id="settings-email"
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                      <input
                        id="settings-phone"
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                        value={profile.phone}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ===== NOTIFICATIONS TAB ===== */}
            {activeTab === 'notifications' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in-up">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">Notification Preferences</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Choose how and when you want to be notified
                  </p>
                </div>

                {/* Email Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-surface-500" />
                    <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Email Notifications</h3>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                    {[
                      { key: 'emailBookings' as const, label: 'Booking Updates', desc: 'New bookings, cancellations, and modifications' },
                      { key: 'emailPayments' as const, label: 'Payment Alerts', desc: 'Payment confirmations and refund notifications' },
                      { key: 'emailSystem' as const, label: 'System Alerts', desc: 'Server status, maintenance, and security updates' }
                    ].map((item, idx) => (
                      <div key={item.key} className={`flex items-center justify-between px-5 py-4 ${idx < 2 ? 'border-b border-surface-100 dark:border-surface-700/50' : ''} hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors`}>
                        <div>
                          <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.label}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          id={`settings-notif-${item.key}`}
                          onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-surface-800 ${
                            notifications[item.key] ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-surface-500" />
                    <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">SMS Notifications</h3>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                    {[
                      { key: 'smsBookings' as const, label: 'Booking SMS', desc: 'Receive SMS for booking activity' },
                      { key: 'smsPayments' as const, label: 'Payment SMS', desc: 'Receive SMS for payment activity' }
                    ].map((item, idx) => (
                      <div key={item.key} className={`flex items-center justify-between px-5 py-4 ${idx < 1 ? 'border-b border-surface-100 dark:border-surface-700/50' : ''} hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors`}>
                        <div>
                          <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.label}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          id={`settings-notif-${item.key}`}
                          onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-surface-800 ${
                            notifications[item.key] ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-4 h-4 text-surface-500" />
                    <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Push Notifications</h3>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                    {[
                      { key: 'pushAll' as const, label: 'Enable Push Notifications', desc: 'Master toggle for all push notifications' },
                      { key: 'pushBookings' as const, label: 'Booking Alerts', desc: 'Instant alerts for booking activity' },
                      { key: 'pushMessages' as const, label: 'Message Alerts', desc: 'Notifications for new messages' }
                    ].map((item, idx) => (
                      <div key={item.key} className={`flex items-center justify-between px-5 py-4 ${idx < 2 ? 'border-b border-surface-100 dark:border-surface-700/50' : ''} hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors`}>
                        <div>
                          <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.label}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          id={`settings-notif-${item.key}`}
                          onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-surface-800 ${
                            notifications[item.key] ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digest Frequency */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Email Digest Frequency
                  </label>
                  <select
                    id="settings-digest-frequency"
                    className="w-full max-w-xs px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                    value={notifications.digestFrequency}
                    onChange={e => setNotifications(n => ({ ...n, digestFrequency: e.target.value }))}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            )}

            {/* ===== APPEARANCE TAB ===== */}
            {activeTab === 'appearance' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in-up">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Customize the look and feel of your dashboard
                  </p>
                </div>

                {/* Theme Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Theme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Light Theme Card */}
                    <button
                      id="settings-theme-light"
                      onClick={() => { if (theme === 'dark') toggleTheme() }}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                        theme === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-700/50'
                      }`}
                    >
                      {theme === 'light' && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="w-full h-20 rounded-xl bg-white border border-surface-200 mb-3 p-2 space-y-1.5">
                        <div className="h-2 w-16 bg-surface-200 rounded-full"></div>
                        <div className="h-2 w-12 bg-surface-100 rounded-full"></div>
                        <div className="h-2 w-20 bg-primary-100 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">Light</span>
                      </div>
                    </button>

                    {/* Dark Theme Card */}
                    <button
                      id="settings-theme-dark"
                      onClick={() => { if (theme === 'light') toggleTheme() }}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-700/50'
                      }`}
                    >
                      {theme === 'dark' && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="w-full h-20 rounded-xl bg-surface-800 border border-surface-700 mb-3 p-2 space-y-1.5">
                        <div className="h-2 w-16 bg-surface-600 rounded-full"></div>
                        <div className="h-2 w-12 bg-surface-700 rounded-full"></div>
                        <div className="h-2 w-20 bg-primary-800 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">Dark</span>
                      </div>
                    </button>

                    {/* System Theme Card */}
                    <button
                      id="settings-theme-system"
                      className="relative p-4 rounded-2xl border-2 border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-700/50 transition-all duration-200 text-left group opacity-60 cursor-not-allowed"
                      disabled
                    >
                      <div className="w-full h-20 rounded-xl overflow-hidden mb-3 flex border border-surface-200 dark:border-surface-700">
                        <div className="w-1/2 bg-white p-2 space-y-1.5">
                          <div className="h-2 w-8 bg-surface-200 rounded-full"></div>
                          <div className="h-2 w-6 bg-surface-100 rounded-full"></div>
                        </div>
                        <div className="w-1/2 bg-surface-800 p-2 space-y-1.5">
                          <div className="h-2 w-8 bg-surface-600 rounded-full"></div>
                          <div className="h-2 w-6 bg-surface-700 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-surface-400" />
                        <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">System</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-600 text-surface-500 dark:text-surface-400 font-medium">Soon</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Accent Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {accentColors.map((c) => (
                      <button
                        key={c.id}
                        id={`settings-accent-${c.id}`}
                        onClick={() => setAppearance(a => ({ ...a, accentColor: c.id }))}
                        className={`relative w-10 h-10 rounded-xl ${c.color} transition-all duration-200 hover:scale-110 ${
                          appearance.accentColor === c.id ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-surface-800 ring-primary-500 scale-110' : 'ring-0'
                        }`}
                        title={c.label}
                      >
                        {appearance.accentColor === c.id && (
                          <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Regional</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        <Globe className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                        Language
                      </label>
                      <select
                        id="settings-language"
                        className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                        value={appearance.language}
                        onChange={e => setAppearance(a => ({ ...a, language: e.target.value }))}
                      >
                        <option value="en">English</option>
                        <option value="af">Afrikaans</option>
                        <option value="zu">isiZulu</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Date Format
                      </label>
                      <select
                        id="settings-date-format"
                        className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                        value={appearance.dateFormat}
                        onChange={e => setAppearance(a => ({ ...a, dateFormat: e.target.value }))}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECURITY TAB ===== */}
            {activeTab === 'security' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in-up">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">Security</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Manage your password, two-factor authentication, and session settings
                  </p>
                </div>

                {/* Change Password */}
                <div className="space-y-5 p-5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-700/20">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-surface-500" />
                    <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Change Password</h3>
                  </div>

                  <div className="space-y-4 max-w-lg">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          id="settings-current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3 pr-12 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                          value={security.currentPassword}
                          onChange={e => setSecurity(s => ({ ...s, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200">
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          id="settings-new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3 pr-12 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                          value={security.newPassword}
                          onChange={e => setSecurity(s => ({ ...s, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200">
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Password Strength Indicator */}
                      {security.newPassword && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.level ? passwordStrength.color : 'bg-surface-200 dark:bg-surface-700'
                              }`} />
                            ))}
                          </div>
                          <p className={`text-xs font-medium ${
                            passwordStrength.level <= 1 ? 'text-red-500' :
                            passwordStrength.level <= 2 ? 'text-amber-500' :
                            passwordStrength.level <= 3 ? 'text-blue-500' : 'text-green-500'
                          }`}>
                            Password strength: {passwordStrength.label}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          id="settings-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition ${
                            security.confirmPassword && security.confirmPassword !== security.newPassword
                              ? 'border-red-400 dark:border-red-500'
                              : security.confirmPassword && security.confirmPassword === security.newPassword
                              ? 'border-green-400 dark:border-green-500'
                              : 'border-surface-200 dark:border-surface-600'
                          }`}
                          value={security.confirmPassword}
                          onChange={e => setSecurity(s => ({ ...s, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {security.confirmPassword && security.confirmPassword !== security.newPassword && (
                        <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
                      )}
                      {security.confirmPassword && security.confirmPassword === security.newPassword && security.newPassword && (
                        <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="space-y-4 p-5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-700/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Two-Factor Authentication</h3>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button
                      id="settings-2fa-toggle"
                      onClick={() => setSecurity(s => ({ ...s, twoFactorAuth: !s.twoFactorAuth }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-surface-800 ${
                        security.twoFactorAuth ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  {security.twoFactorAuth && (
                    <div className="ml-12 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                      <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Two-factor authentication is enabled. You'll be asked for a verification code on each login.
                      </p>
                    </div>
                  )}
                </div>

                {/* Session & Login */}
                <div className="space-y-4 p-5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-700/20">
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-surface-500" />
                    <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Session Management</h3>
                  </div>

                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Auto Logout After Inactivity</label>
                      <select
                        id="settings-session-timeout"
                        className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                        value={security.sessionTimeout}
                        onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))}
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="never">Never</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Login Alerts</p>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">Get notified when someone logs into your account</p>
                      </div>
                      <button
                        id="settings-login-alerts"
                        onClick={() => setSecurity(s => ({ ...s, loginAlerts: !s.loginAlerts }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-surface-800 ${
                          security.loginAlerts ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                          security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== SUPPORT TAB ===== */}
            {activeTab === 'support' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in-up">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">Help & Support</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    Get help with your account or report issues
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Documentation */}
                  <a href="#" className="group p-5 rounded-2xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 bg-surface-50/50 dark:bg-surface-700/20 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">Documentation</h3>
                    <p className="text-xs text-surface-400 dark:text-surface-500">Browse guides, tutorials, and API documentation</p>
                  </a>

                  {/* Contact Support */}
                  <a href="mailto:support@digitalrenting.com" className="group p-5 rounded-2xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 bg-surface-50/50 dark:bg-surface-700/20 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">Contact Support</h3>
                    <p className="text-xs text-surface-400 dark:text-surface-500">Email us at support@digitalrenting.com</p>
                  </a>

                  {/* Report a Bug */}
                  <a href="#" className="group p-5 rounded-2xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 bg-surface-50/50 dark:bg-surface-700/20 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">Report a Bug</h3>
                    <p className="text-xs text-surface-400 dark:text-surface-500">Found an issue? Let us know so we can fix it</p>
                  </a>

                  {/* Feature Request */}
                  <a href="#" className="group p-5 rounded-2xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 bg-surface-50/50 dark:bg-surface-700/20 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">Feature Request</h3>
                    <p className="text-xs text-surface-400 dark:text-surface-500">Suggest new features or improvements</p>
                  </a>
                </div>

                {/* System Info */}
                <div className="p-4 rounded-xl bg-surface-100 dark:bg-surface-700/30 border border-surface-200/60 dark:border-surface-700/50">
                  <p className="text-xs text-surface-400 dark:text-surface-500">
                    <span className="font-medium text-surface-600 dark:text-surface-300">Digital Renting System</span> · Version 2.1.0 · © 2026 All rights reserved
                  </p>
                </div>
              </div>
            )}

            {/* ===== SAVE BUTTON (all tabs) ===== */}
            <div className="px-6 md:px-8 py-5 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <div>
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 animate-fade-in-up">
                    <Check className="w-4 h-4" />
                    Settings saved successfully
                  </span>
                )}
              </div>
              <button
                id="settings-save-btn"
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings
