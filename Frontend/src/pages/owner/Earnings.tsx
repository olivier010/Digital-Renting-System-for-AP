import { useEffect, useMemo, useState } from 'react'
import {
  DollarSign,
  TrendingDown,
  Calendar,
  Download,
  Search,
  BarChart3,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

import { apiFetch } from '../../utils/api'

type EarningsStats = {
  totalRevenue: number
  monthlyRevenue: number
  pendingRevenue: number
  averageBookingValue: number
  totalBookings: number
  growthRate: number
}

type MonthlyPoint = {
  month: string
  revenue: number
  bookings: number
  occupancy: number
}

type PropertyEarning = {
  id: number
  property: string
  revenue: number
  bookings: number
  occupancy: number
  growth: number
}

type Transaction = {
  id: number
  date: string
  property: string
  amount: number
  type: string
  status: string
  paymentMethod: string
  invoiceId: string
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Earnings = () => {
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [earningsData, setEarningsData] = useState<EarningsStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingRevenue: 0,
    averageBookingValue: 0,
    totalBookings: 0,
    growthRate: 0,
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([])
  const [propertyEarnings, setPropertyEarnings] = useState<PropertyEarning[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [earningsRes, monthlyStatsRes, propertiesRes, transactionsRes, bookingsRes] = await Promise.all([
          apiFetch('/owner/earnings'),
          apiFetch('/owner/dashboard/monthly-stats'),
          apiFetch('/owner/earnings/properties'),
          apiFetch('/owner/earnings/transactions?page=0&size=100'),
          apiFetch('/owner/bookings?page=0&size=1000'),
        ])

        const earnings = earningsRes.data || {}
        const monthlyStats = monthlyStatsRes.data || {}
        const bookings = bookingsRes.data?.content || []

        const totalRevenue = Number(earnings.myEarnings || 0)
        const totalBookings = Number(earnings.myBookings || bookings.length || 0)
        const monthlyRevenue = Number(monthlyStats.myEarningsThisMonth || 0)
        const lastMonthRevenue = Number(monthlyStats.myEarningsLastMonth || 0)
        const pendingRevenue = bookings
          .filter((b: any) => (b.paymentStatus || '').toLowerCase() !== 'completed')
          .reduce((sum: number, b: any) => sum + Number(b.totalPrice || 0), 0)

        const growthRate =
          lastMonthRevenue > 0
            ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : monthlyRevenue > 0
              ? 100
              : 0

        setEarningsData({
          totalRevenue,
          monthlyRevenue,
          pendingRevenue,
          averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
          totalBookings,
          growthRate,
        })

        const byMonth = Array.from({ length: 12 }, (_, i) => ({
          month: monthLabels[i],
          revenue: 0,
          bookings: 0,
          occupancy: 0,
        }))

        bookings.forEach((b: any) => {
          const date = b.createdAt ? new Date(b.createdAt) : null
          if (!date || Number.isNaN(date.getTime())) return
          if (String(date.getFullYear()) !== selectedYear) return
          const monthIndex = date.getMonth()
          byMonth[monthIndex].bookings += 1
          if ((b.paymentStatus || '').toLowerCase() === 'completed') {
            byMonth[monthIndex].revenue += Number(b.totalPrice || 0)
          }
        })

        setMonthlyData(byMonth)

        const propertyItems = Array.isArray(propertiesRes.data) ? propertiesRes.data : []
        setPropertyEarnings(
          propertyItems.map((p: any) => ({
            id: Number(p.propertyId),
            property: p.propertyTitle || 'Untitled Property',
            revenue: Number(p.totalRevenue || 0),
            bookings: Number(p.bookingsCount || 0),
            occupancy: Number(p.occupancyRate || 0),
            growth: Number(p.growth || 0),
          }))
        )

        const txItems = transactionsRes.data?.content || []
        setRecentTransactions(
          txItems.map((t: any) => ({
            id: Number(t.id),
            date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-',
            property: t.property?.title || 'Property',
            amount: Number(t.amount || 0),
            type: String(t.type || 'payment').toLowerCase(),
            status: String(t.status || 'pending').toLowerCase(),
            paymentMethod: t.method || 'N/A',
            invoiceId: t.invoiceId || '-',
          }))
        )
      } catch (err: any) {
        setError(err.message || 'Failed to load earnings data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedYear])

  const availableYears = useMemo(() => {
    const current = new Date().getFullYear()
    return [String(current - 1), String(current), String(current + 1)]
  }, [])

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1)

  const revenueBySource = useMemo(() => {
    const completed = recentTransactions.filter((t) => t.status === 'completed')
    const total = completed.reduce((sum, t) => sum + t.amount, 0)
    const groups = new Map<string, number>()

    completed.forEach((t) => {
      const key = t.paymentMethod || 'N/A'
      groups.set(key, (groups.get(key) || 0) + t.amount)
    })

    return Array.from(groups.entries()).map(([source, amount], index) => ({
      source,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500'][index % 4],
    }))
  }, [recentTransactions])

  const filteredTransactions = recentTransactions.filter((transaction) =>
    searchTerm === '' ||
    transaction.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600 dark:text-green-400'
    if (growth < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="w-4 h-4" />
    if (growth < 0) return <ArrowDownRight className="w-4 h-4" />
    return null
  }

  const getTransactionTypeColor = (type: string) => {
    if (type.includes('refund')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    if (type.includes('partial')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Earnings Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your live rental income and payment performance</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium opacity-60 cursor-not-allowed" disabled>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${earningsData.totalRevenue.toLocaleString()}</p>
              <div className={`flex items-center mt-2 text-sm ${getGrowthColor(earningsData.growthRate)}`}>
                {getGrowthIcon(earningsData.growthRate)}
                <span className="ml-1">{Math.abs(earningsData.growthRate).toFixed(1)}% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${earningsData.monthlyRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                <Wallet className="w-4 h-4 mr-1" />
                Current month completed payments
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${earningsData.pendingRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                <Calendar className="w-4 h-4 mr-1" />
                Awaiting payment completion
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingDown className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Booking Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${earningsData.averageBookingValue.toFixed(0)}</p>
              <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                <BarChart3 className="w-4 h-4 mr-1" />
                {earningsData.totalBookings} total bookings
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">Loading chart...</div>
            ) : (
              <div className="flex items-end justify-between h-full gap-1">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                    <div className="relative w-full flex flex-col items-center">
                      <div
                        className="w-full bg-primary-600 dark:bg-primary-500 rounded-t-lg"
                        style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                      />
                      <span className="absolute -top-6 text-[10px] font-medium text-gray-900 dark:text-white">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.month}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{data.bookings} bookings</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue by Payment Method</h2>
          <div className="space-y-4">
            {revenueBySource.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No completed transactions yet.</p>
            ) : revenueBySource.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{source.source}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">${source.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className={`${source.color} h-2 rounded-full`} style={{ width: `${source.percentage}%` }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{source.percentage.toFixed(1)}% of completed revenue</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Property Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Property</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Bookings</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Occupancy</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Growth</th>
              </tr>
            </thead>
            <tbody>
              {propertyEarnings.map((property) => (
                <tr key={property.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{property.property}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">${property.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{property.bookings}</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{property.occupancy.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right">
                    <div className={`flex items-center justify-end ${getGrowthColor(property.growth)}`}>
                      {getGrowthIcon(property.growth)}
                      <span className="text-sm font-medium ml-1">{Math.abs(property.growth).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full">
                  {transaction.type.includes('booking') && <DollarSign className="w-5 h-5 text-green-600" />}
                  {transaction.type.includes('partial') && <CreditCard className="w-5 h-5 text-blue-600" />}
                  {transaction.type.includes('refund') && <TrendingDown className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.property}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Invoice {transaction.invoiceId} • {transaction.date}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type.includes('refund') ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {transaction.type.includes('refund') ? '-' : ''}${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.paymentMethod}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.type)}`}>{transaction.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                </div>
              </div>
            </div>
          ))}

          {!loading && filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No transactions found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Earnings
