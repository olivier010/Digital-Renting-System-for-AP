import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, Settings, LogOut, Menu, X, Building, Calendar, DollarSign, Star, Bell, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Loading from './ui/Loading'
import ThemeToggle from './ui/ThemeToggle'
import NotificationModal from './NotificationModal'
import { apiFetch } from '../utils/api'
import OwnerRoutes from '../pages/owner/OwnerRoutes'

interface OwnerLayoutProps {
  children?: ReactNode
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, location.search])

  const refreshUnreadCount = async () => {
    try {
      const res = await apiFetch('/notifications/unread-count')
      setUnreadCount(res.data?.unreadCount || 0)
    } catch {
      setUnreadCount(0)
    }
  }

  useEffect(() => {
    refreshUnreadCount()
  }, [location.pathname])

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/')
    }
  }

  // Get current tab from URL path
  const getCurrentTab = () => {
    const path = location.pathname
    if (path === '/owner/dashboard' || path === '/owner') return 'dashboard'
    if (path.startsWith('/owner/properties')) return 'properties'
    if (path.startsWith('/owner/add-property')) return 'add-property'
    if (path.startsWith('/owner/bookings')) return 'bookings'
    if (path.startsWith('/owner/reviews')) return 'reviews'
    if (path.startsWith('/owner/earnings')) return 'earnings'
    if (path.startsWith('/owner/settings')) return 'settings'
    return 'dashboard'
  }

  const currentTab = getCurrentTab()

  const ownerNavItems = [
    { name: 'Dashboard', href: '/owner/dashboard', icon: Home, current: currentTab === 'dashboard' },
    { name: 'My Properties', href: '/owner/properties', icon: Building, current: currentTab === 'properties' },
    { name: 'Add Property', href: '/owner/add-property', icon: Plus, current: currentTab === 'add-property', accent: true },
    { name: 'Bookings', href: '/owner/bookings', icon: Calendar, current: currentTab === 'bookings' },
    { name: 'Reviews', href: '/owner/reviews', icon: Star, current: currentTab === 'reviews' },
    { name: 'Earnings', href: '/owner/earnings', icon: DollarSign, current: currentTab === 'earnings' },
    { name: 'Settings', href: '/owner/settings', icon: Settings, current: currentTab === 'settings' },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-surface-900/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col
        bg-white dark:bg-surface-900
        border-r border-surface-200 dark:border-surface-800
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white w-9 h-9 rounded-2xl flex items-center justify-center shadow-md">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-surface-900 dark:text-white block leading-tight">
                Owner Portal
              </span>
              <span className="text-[10px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                Property Management
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-2 px-3 overflow-y-auto">
          <div className="space-y-0.5">
            {ownerNavItems.map((item) => {
              const Icon = item.icon
              const isAccent = 'accent' in item && item.accent
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200
                    ${item.current
                      ? isAccent
                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 shadow-sm'
                        : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    item.current
                      ? isAccent ? 'text-accent-600 dark:text-accent-400' : 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300'
                  }`} />
                  <span className="flex-1">{item.name}</span>
                  {item.current && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isAccent ? 'bg-accent-500' : 'bg-primary-500 dark:bg-primary-400'}`}></div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-800 flex-shrink-0 space-y-3">
          <ThemeToggle showLabel className="w-full justify-center" />
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-surface-400 dark:text-surface-500">
                Property Owner
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-2xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px]">
        {/* Top bar */}
        <div className="sticky top-0 z-30 glass-navbar flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-2xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-surface-900 dark:text-white">
                {ownerNavItems.find(n => n.current)?.name || 'Owner Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
              </div>
              <div className="relative">
                <button
                  className="p-2 rounded-2xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors relative"
                  onClick={() => setNotificationOpen(true)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-[18px] text-center shadow-sm animate-scale-in">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children || <OwnerRoutes />}
        </main>
      </div>

      <NotificationModal
        isOpen={notificationOpen}
        onClose={() => {
          setNotificationOpen(false)
          refreshUnreadCount()
        }}
        title="Owner Notifications"
        onNotificationsUpdated={refreshUnreadCount}
      />
    </div>
  )
}

export default OwnerLayout


