import { useEffect, useMemo, useState } from 'react'
import { User, Mail, Phone, Lock, CreditCard, Globe, Save, Eye, EyeOff, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { apiFetch } from '../../utils/api'
import { useTheme } from '../../contexts/ThemeContext'
import UserDataReportDownloadButton from '../../components/reports/UserDataReportDownloadButton'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PaymentMethod {
  id: number
  brand: string
  last4: string
  expiryMonth: string
  expiryYear: string
  cardHolderName?: string | null
  isDefault: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

const Settings = () => {
  const { user, updateUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const isDarkMode = theme === 'dark'

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [newCard, setNewCard] = useState({
    brand: 'VISA',
    last4: '',
    expiryMonth: '',
    expiryYear: '',
    cardHolderName: ''
  })

  const tabs = useMemo(
    () => [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'security', label: 'Security', icon: Lock },
      { id: 'payment', label: 'Payment Methods', icon: CreditCard },
      { id: 'preferences', label: 'Preferences', icon: Globe }
    ],
    []
  )

  useEffect(() => {
    const loadProfile = async () => {
      setIsProfileLoading(true)
      setFeedback(null)

      try {
        const response = await apiFetch('/auth/me')
        const profile = response?.data ?? {}

        setProfileData({
          firstName: profile.firstName ?? user?.firstName ?? '',
          lastName: profile.lastName ?? user?.lastName ?? '',
          email: profile.email ?? user?.email ?? '',
          phone: profile.phone ?? user?.phone ?? ''
        })
      } catch (error) {
        setProfileData({
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          email: user?.email ?? '',
          phone: user?.phone ?? ''
        })
        setFeedback({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to load profile data'
        })
      } finally {
        setIsProfileLoading(false)
      }
    }

    void loadProfile()
  }, [user])

  useEffect(() => {
    const loadPaymentMethods = async () => {
      setIsLoadingPaymentMethods(true)
      try {
        const response = await apiFetch('/payment-methods')
        const methods = (response?.data ?? []) as PaymentMethod[]
        setPaymentMethods(Array.isArray(methods) ? methods : [])
      } catch (error) {
        setFeedback({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to load payment methods'
        })
        setPaymentMethods([])
      } finally {
        setIsLoadingPaymentMethods(false)
      }
    }

    void loadPaymentMethods()
  }, [])

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    setFeedback(null)

    try {
      const response = await apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone
        })
      })

      const updatedUser = response?.data
      if (updatedUser) {
        updateUser({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone
        })

        setProfileData(prev => ({
          ...prev,
          firstName: updatedUser.firstName ?? prev.firstName,
          lastName: updatedUser.lastName ?? prev.lastName,
          email: updatedUser.email ?? prev.email,
          phone: updatedUser.phone ?? prev.phone
        }))
      }

      setFeedback({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile'
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    setFeedback(null)

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setFeedback({ type: 'error', message: 'All password fields are required.' })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirm password do not match.' })
      return
    }

    setIsChangingPassword(true)
    try {
      await apiFetch('/auth/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      })

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setFeedback({ type: 'success', message: 'Password changed successfully.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to change password'
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleAddCard = async () => {
    if (!newCard.last4 || newCard.last4.length !== 4 || !newCard.expiryMonth || !newCard.expiryYear) {
      setFeedback({ type: 'error', message: 'Enter valid card details (last 4 digits and expiry).' })
      return
    }

    const cleanLast4 = newCard.last4.replace(/\D/g, '').slice(-4)
    if (cleanLast4.length !== 4) {
      setFeedback({ type: 'error', message: 'Card last 4 digits must be numeric.' })
      return
    }

    setIsAddingCard(true)
    try {
      const response = await apiFetch('/payment-methods', {
        method: 'POST',
        body: JSON.stringify({
          brand: newCard.brand,
          last4: cleanLast4,
          expiryMonth: newCard.expiryMonth,
          expiryYear: newCard.expiryYear,
          cardHolderName: newCard.cardHolderName || null,
          isDefault: paymentMethods.length === 0
        })
      })

      const created = response?.data as PaymentMethod | undefined
      if (created) {
        setPaymentMethods(prev => [...prev.filter(card => !created.isDefault || !card.isDefault), created])
      }
      setNewCard({ brand: 'VISA', last4: '', expiryMonth: '', expiryYear: '', cardHolderName: '' })
      setShowAddCardForm(false)
      setFeedback({ type: 'success', message: 'Payment method added.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to add payment method'
      })
    } finally {
      setIsAddingCard(false)
    }
  }

  const handleDeleteCard = async (id: number) => {
    try {
      await apiFetch(`/payment-methods/${id}`, { method: 'DELETE' })
      setPaymentMethods(prev => {
        const next = prev.filter(card => card.id !== id)
        if (next.length > 0 && !next.some(card => card.isDefault)) {
          next[0] = { ...next[0], isDefault: true }
        }
        return next
      })
      setFeedback({ type: 'success', message: 'Payment method removed.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to remove payment method'
      })
    }
  }

  const handleSetDefaultCard = async (id: number) => {
    try {
      await apiFetch(`/payment-methods/${id}/default`, { method: 'PATCH' })
      setPaymentMethods(prev =>
        prev.map(card => ({
          ...card,
          isDefault: card.id === id
        }))
      )
      setFeedback({ type: 'success', message: 'Default payment method updated.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update default payment method'
      })
    }
  }

  const openDeleteModal = () => {
    setDeletePassword('')
    setShowDeletePassword(false)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    if (isDeletingAccount) {
      return
    }
    setShowDeleteModal(false)
    setDeletePassword('')
    setShowDeletePassword(false)
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setFeedback({ type: 'error', message: 'Current password is required to delete your account.' })
      return
    }

    setIsDeletingAccount(true)
    setFeedback(null)
    try {
      await apiFetch('/auth/me', {
        method: 'DELETE',
        body: JSON.stringify({ currentPassword: deletePassword })
      })

      logout()
      window.location.href = '/'
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete your account'
      })
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/20 dark:text-green-200'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
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
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>

                {isProfileLoading ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            readOnly
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            value={profileData.email}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSavingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
                  <button
                    onClick={() => setShowAddCardForm(!showAddCardForm)}
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
                  >
                    {showAddCardForm ? 'Cancel' : 'Add New Card'}
                  </button>
                </div>

                {showAddCardForm && (
                  <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <select
                        value={newCard.brand}
                        onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="VISA">Visa</option>
                        <option value="MASTERCARD">Mastercard</option>
                        <option value="AMEX">Amex</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Last 4"
                        maxLength={4}
                        value={newCard.last4}
                        onChange={(e) => setNewCard({ ...newCard, last4: e.target.value.replace(/\D/g, '') })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="MM"
                        maxLength={2}
                        value={newCard.expiryMonth}
                        onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value.replace(/\D/g, '') })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="YYYY"
                        maxLength={4}
                        value={newCard.expiryYear}
                        onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value.replace(/\D/g, '') })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input
                        type="text"
                        placeholder="Cardholder Name (Optional)"
                        value={newCard.cardHolderName}
                        onChange={(e) => setNewCard({ ...newCard, cardHolderName: e.target.value })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddCard}
                        disabled={isAddingCard}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                      >
                        {isAddingCard ? 'Saving...' : 'Save Card'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {isLoadingPaymentMethods ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading payment methods...</p>
                  ) : paymentMethods.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No payment methods saved yet.</p>
                  ) : (
                    paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">💳</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{method.brand} •••• {method.last4}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Expires {method.expiryMonth}/{method.expiryYear}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">Default</span>
                          ) : (
                            <button
                              onClick={() => handleSetDefaultCard(method.id)}
                              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCard(method.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preferences</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme across the platform</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Data Management</h2>

                <div className="space-y-4">
                  <UserDataReportDownloadButton
                    onSuccess={(message: string) => setFeedback({ type: 'success', message })}
                    onError={(message: string) => setFeedback({ type: 'error', message })}
                  />

                  <button
                    onClick={openDeleteModal}
                    disabled={isDeletingAccount}
                    className="w-full flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed dark:hover:bg-red-900/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <div className="text-left">
                        <p className="font-medium text-red-600 dark:text-red-400">{isDeletingAccount ? 'Deleting Account...' : 'Delete Account'}</p>
                        <p className="text-sm text-red-500 dark:text-red-400">Permanently delete your account and all data</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account Permanently</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              This action cannot be undone. Please enter your current password to confirm account deletion.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <div className="relative">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeletingAccount}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
