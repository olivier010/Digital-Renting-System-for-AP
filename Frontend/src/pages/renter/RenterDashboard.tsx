import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Heart, 
  Search, 
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

const RenterDashboard = () => {
  const [stats] = useState({
    totalBookings: 12,
    activeBookings: 2,
    favoriteProperties: 8,
    totalSpent: 15400,
    averageRating: 4.7,
    upcomingCheckIn: 3
  })

  const [recentBookings] = useState([
    {
      id: 1,
      property: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      image: '🏢',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      amount: 750,
      status: 'confirmed',
      rating: null
    },
    {
      id: 2,
      property: 'Beach House Paradise',
      location: 'Miami, FL',
      image: '🏖️',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      amount: 1250,
      status: 'confirmed',
      rating: null
    },
    {
      id: 3,
      property: 'Mountain View Cabin',
      location: 'Aspen, CO',
      image: '🏔️',
      checkIn: '2024-02-10',
      checkOut: '2024-02-12',
      amount: 450,
      status: 'completed',
      rating: 5
    }
  ])

  const [favoriteProperties] = useState([
    {
      id: 1,
      title: 'Modern City Loft',
      location: 'San Francisco, CA',
      price: 2800,
      image: '🏙️',
      rating: 4.8,
      savedDate: '2024-03-01'
    },
    {
      id: 2,
      title: 'Cozy Beach Cottage',
      location: 'San Diego, CA',
      price: 2200,
      image: '🏖️',
      rating: 4.6,
      savedDate: '2024-02-28'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Your Renter Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your bookings, saved properties, and rental experience all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalBookings}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2 this month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bookings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeBookings}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {stats.upcomingCheckIn} upcoming check-ins
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorite Properties</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.favoriteProperties}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                Saved for later
              </p>
            </div>
            <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/renter/search"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Search className="w-5 h-5 mr-3 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white">Search Properties</span>
          </Link>
          <Link
            to="/renter/bookings"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-3 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white">View Bookings</span>
          </Link>
          <Link
            to="/renter/favorites"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Heart className="w-5 h-5 mr-3 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white">Favorites</span>
          </Link>
          <Link
            to="/renter/payments"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <DollarSign className="w-5 h-5 mr-3 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white">Payment History</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
            <Link to="/renter/bookings" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                      {booking.image}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{booking.property}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {booking.location}
                      </p>
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

        {/* Favorite Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Favorite Properties</h2>
            <Link to="/renter/favorites" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {favoriteProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                      {property.image}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{property.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.location}
                      </p>
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">{property.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Saved {property.savedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${property.price}/mo</p>
                    <button className="mt-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
                      View Details
                    </button>
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

export default RenterDashboard
