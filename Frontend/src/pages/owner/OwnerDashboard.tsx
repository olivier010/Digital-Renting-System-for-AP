import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  Star, 
  Eye, 
  Edit, 
  Plus, 
  MoreVertical, 
} from 'lucide-react'


import Card, { CardBody } from '../../components/ui/Card'
import { apiFetch } from '../../utils/api'

const OwnerDashboard = () => {
  const [stats, setStats] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isNotificationsHovered, setIsNotificationsHovered] = useState(false)
  const [openNotificationMenuId, setOpenNotificationMenuId] = useState<number | null>(null)

  const calculateRatingMetrics = (propertyItems: any[]) => {
    const safeItems = Array.isArray(propertyItems) ? propertyItems : []
    const totalReviews = safeItems.reduce((sum, p) => sum + Number(p.reviewsCount || 0), 0)

    if (totalReviews > 0) {
      const weightedSum = safeItems.reduce(
        (sum, p) => sum + Number(p.rating || 0) * Number(p.reviewsCount || 0),
        0
      )
      return {
        averageRating: Number((weightedSum / totalReviews).toFixed(1)),
        totalReviews
      }
    }

    const rated = safeItems.filter((p) => Number(p.rating || 0) > 0)
    if (rated.length === 0) {
      return { averageRating: 0, totalReviews: 0 }
    }

    const avg = rated.reduce((sum, p) => sum + Number(p.rating || 0), 0) / rated.length
    return {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: 0
    }
  }

  const computedRatingMetrics = calculateRatingMetrics(properties)
  const averageRatingValue = Number(stats?.averageRating ?? computedRatingMetrics.averageRating ?? 0)
  const totalReviewsValue = Number(stats?.totalReviews ?? computedRatingMetrics.totalReviews ?? 0)

  const fetchNotifications = useCallback(async () => {
    const pageSize = 20
    let page = 0
    let totalPages = 1
    let items: any[] = []

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

    while (page < totalPages) {
      const notificationRes = await apiFetch(`/api/notifications?page=${page}&size=${pageSize}`)
      const pageItems = notificationRes.data?.content || []
      items = items.concat(pageItems)
      totalPages = notificationRes.data?.totalPages || 1
      page += 1
    }

    items = items.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())

    setNotifications(items.map((n: any) => ({
      id: n.id,
      title: n.title || 'Notification',
      message: n.body || n.title || 'You have a new notification',
      time: n.createdAt ? formatRelativeTime(n.createdAt) : 'just now',
      read: Boolean(n.isRead)
    })))
  }, [])

  const markAllNotificationsAsRead = async () => {
    try {
      await apiFetch('/api/notifications/read-all', { method: 'PATCH' })
      setNotifications(prev => prev.map((n) => ({ ...n, read: true })))
    } catch {
      // no-op
    }
  }

  const markNotificationAsRead = async (id: number) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(prev => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    } catch {
      // no-op
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications(prev => prev.filter((n) => n.id !== id))
      setOpenNotificationMenuId(null)
    } catch {
      // no-op
    }
  }

  // ...existing code...

  useEffect(() => {
    const fetchDashboard = async () => {
      // ...existing code...
      try {
        // Dashboard stats
        const dashRes = await apiFetch('/api/owner/dashboard')
        setStats(dashRes.data || null)
        // Revenue chart data (simulate from dashboard for now)
        setRevenueData((dashRes.data?.revenueChart || []))
        // Properties
        const propRes = await apiFetch('/api/owner/properties?page=0&size=100')
        // Map API property objects to expected frontend structure
        const allApiProperties = Array.isArray(propRes.data?.content) ? propRes.data.content : []
        const apiProperties = allApiProperties.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: (p.category || '').toLowerCase(),
          location: p.location,
          price: p.price,
          status: (p.status || 'active').toLowerCase(),
          bookings: p.bookingsCount || 0,
          rating: p.rating || 0,
          reviews: p.reviewsCount || 0,
          contact: p.ownerName || '',
          images: Array.isArray(p.images)
            ? p.images.map((img: string) => img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}${img}`)
            : [],
        }));
        setProperties(apiProperties.slice(0, 3))
        // Fetch ALL bookings for accurate status counts
        const allBookRes = await apiFetch('/api/owner/bookings?page=0&size=1000')
        const allApiBookings = Array.isArray(allBookRes.data?.content) ? allBookRes.data.content.map((b: any) => ({
          id: b.id,
          status: (b.status || '').toLowerCase(),
        })) : []
        setAllBookings(allApiBookings)
        
        // Also fetch recent 3 for display
        const bookRes = await apiFetch('/api/owner/bookings?page=0&size=3')
        // Map API booking objects to expected frontend structure
        const apiBookings = Array.isArray(bookRes.data?.content) ? bookRes.data.content.map((b: any) => ({
          id: b.id,
          property: b.property?.title || '',
          guest: b.renter?.name || '',
          guestImage: b.renter?.name ? b.renter.name.split(' ').map((n: string) => n[0]).join('') : '',
          checkIn: b.startDate || '',
          checkOut: b.endDate || '',
          amount: b.totalPrice || 0,
          status: (b.status || '').toLowerCase(),
          rating: b.rating || null,
        })) : [];
        setRecentBookings(apiBookings)
        await fetchNotifications()
      } catch (err: any) {
        // ...existing code...
      }
    }
    fetchDashboard()
  }, [fetchNotifications])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-surface-100 text-gray-800 dark:bg-surface-900 dark:text-surface-200'
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Enhanced Header */}
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Owner Dashboard</h1>
              <p className="text-surface-500 dark:text-surface-400 mt-1">Welcome back! Here's what's happening with your properties</p>
            </div>
            <div className="flex items-center space-x-4">
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
          <Card hover>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Properties</p>
                  <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">{stats?.myProperties ?? 0}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +2 this month
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Home className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card hover>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">${stats?.myEarnings ? Number(stats.myEarnings).toLocaleString() : '0'}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card hover>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Average Rating</p>
                  <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">{averageRatingValue.toFixed(1)}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    {totalReviewsValue} reviews
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card hover>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Bookings</p>
                  <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">{stats?.myBookings ?? 0}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +18 this month
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Booking Chart and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Booking Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Booking Overview</h2>
            </div>
            
            {/* Booking Status Breakdown */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Confirmed</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">{allBookings.filter(b => b.status === 'confirmed').length}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${allBookings.length > 0 ? (allBookings.filter(b => b.status === 'confirmed').length / allBookings.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Pending</span>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{allBookings.filter(b => b.status === 'pending').length}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${allBookings.length > 0 ? (allBookings.filter(b => b.status === 'pending').length / allBookings.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Completed</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{allBookings.filter(b => b.status === 'completed').length}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${allBookings.length > 0 ? (allBookings.filter(b => b.status === 'completed').length / allBookings.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Cancelled</span>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">{allBookings.filter(b => b.status === 'cancelled').length}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${allBookings.length > 0 ? (allBookings.filter(b => b.status === 'cancelled').length / allBookings.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Monthly Booking Trend */}
            {revenueData.length > 0 && (
              <div className="mt-4 pt-4">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">
                  Monthly Booking Trend
                </h3>
                <div className="h-40 flex items-end justify-between space-x-2">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary-600 dark:bg-primary-500 rounded-t-lg hover:bg-primary-700 transition-colors"
                        style={{ height: `${(data.bookings / 25) * 100}%` }}
                      ></div>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">{data.month}</p>
                      <p className="text-xs font-medium text-surface-900 dark:text-white">{data.bookings}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/owner/add-property"
                className="flex items-center p-3 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 mr-3 text-primary-600" />
                <span>Add New Property</span>
              </Link>
              <Link
                to="/owner/bookings"
                className="flex items-center p-3 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                <span>Manage Bookings</span>
              </Link>
              <Link
                to="/owner/reviews"
                className="flex items-center p-3 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <Star className="w-5 h-5 mr-3 text-primary-600" />
                <span>View Reviews</span>
              </Link>
              <Link
                to="/owner/settings"
                className="flex items-center p-3 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors"
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
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
            <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Bookings</h2>
              <Link to="/owner/bookings" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="text-surface-400 text-center">No recent bookings</div>
                ) : recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                          {booking.guestImage}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{booking.guest}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{booking.property}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-500">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
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

          {/* My Properties */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
            <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">My Properties</h2>
              <Link to="/owner/properties" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
                Manage All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {properties.length === 0 ? (
                  <div className="text-surface-400 text-center">No properties</div>
                ) : properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-surface-200 dark:bg-surface-600 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-surface-400">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{property.title}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{property.location}</p>
                        <div className="flex items-center mt-1 space-x-3">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-surface-500 dark:text-surface-400 ml-1">{property.rating} ({property.reviews})</span>
                          </div>
                          <span className="text-xs text-surface-500 dark:text-surface-400">• {property.bookings} bookings</span>
                          <span className="text-xs text-surface-500 dark:text-surface-400 capitalize">• {property.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-surface-900 dark:text-white">${property.price}/mo</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                      <div className="flex space-x-1 mt-2">
                        <button className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
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
        <div className="mt-8 p-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Notifications</h2>
            <button
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
              onClick={markAllNotificationsAsRead}
            >
              Mark all as read
            </button>
          </div>
          <style>{`
            @keyframes ownerNotificationsMarquee {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
          `}</style>
          <div className="relative min-h-48 md:min-h-64 lg:h-80 overflow-hidden rounded-lg p-0">
            {notifications.length === 0 ? (
              <div className="text-surface-400 text-center py-8">No notifications</div>
            ) : (
              <div
                className="absolute left-0 top-0 w-full space-y-2"
                onMouseEnter={() => setIsNotificationsHovered(true)}
                onMouseLeave={() => setIsNotificationsHovered(false)}
                style={{
                  animation: notifications.length > 1
                    ? 'ownerNotificationsMarquee 30s linear infinite'
                    : undefined,
                  animationPlayState: isNotificationsHovered ? 'paused' : 'running',
                }}
              >
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => {
                      markNotificationAsRead(notification.id)
                      setOpenNotificationMenuId(null)
                    }}
                    className="w-full text-left flex items-center justify-between p-2 md:p-3 rounded transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
                  >
                    <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-surface-300' : 'bg-blue-500'}`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wide truncate">{notification.title}</p>
                        <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{notification.time}</p>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setOpenNotificationMenuId(openNotificationMenuId === notification.id ? null : notification.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setOpenNotificationMenuId(openNotificationMenuId === notification.id ? null : notification.id)
                          }
                        }}
                        className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </span>
                      {openNotificationMenuId === notification.id && (
                        <div className="absolute right-0 top-6 z-20 min-w-24 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-soft dark:shadow-dark-soft py-1">
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => deleteNotification(notification.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                deleteNotification(notification.id)
                              }
                            }}
                            className="block w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {notifications.map((notification) => (
                  <button
                    key={`${notification.id}-clone`}
                    type="button"
                    onClick={() => {
                      markNotificationAsRead(notification.id)
                      setOpenNotificationMenuId(null)
                    }}
                    className="w-full text-left flex items-center justify-between p-2 md:p-3 rounded transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
                  >
                    <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-surface-300' : 'bg-blue-500'}`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wide truncate">{notification.title}</p>
                        <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{notification.time}</p>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setOpenNotificationMenuId(openNotificationMenuId === notification.id ? null : notification.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setOpenNotificationMenuId(openNotificationMenuId === notification.id ? null : notification.id)
                          }
                        }}
                        className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </span>
                      {openNotificationMenuId === notification.id && (
                        <div className="absolute right-0 top-6 z-20 min-w-24 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-soft dark:shadow-dark-soft py-1">
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => deleteNotification(notification.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                deleteNotification(notification.id)
                              }
                            }}
                            className="block w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default OwnerDashboard


