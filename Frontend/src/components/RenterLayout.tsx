import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, Calendar, Settings, LogOut, Menu, X, Heart, Search, Bell, FileText, CreditCard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Loading from './ui/Loading'
import NotificationModal from './NotificationModal'
import { apiFetch } from '../utils/api'
import RenterRoutes from '../pages/renter/RenterRoutes'

interface RenterLayoutProps {
  children?: ReactNode
}

const RenterLayout: React.FC<RenterLayoutProps> = ({ children }) => {
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
    console.log('Renter logout clicked')
    try {
      logout()
      console.log('Logout function called, navigating to home...')
      navigate('/')
      console.log('Navigation to home initiated')
    } catch (error) {
      console.error('Logout error:', error)
      // Force navigation even if there's an error
      navigate('/')
    }
  }

  // Get current tab from URL path
  const getCurrentTab = () => {
    const path = location.pathname
    if (path === '/renter/dashboard' || path === '/renter') return 'dashboard'
    if (path.startsWith('/renter/search')) return 'search'
    if (path.startsWith('/renter/bookings')) return 'bookings'
    if (path.startsWith('/renter/favorites')) return 'favorites'
    if (path.startsWith('/renter/payments')) return 'payments'
    if (path.startsWith('/renter/reviews')) return 'reviews'
    if (path.startsWith('/renter/settings')) return 'settings'
    return 'dashboard'
  }

  const currentTab = getCurrentTab()

  const renterNavItems = [
    {
      name: 'Dashboard',
      href: '/renter/dashboard',
      icon: Home,
      current: currentTab === 'dashboard'
    },
    {
      name: 'Search Properties',
      href: '/renter/search',
      icon: Search,
      current: currentTab === 'search'
    },
    {
      name: 'My Bookings',
      href: '/renter/bookings',
      icon: Calendar,
      current: currentTab === 'bookings'
    },
    {
      name: 'Favorites',
      href: '/renter/favorites',
      icon: Heart,
      current: currentTab === 'favorites'
    },
    {
      name: 'Payments',
      href: '/renter/payments',
      icon: CreditCard,
      current: currentTab === 'payments'
    },
    {
      name: 'Reviews',
      href: '/renter/reviews',
      icon: FileText,
      current: currentTab === 'reviews'
    },
    {
      name: 'Settings',
      href: '/renter/settings',
      icon: Settings,
      current: currentTab === 'settings'
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200 lg:dark:border-gray-700
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 lg:border-b-0 flex-shrink-0">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              Renter Portal
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {renterNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.current
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${item.current ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`} />
                  {item.name}
                  {item.current && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Renter
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content - Scrollable with proper spacing */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top bar - Fixed */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Renter Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Account Active
                </span>
              </div>
              <div className="relative">
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                  onClick={() => setNotificationOpen(true)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-5 text-center shadow-sm">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content - Scrollable */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          {children || <RenterRoutes />}
        </main>
      </div>

      <NotificationModal
        isOpen={notificationOpen}
        onClose={() => {
          setNotificationOpen(false)
          refreshUnreadCount()
        }}
        title="Renter Notifications"
        onNotificationsUpdated={refreshUnreadCount}
      />
    </div>
  )
}

export default RenterLayout
