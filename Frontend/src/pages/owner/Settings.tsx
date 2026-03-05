import { useState } from 'react'
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Save, 
  Eye, 
  EyeOff, 
  Camera, 
  Trash2, 
  Building
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Doe Properties LLC',
    bio: 'Experienced property owner with 5+ years in the rental business. Focused on providing exceptional guest experiences.',
    address: '123 Business Ave, Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    website: 'www.doeproperties.com',
    taxId: '12-3456789'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newBooking: true,
    bookingCancellation: true,
    guestMessage: true,
    reviewReceived: true,
    paymentReceived: true,
    maintenanceRequest: true,
    marketingEmails: false,
    smsNotifications: true,
    pushNotifications: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowGuestContact: true,
    twoFactorAuth: false,
    loginAlerts: true,
    dataSharing: false,
    analyticsTracking: true
  })

  const [paymentSettings, setPaymentSettings] = useState({
    defaultPaymentMethod: 'bank',
    autoPayout: true,
    payoutFrequency: 'weekly',
    minimumPayout: 100,
    currency: 'USD',
    taxWithholding: 15,
    invoiceRequired: false
  })

  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'Doe Properties LLC',
    businessType: 'llc',
    registrationNumber: 'LLC-2023-001234',
    businessLicense: 'BL-2023-NYC-5678',
    insuranceProvider: 'State Farm Insurance',
    policyNumber: 'SF-123456789',
    coverageAmount: 1000000,
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    checkInInstructions: 'Check-in is at 3:00 PM. Key code will be sent 24 hours before arrival. Please contact me if you need early check-in.',
    houseRules: 'No smoking, No parties, Quiet hours after 10 PM, No pets unless approved',
    cancellationPolicy: 'moderate'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData)
    // API call to save profile
  }

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notificationSettings)
    // API call to save notification settings
  }

  const handleSavePrivacy = () => {
    console.log('Saving privacy:', privacySettings)
    // API call to save privacy settings
  }

  const handleChangePassword = () => {
    console.log('Changing password:', passwordData)
    // API call to change password
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'payment', label: 'Payment Settings', icon: CreditCard },
    { id: 'business', label: 'Business Settings', icon: Building }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
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
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
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
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </span>
                </div>
                <div>
                  <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4 mb-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell guests about yourself and your properties..."
                />
              </div>

              {/* Address */}
              <div className="space-y-4 mb-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profileData.state}
                      onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profileData.country}
                      onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Booking Notifications</h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {key === 'newBooking' && 'Get notified when you receive a new booking request'}
                            {key === 'bookingCancellation' && 'Get notified when a guest cancels their booking'}
                            {key === 'guestMessage' && 'Get notified when a guest sends you a message'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({...notificationSettings, [key]: !value})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Payment Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Payment Received</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you receive a payment</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, paymentReceived: !notificationSettings.paymentReceived})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings.paymentReceived ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.paymentReceived ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Notification Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, marketingEmails: !notificationSettings.marketingEmails})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings.marketingEmails ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via text message</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings.smsNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings.pushNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveNotifications}
                  className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
                  <div className="space-y-3">
                    {Object.entries(privacySettings).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {key === 'profileVisibility' && 'Control who can see your profile'}
                            {key === 'showEmail' && 'Display your email address on your public profile'}
                            {key === 'showPhone' && 'Display your phone number on your public profile'}
                            {key === 'allowGuestContact' && 'Allow guests to contact you directly'}
                          </p>
                        </div>
                        {key === 'profileVisibility' ? (
                          <select
                            value={value as string}
                            onChange={(e) => setPrivacySettings({...privacySettings, [key]: e.target.value})}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="public">Public</option>
                            <option value="guests">Guests Only</option>
                            <option value="private">Private</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => setPrivacySettings({...privacySettings, [key]: !value})}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, twoFactorAuth: !privacySettings.twoFactorAuth})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.twoFactorAuth ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Login Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when someone logs into your account</p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, loginAlerts: !privacySettings.loginAlerts})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.loginAlerts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Data & Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Data Sharing</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Share your data with trusted partners for better service</p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, dataSharing: !privacySettings.dataSharing})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.dataSharing ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Analytics Tracking</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve by sharing usage analytics</p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, analyticsTracking: !privacySettings.analyticsTracking})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacySettings.analyticsTracking ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacySettings.analyticsTracking ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSavePrivacy}
                    className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Payout Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Payment Method
                      </label>
                      <select
                        value={paymentSettings.defaultPaymentMethod}
                        onChange={(e) => setPaymentSettings({...paymentSettings, defaultPaymentMethod: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="bank">Bank Account</option>
                        <option value="paypal">PayPal</option>
                        <option value="wise">Wise</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto Payout</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically transfer earnings to your account</p>
                      </div>
                      <button
                        onClick={() => setPaymentSettings({...paymentSettings, autoPayout: !paymentSettings.autoPayout})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          paymentSettings.autoPayout ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          paymentSettings.autoPayout ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payout Frequency
                      </label>
                      <select
                        value={paymentSettings.payoutFrequency}
                        onChange={(e) => setPaymentSettings({...paymentSettings, payoutFrequency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Payout Amount
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={paymentSettings.minimumPayout}
                        onChange={(e) => setPaymentSettings({...paymentSettings, minimumPayout: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Currency & Taxes</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={paymentSettings.currency}
                        onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tax Withholding (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={paymentSettings.taxWithholding}
                        onChange={(e) => setPaymentSettings({...paymentSettings, taxWithholding: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Invoice Required</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Require invoices for all payouts</p>
                      </div>
                      <button
                        onClick={() => setPaymentSettings({...paymentSettings, invoiceRequired: !paymentSettings.invoiceRequired})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          paymentSettings.invoiceRequired ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          paymentSettings.invoiceRequired ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Business Settings */}
          {activeTab === 'business' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Business Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.businessName}
                        onChange={(e) => setBusinessSettings({...businessSettings, businessName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Type
                      </label>
                      <select
                        value={businessSettings.businessType}
                        onChange={(e) => setBusinessSettings({...businessSettings, businessType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="sole">Sole Proprietorship</option>
                        <option value="llc">LLC</option>
                        <option value="corporation">Corporation</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.registrationNumber}
                        onChange={(e) => setBusinessSettings({...businessSettings, registrationNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business License
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.businessLicense}
                        onChange={(e) => setBusinessSettings({...businessSettings, businessLicense: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.insuranceProvider}
                        onChange={(e) => setBusinessSettings({...businessSettings, insuranceProvider: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Policy Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.policyNumber}
                        onChange={(e) => setBusinessSettings({...businessSettings, policyNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Coverage Amount
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.coverageAmount}
                        onChange={(e) => setBusinessSettings({...businessSettings, coverageAmount: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.emergencyContact}
                        onChange={(e) => setBusinessSettings({...businessSettings, emergencyContact: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Guest Instructions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-in Instructions
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.checkInInstructions}
                        onChange={(e) => setBusinessSettings({...businessSettings, checkInInstructions: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        House Rules
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={businessSettings.houseRules}
                        onChange={(e) => setBusinessSettings({...businessSettings, houseRules: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cancellation Policy
                      </label>
                      <select
                        value={businessSettings.cancellationPolicy}
                        onChange={(e) => setBusinessSettings({...businessSettings, cancellationPolicy: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="flexible">Flexible</option>
                        <option value="moderate">Moderate</option>
                        <option value="strict">Strict</option>
                        <option value="super_strict">Super Strict</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
