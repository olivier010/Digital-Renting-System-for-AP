
import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import { Link } from 'react-router-dom'
import { Users, Home, TrendingUp, DollarSign, AlertCircle, CheckCircle, FileText, BarChart, Settings } from 'lucide-react'

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
  // Removed unused loading and error state

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch stats
        const statsRes = await apiFetch('/admin/dashboard')
        setStats(statsRes.data || {})
        // Fetch system status
        const statusRes = await apiFetch('/admin/system-status')
        setSystemStatus(statusRes.data || {})
        // Fetch recent users
        const usersRes = await apiFetch('/users?page=0&size=5')
        setRecentUsers(Array.isArray(usersRes.data?.content) ? usersRes.data.content : [])
        // Fetch system logs
        const logsRes = await apiFetch('/admin/logs?page=0&size=5')
        setSystemLogs(Array.isArray(logsRes.data) ? logsRes.data : [])
      } catch (err: any) {
        // Optionally handle error here if you want to show a message
      }
    }
    fetchDashboard()
  }, [])

  // Helper to calculate percent change
  const percentChange = (current: number, last: number) => {
    if (typeof current !== 'number' || typeof last !== 'number' || last === 0) return 0;
    return ((current - last) / last) * 100;
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your rental platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{typeof stats.totalUsers === 'number' ? stats.totalUsers.toLocaleString() : '0'}</p>
              <p className={`text-sm mt-2 ${percentChange(stats.totalUsers, stats.totalUsersLastMonth) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {percentChange(stats.totalUsers, stats.totalUsersLastMonth) >= 0 ? '+' : ''}
                {percentChange(stats.totalUsers, stats.totalUsersLastMonth).toFixed(1)}% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{typeof stats.totalProperties === 'number' ? stats.totalProperties.toLocaleString() : '0'}</p>
              <p className={`text-sm mt-2 ${percentChange(stats.totalProperties, stats.totalPropertiesLastMonth) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {percentChange(stats.totalProperties, stats.totalPropertiesLastMonth) >= 0 ? '+' : ''}
                {percentChange(stats.totalProperties, stats.totalPropertiesLastMonth).toFixed(1)}% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Home className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${typeof stats.totalRevenue === 'number' ? (stats.totalRevenue / 1000000).toFixed(1) : '0.0'}M</p>
              <p className={`text-sm mt-2 ${percentChange(stats.totalRevenue, stats.totalRevenueLastMonth) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {percentChange(stats.totalRevenue, stats.totalRevenueLastMonth) >= 0 ? '+' : ''}
                {percentChange(stats.totalRevenue, stats.totalRevenueLastMonth).toFixed(1)}% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{typeof stats.activeUsers === 'number' ? stats.activeUsers.toLocaleString() : '0'}</p>
              <p className={`text-sm mt-2 ${percentChange(stats.activeUsers, stats.activeUsersLastMonth) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {percentChange(stats.activeUsers, stats.activeUsersLastMonth) >= 0 ? '+' : ''}
                {percentChange(stats.activeUsers, stats.activeUsersLastMonth).toFixed(1)}% from last month
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/users" className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Users</span>
            </Link>
            <Link to="/admin/properties" className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
              <Home className="w-6 h-6 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Properties</span>
            </Link>
            <Link to="/admin/reports" className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
              <BarChart className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reports</span>
            </Link>
            <Link to="/admin/settings" className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
              <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
            </Link>
          </div>
        </div>

            {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
            <button
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none"
              onClick={() => setShowAllStatus(true)}
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Health</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${systemStatus.systemHealth >= 90 ? 'bg-green-500' : systemStatus.systemHealth >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium" style={{ color: systemStatus.systemHealth >= 90 ? '#16a34a' : systemStatus.systemHealth >= 70 ? '#eab308' : '#dc2626' }}>{typeof systemStatus.systemHealth === 'number' ? systemStatus.systemHealth : '0'}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{typeof systemStatus.pendingApprovals === 'number' ? systemStatus.pendingApprovals : '0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Issues</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{typeof systemStatus.reportedIssues === 'number' ? systemStatus.reportedIssues : '0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <span className={`text-sm font-medium ${systemStatus.database === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.database}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">File Storage</span>
              <span className={`text-sm font-medium ${systemStatus.fileStorage === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.fileStorage}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Message Queue</span>
              <span className={`text-sm font-medium ${systemStatus.messageQueue === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.messageQueue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cache</span>
              <span className={`text-sm font-medium ${systemStatus.cache === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.cache}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{systemStatus.uptime || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Error Count</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{typeof systemStatus.errorCount === 'number' ? systemStatus.errorCount : '0'}</span>
            </div>
          </div>
        </div>

        {/* Modal for full metric card */}
        {showAllStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setShowAllStatus(false)}
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Status - Full Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Repeat all metrics here for full view */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Health</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${systemStatus.systemHealth >= 90 ? 'bg-green-500' : systemStatus.systemHealth >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium" style={{ color: systemStatus.systemHealth >= 90 ? '#16a34a' : systemStatus.systemHealth >= 70 ? '#eab308' : '#dc2626' }}>{typeof systemStatus.systemHealth === 'number' ? systemStatus.systemHealth : '0'}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{typeof systemStatus.pendingApprovals === 'number' ? systemStatus.pendingApprovals : '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Issues</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{typeof systemStatus.reportedIssues === 'number' ? systemStatus.reportedIssues : '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <span className={`text-sm font-medium ${systemStatus.database === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.database}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">File Storage</span>
                  <span className={`text-sm font-medium ${systemStatus.fileStorage === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.fileStorage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Message Queue</span>
                  <span className={`text-sm font-medium ${systemStatus.messageQueue === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.messageQueue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cache</span>
                  <span className={`text-sm font-medium ${systemStatus.cache === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{systemStatus.cache}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{systemStatus.uptime || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Error Count</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{typeof systemStatus.errorCount === 'number' ? systemStatus.errorCount : '0'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

          {/* Recent Activity & System Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 lg:mb-0">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
              <Link to="/admin/users" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.slice(0, 4).map((user) => {
                const status = user.isActive ? 'Active' : 'Pending';
                return (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {status}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.joinedAt ? (typeof user.joinedAt === 'string' ? user.joinedAt : new Date(user.joinedAt).toLocaleDateString()) : ''}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 lg:mb-0">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Logs</h3>
              <Link to="/admin/reports" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...systemLogs]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 4)
                .map((log) => (
                  <div key={log.id} className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {log.level === 'ERROR' && <AlertCircle className="w-4 h-4 text-red-500 inline-block" />}
                      {(log.level === 'WARN' || log.level === 'WARNING') && <AlertCircle className="w-4 h-4 text-yellow-500 inline-block" />}
                      {log.level === 'INFO' && <FileText className="w-4 h-4 text-blue-500 inline-block" />}
                      {log.level === 'DEBUG' && <CheckCircle className="w-4 h-4 text-green-500 inline-block" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-900 dark:text-white truncate">{log.message}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${
                          log.level === 'ERROR'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : log.level === 'WARN' || log.level === 'WARNING'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : log.level === 'INFO'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : log.level === 'DEBUG'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {log.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
