import { useCallback, useEffect, useState } from 'react'
// Type definitions
type Booking = {
  id: number;
  property: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: string;
  rating: number | null;
  host: string;
  hostImage: string;
};
type Trip = {
  id: number;
  property: string;
  location: string;
  image: string;
  checkIn: string;
  daysUntil: number;
  status: string;
};
type FavoriteProperty = {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  rating: number;
  savedDate: string;
  category: string;
  availability: string;
};
type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};
type BookingStatusCounts = {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
};
import { apiFetch } from '../../utils/api'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Heart, 
  Search, 
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  CreditCard,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

const RenterDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    favoriteProperties: 0,
    totalSpent: 0,
    averageRating: 0,
    upcomingCheckIn: 0,
    completedStays: 0,
    savedSearches: 0
  })

  const [recentBookings, setRecentBookings] = useState<Booking[]>([])

  const [favoriteProperties, setFavoriteProperties] = useState<FavoriteProperty[]>([])

  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([])

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [bookingStatusCounts, setBookingStatusCounts] = useState<BookingStatusCounts>({
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  })

  const fetchNotifications = useCallback(async () => {
    const formatRelativeTime = (timestamp: string) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const mins = Math.floor(diffMs / (1000 * 60))

      if (mins < 1) return 'just now'
      if (mins < 60) return `${mins}m ago`

      const hours = Math.floor(mins / 60)
      if (hours < 24) return `${hours}h ago`

      const days = Math.floor(hours / 24)
      if (days < 7) return `${days}d ago`

      return date.toLocaleDateString()
    }

    const notificationRes = await apiFetch('/notifications?page=0&size=5')
    const items = (notificationRes.data?.content || [])
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3)

    setNotifications(items.map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title || 'Notification',
      message: n.body || n.title || 'You have a new notification',
      time: n.createdAt ? formatRelativeTime(n.createdAt) : 'just now',
      read: Boolean(n.isRead)
    })))
  }, [])

  const markAllNotificationsAsRead = async () => {
    try {
      await apiFetch('/notifications/read-all', { method: 'PATCH' })
      setNotifications(prev => prev.map((n) => ({ ...n, read: true })))
    } catch {
      // no-op
    }
  }

  const markNotificationAsRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(prev => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    } catch {
      // no-op
    }
  }

  const getBookingStatusBreakdown = (items: any[]): BookingStatusCounts => {
    return items.reduce(
      (acc, booking) => {
        const status = (booking.status || '').toLowerCase()
        if (status === 'pending') acc.pending += 1
        else if (status === 'confirmed') acc.confirmed += 1
        else if (status === 'completed') acc.completed += 1
        else if (status === 'cancelled') acc.cancelled += 1
        return acc
      },
      { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    )
  }

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Dashboard stats
        const dashboardRes = await apiFetch('/renter/dashboard');
        const dash = dashboardRes.data || {};
        setStats({
          totalBookings: dash.myTotalBookings || 0,
          activeBookings: dash.myActiveBookings || 0,
          favoriteProperties: dash.myFavorites || 0,
          totalSpent: dash.totalSpent || 0,
          averageRating: dash.averageRating || 0,
          upcomingCheckIn: 0,
          completedStays: 0,
          savedSearches: 0
        });
        // Upcoming trips (confirmed status)
        const confirmedBookingsRes = await apiFetch('/renter/bookings?page=0&size=6&status=CONFIRMED');
        const confirmedBookings = confirmedBookingsRes.data?.content || [];
        setUpcomingTrips(confirmedBookings.map((b: any) => ({
          id: b.id,
          property: b.property?.title || '',
          location: b.property?.location || '',
          image: b.property?.image ? (b.property.image.startsWith('http') ? b.property.image : `http://localhost:8080${b.property.image}`) : '',
          checkIn: b.startDate,
          daysUntil: 0,
          status: b.status
        })));

        // Recent bookings (completed status)
        const completedBookingsRes = await apiFetch('/renter/bookings?page=0&size=3&status=COMPLETED');
        const completedBookings = completedBookingsRes.data?.content || [];
        setRecentBookings(completedBookings.map((b: any) => ({
          id: b.id,
          property: b.property?.title || '',
          location: b.property?.location || '',
          image: b.property?.image ? (b.property.image.startsWith('http') ? b.property.image : `http://localhost:8080${b.property.image}`) : '',
          checkIn: b.startDate,
          checkOut: b.endDate,
          amount: b.totalPrice,
          status: b.status,
          rating: b.reviewed ? 5 : null,
          host: b.property?.ownerName || '',
          hostImage: b.property?.image ? (b.property.image.startsWith('http') ? b.property.image : `http://localhost:8080${b.property.image}`) : ''
        })));

        // Booking status chart data (all renter bookings)
        const allBookingsRes = await apiFetch('/renter/bookings?page=0&size=200')
        const allBookings = allBookingsRes.data?.content || []
        setBookingStatusCounts(getBookingStatusBreakdown(allBookings))

        // Favorites
        const favRes = await apiFetch('/favorites');
        setFavoriteProperties((favRes.data?.content || []).map((f: any) => ({
          id: f.id,
          title: f.property?.title || '',
          location: f.property?.location || '',
          price: f.property?.price || 0,
          image: f.property?.image ? (f.property.image.startsWith('http') ? f.property.image : `http://localhost:8080${f.property.image}`) : '',
          rating: f.property?.rating || 0,
          savedDate: f.savedAt,
          category: f.property?.category || '',
          availability: f.property?.isAvailable ? 'Available' : 'Occupied'
        })));
        // Removed undefined bookingsRes reference
        await fetchNotifications();
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchDashboard();
  }, [fetchNotifications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-surface-100 text-gray-800 dark:bg-surface-900 dark:text-surface-200'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_STATUS_CHANGED':
      case 'BOOKING_CREATED':
        return <Calendar className="w-4 h-4 text-blue-600" />
      case 'PAYMENT_SUCCEEDED':
      case 'PAYMENT_REFUNDED':
      case 'PAYMENT_FAILED':
        return <CreditCard className="w-4 h-4 text-green-600" />
      case 'REVIEW_RECEIVED':
        return <Star className="w-4 h-4 text-yellow-600" />
      default: return <AlertCircle className="w-4 h-4 text-surface-600" />
    }
  }

  const shouldMarqueeNotifications = notifications.length > 1
  // Always use a new array to avoid React re-render issues
  const marqueeNotifications = shouldMarqueeNotifications
    ? [...notifications, ...notifications]
    : notifications

  const totalChartBookings =
    bookingStatusCounts.pending +
    bookingStatusCounts.confirmed +
    bookingStatusCounts.completed +
    bookingStatusCounts.cancelled

  const pendingPct = totalChartBookings ? (bookingStatusCounts.pending / totalChartBookings) * 100 : 0
  const confirmedPct = totalChartBookings ? (bookingStatusCounts.confirmed / totalChartBookings) * 100 : 0
  const completedPct = totalChartBookings ? (bookingStatusCounts.completed / totalChartBookings) * 100 : 0

  const donutBackground = `conic-gradient(
    #f59e0b 0% ${pendingPct}%,
    #10b981 ${pendingPct}% ${pendingPct + confirmedPct}%,
    #3b82f6 ${pendingPct + confirmedPct}% ${pendingPct + confirmedPct + completedPct}%,
    #ef4444 ${pendingPct + confirmedPct + completedPct}% 100%
  )`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Welcome to Your Renter Dashboard
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Manage your bookings, saved properties, and rental experience all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Bookings</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">{stats.totalBookings}</p>
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

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Active Bookings</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">{stats.activeBookings}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {stats.upcomingCheckIn} upcoming check-ins
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Favorite Properties</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">{stats.favoriteProperties}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                Saved for later
              </p>
            </div>
            <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Spent</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">${stats.totalSpent.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% vs last year
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/renter/search"
            className="flex items-center p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors group"
          >
            <Search className="w-5 h-5 mr-3 text-primary-600 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-medium text-surface-900 dark:text-white block">Search Properties</span>
              <span className="text-xs text-surface-500 dark:text-surface-400">Find your next stay</span>
            </div>
          </Link>
          <Link
            to="/renter/bookings"
            className="flex items-center p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors group"
          >
            <Calendar className="w-5 h-5 mr-3 text-primary-600 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-medium text-surface-900 dark:text-white block">View Bookings</span>
              <span className="text-xs text-surface-500 dark:text-surface-400">Manage reservations</span>
            </div>
          </Link>
          <Link
            to="/renter/favorites"
            className="flex items-center p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors group"
          >
            <Heart className="w-5 h-5 mr-3 text-primary-600 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-medium text-surface-900 dark:text-white block">Favorites</span>
              <span className="text-xs text-surface-500 dark:text-surface-400">Saved properties</span>
            </div>
          </Link>
          <Link
            to="/renter/payments"
            className="flex items-center p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors group"
          >
            <CreditCard className="w-5 h-5 mr-3 text-primary-600 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-medium text-surface-900 dark:text-white block">Payment History</span>
              <span className="text-xs text-surface-500 dark:text-surface-400">View transactions</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Trips */}
        <div className="lg:col-span-2 space-y-8">
          {/* Booking Status Chart */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Booking Status Overview</h2>
              <Link to="/renter/bookings" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium flex items-center">
                Open Bookings
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {totalChartBookings === 0 ? (
              <div className="rounded-lg bg-surface-50 dark:bg-surface-700 p-6 text-sm text-surface-500 dark:text-surface-400">
                No booking data yet to visualize.
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative h-44 w-44 mx-auto md:mx-0">
                  <div
                    className="h-44 w-44 rounded-full"
                    style={{ background: donutBackground }}
                    aria-label="Booking status chart"
                    role="img"
                  />
                  <div className="absolute inset-0 m-auto flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center dark:bg-surface-800">
                    <span className="text-2xl font-bold text-surface-900 dark:text-white">{totalChartBookings}</span>
                    <span className="text-xs text-surface-500 dark:text-surface-400">Bookings</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <p className="text-xs uppercase tracking-wide text-yellow-700 dark:text-yellow-300">Pending</p>
                    <p className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">{bookingStatusCounts.pending}</p>
                  </div>
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                    <p className="text-xs uppercase tracking-wide text-green-700 dark:text-green-300">Confirmed</p>
                    <p className="text-xl font-semibold text-green-800 dark:text-green-200">{bookingStatusCounts.confirmed}</p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                    <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Completed</p>
                    <p className="text-xl font-semibold text-blue-800 dark:text-blue-200">{bookingStatusCounts.completed}</p>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300">Cancelled</p>
                    <p className="text-xl font-semibold text-red-800 dark:text-red-200">{bookingStatusCounts.cancelled}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
            <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Upcoming Trips</h2>
                      <Link to="/renter/bookings" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium flex items-center">
                        View All Trips
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                        {upcomingTrips
                          .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                          .slice(0, 3)
                          .map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-surface-200 dark:bg-surface-600 rounded-lg flex items-center justify-center text-2xl">
                        {trip.image && trip.image.startsWith('http') ? (
                          <img src={trip.image} alt={trip.property} className="w-full h-full object-cover rounded-lg" />
                        ) : trip.image ? (
                          trip.image
                        ) : (
                          <span className="text-surface-400">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{trip.property}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {trip.location}
                        </p>
                        <p className="text-sm text-surface-500 dark:text-surface-500">
                          Check-in: {trip.checkIn}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 font-medium">
                        <Clock className="w-4 h-4 mr-1" />
                        {trip.daysUntil} days
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
            <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Bookings</h2>
                      <Link to="/renter/bookings" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium flex items-center">
                        View All Bookings
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                        {recentBookings.slice(0, 2).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-surface-200 dark:bg-surface-600 rounded-lg flex items-center justify-center text-2xl">
                        {booking.image && booking.image.startsWith('http') ? (
                          <img src={booking.image} alt={booking.property} className="w-full h-full object-cover rounded-lg" />
                        ) : booking.image ? (
                          booking.image
                        ) : (
                          <span className="text-surface-400">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{booking.property}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {booking.location}
                        </p>
                        <div className="flex items-center mt-1 space-x-3">
                          <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                            <Users className="w-3 h-3 mr-1" />
                            {booking.host}
                          </div>
                          <span className="text-xs text-surface-500 dark:text-surface-500">
                            {booking.checkIn} - {booking.checkOut}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-surface-900 dark:text-white">${booking.amount}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-surface-500 dark:text-surface-400 ml-1">{booking.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
            <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Notifications</h2>
              <button
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
                onClick={markAllNotificationsAsRead}
              >
                Mark all read
              </button>
            </div>
            <div className="p-6">
              <div className={shouldMarqueeNotifications ? 'notification-marquee-viewport' : ''}>
                <div className={shouldMarqueeNotifications ? 'notification-marquee-track pr-1' : 'space-y-3'} key={marqueeNotifications.length}>
                {notifications.length === 0 && (
                  <div className="text-surface-400 text-center">No notifications</div>
                )}
                {marqueeNotifications.map((notification, idx) => (
                  <button
                    key={`${notification.id}-${idx}`}
                    type="button"
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`w-full text-left flex items-start space-x-3 p-3 rounded-lg ${notification.read ? 'bg-surface-50 dark:bg-surface-700' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wide">
                        {notification.title}
                      </p>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </button>
                ))}
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Properties */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
            <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Favorite Properties</h2>
              <Link to="/renter/favorites" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium flex items-center">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {favoriteProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-surface-200 dark:bg-surface-600 rounded-lg flex items-center justify-center text-lg">
                        {property.image && property.image.startsWith('http') ? (
                          <img src={property.image} alt={property.title} className="w-full h-full object-cover rounded-lg" />
                        ) : property.image ? (
                          property.image
                        ) : (
                          <span className="text-surface-400">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">{property.title}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{property.location}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-surface-500 dark:text-surface-400 capitalize">
                            {property.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">${property.price}/mo</p>
                      <button className="mt-1 text-primary-600 hover:text-primary-500 dark:text-primary-400 text-xs font-medium">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RenterDashboard


