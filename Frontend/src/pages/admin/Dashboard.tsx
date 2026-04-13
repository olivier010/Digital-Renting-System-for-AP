
import { useEffect, useState } from 'react'
import { apiFetch } from '../../utils/api'
import { Link } from 'react-router-dom'
import { Users, Home, TrendingUp, DollarSign, AlertCircle, CheckCircle, FileText, BarChart, Settings } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'

const Dashboard = () => {
  // Dashboard state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUsersLastMonth: 0,
    totalProperties: 0,
    totalPropertiesLastMonth: 0,
    totalBookings: 0,
    totalBookingsLastMonth: 0,
    totalRevenue: 0,
    totalRevenueLastMonth: 0,
    averageRating: 0,
    averageRatingLastMonth: 0,
    activeUsers: 0,
    activeUsersLastMonth: 0
  })
  const [systemStatus, setSystemStatus] = useState({
    systemHealth: 0,
    pendingApprovals: 0,
    reportedIssues: 0,
    database: 'UNKNOWN',
    externalApis: {},
    fileStorage: 'UNKNOWN',
    messageQueue: 'UNKNOWN',
    cache: 'UNKNOWN',
    uptime: '',
    errorCount: 0
  })

  // State for system status modal
  const [showAllStatus, setShowAllStatus] = useState(false)
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [systemLogs, setSystemLogs] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const statsRes = await apiFetch('/admin/dashboard')
        setStats(statsRes.data || {})
        const statusRes = await apiFetch('/admin/system-status')
        setSystemStatus(statusRes.data || {})
        const usersRes = await apiFetch('/users?page=0&size=5')
        setRecentUsers(Array.isArray(usersRes.data?.content) ? usersRes.data.content : [])
        const logsRes = await apiFetch('/admin/logs?page=0&size=5')
        setSystemLogs(Array.isArray(logsRes.data) ? logsRes.data : [])
      } catch (err: any) {
        // Optionally handle error
      }
    }
    fetchDashboard()
  }, [])

  // Helper to calculate percent change
  const percentChange = (current: number, last: number) => {
    if (typeof current !== 'number' || typeof last !== 'number' || last === 0) return 0;
    return ((current - last) / last) * 100;
  };

  const statusItems = [
    { label: 'Health', value: `${typeof systemStatus.systemHealth === 'number' ? systemStatus.systemHealth : 0}%`, color: systemStatus.systemHealth >= 90 ? 'text-green-600 dark:text-green-400' : systemStatus.systemHealth >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400', dot: systemStatus.systemHealth >= 90 ? 'bg-green-500' : systemStatus.systemHealth >= 70 ? 'bg-amber-500' : 'bg-red-500' },
    { label: 'Database', value: systemStatus.database, color: systemStatus.database === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400', dot: systemStatus.database === 'UP' ? 'bg-green-500' : 'bg-red-500' },
    { label: 'File Storage', value: systemStatus.fileStorage, color: systemStatus.fileStorage === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400', dot: systemStatus.fileStorage === 'UP' ? 'bg-green-500' : 'bg-red-500' },
    { label: 'Message Queue', value: systemStatus.messageQueue, color: systemStatus.messageQueue === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400', dot: systemStatus.messageQueue === 'UP' ? 'bg-green-500' : 'bg-red-500' },
    { label: 'Cache', value: systemStatus.cache, color: systemStatus.cache === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400', dot: systemStatus.cache === 'UP' ? 'bg-green-500' : 'bg-red-500' },
    { label: 'Uptime', value: systemStatus.uptime || '-', color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    { label: 'Pending', value: `${typeof systemStatus.pendingApprovals === 'number' ? systemStatus.pendingApprovals : 0}`, color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    { label: 'Errors', value: `${typeof systemStatus.errorCount === 'number' ? systemStatus.errorCount : 0}`, color: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage your rental platform"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            label="Total Users"
            value={typeof stats.totalUsers === 'number' ? stats.totalUsers.toLocaleString() : '0'}
            icon={<Users className="w-6 h-6" />}
            trend={percentChange(stats.totalUsers, stats.totalUsersLastMonth)}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            label="Total Properties"
            value={typeof stats.totalProperties === 'number' ? stats.totalProperties.toLocaleString() : '0'}
            icon={<Home className="w-6 h-6" />}
            trend={percentChange(stats.totalProperties, stats.totalPropertiesLastMonth)}
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            label="Total Revenue"
            value={`$${typeof stats.totalRevenue === 'number' ? (stats.totalRevenue / 1000000).toFixed(1) : '0.0'}M`}
            icon={<DollarSign className="w-6 h-6" />}
            trend={percentChange(stats.totalRevenue, stats.totalRevenueLastMonth)}
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            label="Active Users"
            value={typeof stats.activeUsers === 'number' ? stats.activeUsers.toLocaleString() : '0'}
            icon={<TrendingUp className="w-6 h-6" />}
            trend={percentChange(stats.activeUsers, stats.activeUsersLastMonth)}
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 card-elevated p-6 animate-fade-in-up stagger-5">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Manage Users', href: '/admin/users', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' },
              { name: 'Properties', href: '/admin/properties', icon: Home, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' },
              { name: 'Reports', href: '/admin/reports', icon: BarChart, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30' },
              { name: 'Settings', href: '/admin/settings', icon: Settings, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.name} to={action.href} className={`flex flex-col items-center p-4 rounded-2xl ${action.bg} transition-all duration-200 group`}>
                  <Icon className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform duration-200`} />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{action.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="card-elevated p-6 animate-fade-in-up stagger-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">System Status</h3>
            <button
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              onClick={() => setShowAllStatus(true)}
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {statusItems.slice(0, 5).map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for full system status */}
        {showAllStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-surface-900/50 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowAllStatus(false)} />
            <div className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-soft-xl dark:shadow-dark-xl p-6 sm:p-8 w-full max-w-lg animate-scale-in border border-surface-200 dark:border-surface-700">
              <button
                className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                onClick={() => setShowAllStatus(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6">System Status — Full Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statusItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-2xl bg-surface-50 dark:bg-surface-700/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                      <span className="text-sm text-surface-600 dark:text-surface-400">{item.label}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-8">
        {/* Recent Users */}
        <div className="card-elevated overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Users</h3>
            <Link to="/admin/users" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              View all
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {recentUsers.slice(0, 4).map((user) => {
              const status = user.isActive ? 'Active' : 'Pending';
              return (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-white">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-surface-400 dark:text-surface-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      {status}
                    </span>
                    <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-1">
                      {user.joinedAt ? (typeof user.joinedAt === 'string' ? user.joinedAt : new Date(user.joinedAt).toLocaleDateString()) : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Logs */}
        <div className="card-elevated overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">System Logs</h3>
            <Link to="/admin/reports" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="notification-marquee-viewport">
              <div className="notification-marquee-track">
                {(() => {
                  const logs = [...systemLogs]
                    .filter(log => log.level !== 'WARN' && log.level !== 'WARNING')
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                  return [...logs, ...logs].map((log, idx) => (
                    <div key={log.id + '-' + idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                      <div className="mt-0.5">
                        {log.level === 'ERROR' && <AlertCircle className="w-4 h-4 text-red-500" />}
                        {log.level === 'INFO' && <FileText className="w-4 h-4 text-blue-500" />}
                        {log.level === 'DEBUG' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-surface-800 dark:text-surface-200 truncate">{log.message}</p>
                          <span className={`flex-shrink-0 inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            log.level === 'ERROR'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : log.level === 'INFO'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {log.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5">{log.timestamp}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


