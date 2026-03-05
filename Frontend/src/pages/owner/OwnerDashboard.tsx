import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Star,
  Eye,
  Edit,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Bell
} from 'lucide-react'

const OwnerDashboard = () => {
  const [stats] = useState({
    totalProperties: 12,
    activeListings: 8,
    totalBookings: 156,
    totalRevenue: 125000,
    occupancyRate: 85,
    averageRating: 4.8,
    pendingBookings: 3,
    monthlyRevenue: 24500,
    totalReviews: 156,
    responseRate: 95,
    totalGuests: 89
  })

  const [revenueData] = useState([
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 22000 },
    { month: 'Mar', revenue: 24500 },
    { month: 'Apr', revenue: 19800 },
    { month: 'May', revenue: 26500 },
    { month: 'Jun', revenue: 28900 }
  ])

  const [recentBookings] = useState([
    {
      id: 1,
      property: 'Luxury Downtown Apartment',
      guest: 'John Smith',
      guestImage: 'JS',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      amount: 750,
      status: 'confirmed',
      rating: null
    },
    {
      id: 2,
      property: 'Beach House Paradise',
      guest: 'Sarah Johnson',
      guestImage: 'SJ',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      amount: 1250,
      status: 'pending',
      rating: null
    },
    {
      id: 3,
      property: 'Mountain View Cabin',
      guest: 'Michael Brown',
      guestImage: 'MB',
      checkIn: '2024-03-10',
      checkOut: '2024-03-12',
      amount: 450,
      status: 'completed',
      rating: 5
    }
  ])

  const [properties] = useState([
    {
      id: 1,
      title: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      price: 2500,
      status: 'active',
      bookings: 45,
      rating: 4.8,
      occupancy: 92,
      image: '🏢'
    },
    {
      id: 2,
      title: 'Beach House Paradise',
      location: 'Miami, FL',
      price: 3500,
      status: 'active',
      bookings: 32,
      rating: 4.9,
      occupancy: 88,
      image: '🏖️'
    },
    {
      id: 3,
      title: 'Mountain View Cabin',
      location: 'Aspen, CO',
      price: 1800,
      status: 'maintenance',
      bookings: 28,
      rating: 4.7,
      occupancy: 0,
      image: '🏔️'
    }
  ])

  const [notifications] = useState([
    {
      id: 1,
      type: 'booking',
      message: 'New booking request for Beach House Paradise',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'review',
      message: 'John Smith left a 5-star review',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'maintenance',
      message: 'Mountain View Cabin maintenance completed',
      time: '1 day ago',
      read: true
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your properties</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              <Link
                to="/owner/add-property"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Property</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalProperties}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Home className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.occupancyRate}%</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -3% from last month
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalBookings}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +18 this month
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>All time</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary-600 dark:bg-primary-500 rounded-t-lg hover:bg-primary-700 transition-colors"
                    style={{ height: `${(data.revenue / 30000) * 100}%` }}
                  ></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.month}</p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">${(data.revenue / 1000).toFixed(0)}k</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/owner/add-property"
                className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 mr-3 text-primary-600" />
                <span>Add New Property</span>
              </Link>
              <Link
                to="/owner/bookings"
                className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                <span>Manage Bookings</span>
              </Link>
              <Link
                to="/owner/reviews"
                className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Star className="w-5 h-5 mr-3 text-primary-600" />
                <span>View Reviews</span>
              </Link>
              <Link
                to="/owner/settings"
                className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5 mr-3 text-primary-600" />
                <span>Account Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Bookings and Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
              <Link to="/owner/bookings" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                          {booking.guestImage}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.guest}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.property}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">${booking.amount}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">{booking.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Properties */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Properties</h2>
              <Link to="/owner/properties" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
                Manage All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                        {property.image}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{property.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{property.location}</p>
                        <div className="flex items-center mt-1 space-x-3">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">{property.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">• {property.bookings} bookings</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">• {property.occupancy}% occupied</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">${property.price}/mo</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                      <div className="flex space-x-1 mt-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notifications</h2>
            <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
              Mark all as read
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-center justify-between p-3 rounded-lg ${notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard
