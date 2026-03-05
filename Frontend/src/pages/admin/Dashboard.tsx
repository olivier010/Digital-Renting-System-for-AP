import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Home, TrendingUp, DollarSign, AlertCircle, CheckCircle, FileText, BarChart, Settings } from 'lucide-react'

const Dashboard = () => {
  // Mock data for admin dashboard
  const [stats] = useState({
    totalUsers: 15420,
    totalProperties: 2847,
    totalBookings: 8934,
    totalRevenue: 2847500,
    activeUsers: 3247,
    pendingApprovals: 23,
    reportedIssues: 8,
    systemHealth: 98
  })

  const [recentUsers] = useState([
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'Active', joinedAt: '2024-01-15' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', status: 'Active', joinedAt: '2024-01-14' },
    { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', status: 'Pending', joinedAt: '2024-01-13' },
    { id: '4', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', status: 'Active', joinedAt: '2024-01-12' },
    { id: '5', firstName: 'Charlie', lastName: 'Wilson', email: 'charlie@example.com', status: 'Suspended', joinedAt: '2024-01-11' }
  ])

  const [systemLogs] = useState([
    { id: '1', type: 'info', message: 'User login: john@example.com', timestamp: '2024-01-15 10:30:00' },
    { id: '2', type: 'warning', message: 'Failed login attempt from unknown IP', timestamp: '2024-01-15 10:25:00' },
    { id: '3', type: 'error', message: 'Database connection timeout', timestamp: '2024-01-15 10:20:00' },
    { id: '4', type: 'info', message: 'New property added: #2847', timestamp: '2024-01-15 10:15:00' },
    { id: '5', type: 'success', message: 'Backup completed successfully', timestamp: '2024-01-15 10:00:00' }
  ])

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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12% from last month</p>
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalProperties.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+8% from last month</p>
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+23% from last month</p>
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+5% from last month</p>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Health</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{stats.systemHealth}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{stats.pendingApprovals}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Issues</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{stats.reportedIssues}</span>
            </div>
          </div>
        </div>
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
              {recentUsers.slice(0, 4).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
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
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {user.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.joinedAt}</p>
                  </div>
                </div>
              ))}
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
              {systemLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {log.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {log.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    {log.type === 'info' && <FileText className="w-4 h-4 text-blue-500" />}
                    {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">{log.message}</p>
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
