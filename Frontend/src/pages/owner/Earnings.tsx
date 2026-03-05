import { useState } from 'react'
import { 
  DollarSign, 
  TrendingDown, 
  Calendar, 
  Download, 
  Search, 
  BarChart3, 
  CreditCard,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const Earnings = () => {
  const [selectedYear, setSelectedYear] = useState('2024')
  const [searchTerm, setSearchTerm] = useState('')

  const [earningsData] = useState({
    totalRevenue: 125000,
    monthlyRevenue: 24500,
    pendingRevenue: 8500,
    averageBookingValue: 850,
    totalBookings: 156,
    growthRate: 12.5,
    projectedRevenue: 145000
  })

  const [monthlyData] = useState([
    { month: 'Jan', revenue: 18500, bookings: 12, occupancy: 78 },
    { month: 'Feb', revenue: 22000, bookings: 15, occupancy: 82 },
    { month: 'Mar', revenue: 24500, bookings: 18, occupancy: 85 },
    { month: 'Apr', revenue: 19800, bookings: 14, occupancy: 79 },
    { month: 'May', revenue: 26500, bookings: 20, occupancy: 88 },
    { month: 'Jun', revenue: 28000, bookings: 22, occupancy: 91 }
  ])

  const [propertyEarnings] = useState([
    {
      id: 1,
      property: 'Luxury Downtown Apartment',
      revenue: 42000,
      bookings: 18,
      occupancy: 85,
      averagePrice: 2333,
      growth: 15.2,
      image: '🏢'
    },
    {
      id: 2,
      property: 'Beach House Paradise',
      revenue: 55000,
      bookings: 22,
      occupancy: 92,
      averagePrice: 2500,
      growth: 8.7,
      image: '🏖️'
    },
    {
      id: 3,
      property: 'Mountain View Cabin',
      revenue: 18000,
      bookings: 10,
      occupancy: 65,
      averagePrice: 1800,
      growth: -5.3,
      image: '🏔️'
    },
    {
      id: 4,
      property: 'Urban Studio Loft',
      revenue: 35000,
      bookings: 25,
      occupancy: 78,
      averagePrice: 1400,
      growth: 22.1,
      image: '🏙️'
    }
  ])

  const [recentTransactions] = useState([
    {
      id: 1,
      date: '2024-03-15',
      property: 'Luxury Downtown Apartment',
      guest: 'John Smith',
      amount: 750,
      type: 'booking_payment',
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      date: '2024-03-14',
      property: 'Beach House Paradise',
      guest: 'Sarah Johnson',
      amount: 1250,
      type: 'booking_payment',
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 3,
      date: '2024-03-13',
      property: 'Urban Studio Loft',
      guest: 'Michael Brown',
      amount: 500,
      type: 'partial_payment',
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 4,
      date: '2024-03-12',
      property: 'Mountain View Cabin',
      guest: 'Emily Davis',
      amount: 450,
      type: 'refund',
      status: 'completed',
      paymentMethod: 'Credit Card'
    }
  ])

  const [revenueBySource] = useState([
    { source: 'Direct Bookings', amount: 75000, percentage: 60, color: 'bg-blue-500' },
    { source: 'Platform Commissions', amount: 35000, percentage: 28, color: 'bg-green-500' },
    { source: 'Other', amount: 15000, percentage: 12, color: 'bg-yellow-500' }
  ])

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
    switch (type) {
      case 'booking_payment': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'partial_payment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'refund': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredTransactions = recentTransactions.filter(transaction =>
    searchTerm === '' || 
    transaction.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Earnings Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your rental income, analyze performance, and optimize revenue
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${earningsData.totalRevenue.toLocaleString()}
              </p>
              <div className={`flex items-center mt-2 text-sm ${getGrowthColor(earningsData.growthRate)}`}>
                {getGrowthIcon(earningsData.growthRate)}
                <span className="ml-1">{Math.abs(earningsData.growthRate)}% vs last year</span>
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${earningsData.monthlyRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8% vs last month
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${earningsData.pendingRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                <Calendar className="w-4 h-4 mr-1" />
                {earningsData.totalBookings} active bookings
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Booking Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${earningsData.averageBookingValue}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +5% increase
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h2>
            <div className="flex items-center space-x-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <div className="flex items-end justify-between h-full">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex flex-col items-center">
                    <div 
                      className="w-full bg-primary-600 dark:bg-primary-500 rounded-t-lg hover:bg-primary-700 transition-colors"
                      style={{ height: `${(data.revenue / 30000) * 100}%` }}
                    />
                    <span className="absolute -top-6 text-xs font-medium text-gray-900 dark:text-white">
                      ${(data.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.month}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{data.bookings} bookings</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{data.occupancy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue by Source</h2>
          
          <div className="space-y-4">
            {revenueBySource.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {source.source}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${(source.amount / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${source.color} h-2 rounded-full`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {source.percentage}% of total
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property Performance</h2>
          <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
            View All Properties
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Property</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Bookings</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Occupancy</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Avg. Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Growth</th>
              </tr>
            </thead>
            <tbody>
              {propertyEarnings.map((property) => (
                <tr key={property.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{property.image}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.property}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                    ${(property.revenue / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                    {property.bookings}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                    {property.occupancy}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                    ${property.averagePrice}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`flex items-center justify-end ${getGrowthColor(property.growth)}`}>
                      {getGrowthIcon(property.growth)}
                      <span className="text-sm font-medium ml-1">
                        {Math.abs(property.growth)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          <div className="flex items-center space-x-3">
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
            <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full">
                  {transaction.type === 'booking_payment' && <DollarSign className="w-5 h-5 text-green-600" />}
                  {transaction.type === 'partial_payment' && <CreditCard className="w-5 h-5 text-blue-600" />}
                  {transaction.type === 'refund' && <TrendingDown className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.property}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.guest} • {transaction.date}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'refund' 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {transaction.type === 'refund' ? '-' : ''}${transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.paymentMethod}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                    {transaction.type.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Earnings
