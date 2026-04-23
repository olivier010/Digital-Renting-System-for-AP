import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, Settings as SettingsIcon, LogOut, Menu, X, Home, Users, Building, FileText, BarChart, Bell, Megaphone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Loading from './ui/Loading'
import ThemeToggle from './ui/ThemeToggle'
import NotificationModal from './NotificationModal'
import { apiFetch } from '../utils/api'
import AdminRoutes from '../pages/admin/AdminRoutes'

interface AdminLayoutProps {
  children?: ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
      const res = await apiFetch('/api/notifications/unread-count')
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
      navigate('/shared/home')
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }, 1000)
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/'
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, current: location.pathname === '/admin' || location.pathname === '/admin/dashboard' },
    { name: 'Users', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
    { name: 'Properties', href: '/admin/properties', icon: Building, current: location.pathname === '/admin/properties' },
    { name: 'Bookings', href: '/admin/bookings', icon: FileText, current: location.pathname === '/admin/bookings' },
    { name: 'Reports', href: '/admin/reports', icon: BarChart, current: location.pathname === '/admin/reports' },
    { name: 'Notifications', href: '/admin/notifications', icon: Megaphone, current: location.pathname === '/admin/notifications' },
    { name: 'Settings', href: '/admin/settings', icon: SettingsIcon, current: location.pathname === '/admin/settings' },
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
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white w-9 h-9 rounded-2xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-surface-900 dark:text-white block leading-tight">
                Admin Panel
              </span>
              <span className="text-[10px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                Management
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
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200
                    ${item.current
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    item.current 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300'
                  }`} />
                  <span className="flex-1">{item.name}</span>
                  {item.current && (
                    <div className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></div>
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
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-surface-400 dark:text-surface-500 truncate">
                {user.email}
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
                {navigation.find(n => n.current)?.name || 'Admin Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
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
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors px-3 py-2 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children || <AdminRoutes />}
        </main>
      </div>

      <NotificationModal
        isOpen={notificationOpen}
        onClose={() => {
          setNotificationOpen(false)
          refreshUnreadCount()
        }}
        title="Admin Notifications"
        onNotificationsUpdated={refreshUnreadCount}
      />
    </div>
  )
}

export default AdminLayout


