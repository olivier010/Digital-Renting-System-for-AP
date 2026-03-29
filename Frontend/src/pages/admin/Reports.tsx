import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Activity,
  Target,
  PieChart,
  Zap,
  RefreshCw,
  Search,
  FileText
} from 'lucide-react'

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [searchTerm, setSearchTerm] = useState('')

  const [overviewStats, setOverviewStats] = useState<any>(null)

  const [revenueData, setRevenueData] = useState<any[]>([])

  const [systemLogs, setSystemLogs] = useState<any[]>([])

  const [reportedIssues] = useState<any[]>([])

  useEffect(() => {
    // Fetch dashboard stats
    apiFetch('/admin/dashboard')
      .then(res => setOverviewStats(res.data))
      .catch(() => setOverviewStats(null))
    // Fetch logs
    apiFetch('/admin/logs')
      .then(res => setSystemLogs(res.data))
      .catch(() => setSystemLogs([]))
    // TODO: Fetch revenueData from backend if available
  }, [])

  const getLogLevelColor = (level: string) => {
    switch ((level || '').toUpperCase()) {
      case 'ERROR': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'WARN':
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'INFO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DEBUG': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'approved': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const [logsPage, setLogsPage] = useState(0);
  const LOGS_PAGE_SIZE = 4;
  const filteredLogs = systemLogs
    .filter(log => 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const paginatedLogs = filteredLogs.slice(logsPage * LOGS_PAGE_SIZE, (logsPage + 1) * LOGS_PAGE_SIZE);

  const filteredIssues = reportedIssues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.reporter.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor system performance, user activity, and platform insights
        </p>
      </div>

      {/* Period Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Period</h3>
            <div className="flex items-center space-x-2">
              {['day', 'week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${Number(overviewStats.totalRevenue).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {(() => {
                      const current = Number(overviewStats.totalRevenue);
                      const last = Number(overviewStats.totalRevenueLastMonth);
                      if (last === 0) return 'N/A from last month';
                      const percent = ((current - last) / last) * 100;
                      const sign = percent >= 0 ? '+' : '';
                      return `${sign}${percent.toFixed(1)}% from last month`;
                    })()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Number(overviewStats.activeUsers).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {(() => {
                      const current = Number(overviewStats.activeUsers);
                      const last = Number(overviewStats.totalUsersLastMonth);
                      if (last === 0) return 'N/A from last month';
                      const percent = ((current - last) / last) * 100;
                      const sign = percent >= 0 ? '+' : '';
                      return `${sign}${percent.toFixed(1)}% from last month`;
                    })()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Number(overviewStats.totalBookings).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {(() => {
                      const current = Number(overviewStats.totalBookings);
                      const last = Number(overviewStats.totalBookingsLastMonth);
                      if (last === 0) return 'N/A from last month';
                      const percent = ((current - last) / last) * 100;
                      const sign = percent >= 0 ? '+' : '';
                      return `${sign}${percent.toFixed(1)}% from last month`;
                    })()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(overviewStats.uptimePercentage)}%
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Excellent
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trends</h3>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              View Details
            </button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Revenue chart visualization</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {revenueData.map(d => d.month).join(' - ')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {revenueData.slice(0, 4).map((data, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">{data.month}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${(data.revenue / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{data.bookings} bookings</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Logs & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* System Logs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Logs</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="pl-9 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  Export
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {paginatedLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="mt-0.5">
                    {log.level === 'ERROR' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {log.level === 'WARN' || log.level === 'WARNING' ? <AlertCircle className="w-4 h-4 text-yellow-500" /> : null}
                    {log.level === 'INFO' && <FileText className="w-4 h-4 text-blue-500" />}
                    {log.level === 'DEBUG' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{log.message}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setLogsPage((p) => Math.max(0, p - 1))}
                disabled={logsPage === 0}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => setLogsPage((p) => p + 1)}
                disabled={((logsPage + 1) * LOGS_PAGE_SIZE) >= filteredLogs.length}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Reported Issues */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reported Issues</h3>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                View All
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {filteredIssues.slice(0, 6).map((issue) => (
                <div key={issue.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 mr-2">
                      {issue.title}
                    </h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                      issue.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      issue.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{issue.type}</span>
                      <span>•</span>
                      <span>{issue.reporter}</span>
                      <span>•</span>
                      <span>{issue.created}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Assigned to: {issue.assignedTo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {overviewStats && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              View Full Report
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-3">
                <Target className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overviewStats.averageRating}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {(() => {
                  const current = Number(overviewStats.averageRating);
                  const last = Number(overviewStats.averageRatingLastMonth);
                  if (last === 0) return 'N/A from last month';
                  const percent = ((current - last) / last) * 100;
                  const sign = percent >= 0 ? '+' : '';
                  return `${sign}${percent.toFixed(1)}% from last month`;
                })()}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-3">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overviewStats.responseRate ? overviewStats.responseRate + '%' : 'N/A'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+3% from last month</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-3">
                <PieChart className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overviewStats.completedBookings && overviewStats.totalBookings ? Math.round((overviewStats.completedBookings / overviewStats.totalBookings) * 100) + '%' : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+5% from last month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
