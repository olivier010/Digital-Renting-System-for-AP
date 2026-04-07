import { useState, useEffect } from 'react'
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
  const [properties, setProperties] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

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

  const fetchNotifications = async () => {
    const pageSize = 20
    let page = 0
    let totalPages = 1
    let items: any[] = []

    while (page < totalPages) {
      const notificationRes = await apiFetch(`/notifications?page=${page}&size=${pageSize}`)
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
  }

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

  // ...existing code...

  useEffect(() => {
    const fetchDashboard = async () => {
      // ...existing code...
      try {
        // Dashboard stats
        const dashRes = await apiFetch('/owner/dashboard')
        setStats(dashRes.data || null)
        // Revenue chart data (simulate from dashboard for now)
        setRevenueData((dashRes.data?.revenueChart || []))
        // Properties
        const propRes = await apiFetch('/owner/properties?page=0&size=3')
        // Map API property objects to expected frontend structure
        const apiProperties = Array.isArray(propRes.data?.content) ? propRes.data.content.map((p: any) => ({
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
            ? p.images.map((img: string) => img.startsWith('http') ? img : `http://localhost:8080${img}`)
            : [],
        })) : [];
        setProperties(apiProperties)
        // Bookings
        const bookRes = await apiFetch('/owner/bookings?page=0&size=3')
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
  }, [])

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
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your properties</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.myProperties ?? 0}</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${stats?.myEarnings ? Number(stats.myEarnings).toLocaleString() : '0'}</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.averageRating ?? 0}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    {stats?.totalReviews ?? 0} reviews
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.myBookings ?? 0}</p>
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
              {revenueData.length === 0 ? (
                <div className="text-gray-400 text-center w-full">No data</div>
              ) : revenueData.map((data, index) => (
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
                {recentBookings.length === 0 ? (
                  <div className="text-gray-400 text-center">No recent bookings</div>
                ) : recentBookings.map((booking) => (
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
                {properties.length === 0 ? (
                  <div className="text-gray-400 text-center">No properties</div>
                ) : properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{property.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{property.location}</p>
                        <div className="flex items-center mt-1 space-x-3">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">{property.rating} ({property.reviews})</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">• {property.bookings} bookings</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">• {property.category}</span>
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
        <div className="mt-8 p-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notifications</h2>
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
          <div className="relative h-80 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 p-3">
            {notifications.length === 0 ? (
              <div className="text-gray-400 text-center">No notifications</div>
            ) : (
              <div
                className="absolute left-0 top-0 w-full space-y-3"
                style={{
                  animation: notifications.length > 1
                    ? 'ownerNotificationsMarquee 30s linear infinite'
                    : undefined,
                }}
              >
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`w-full text-left flex items-center justify-between p-3 rounded-lg ${notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{notification.title}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </span>
                  </button>
                ))}

                {notifications.map((notification) => (
                  <button
                    key={`${notification.id}-clone`}
                    type="button"
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`w-full text-left flex items-center justify-between p-3 rounded-lg ${notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{notification.title}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </span>
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
