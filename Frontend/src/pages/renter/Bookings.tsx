import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import { Calendar, MapPin, Users, CheckCircle, XCircle, AlertCircle, Filter, Search } from 'lucide-react'

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [searchTerm, setSearchTerm] = useState('')

  const [bookings, setBookings] = useState<any[]>([])
  // Removed unused loading and error state

  useEffect(() => {
    const fetchBookings = async () => {
      // Get renterId from token or user context (for now, try from localStorage)
      const userStr = localStorage.getItem('rentwise_user')
      const user = userStr ? JSON.parse(userStr) : null
      const renterId = user?.id
      const token = localStorage.getItem('rentwise_token')
      console.log('User:', user)
      console.log('Token:', token)
      if (!renterId) {
        console.error('No renterId found in user object')
        return
      }
      try {
        // Use the correct endpoint as per backend: /api/renter/bookings
        const res = await apiFetch('/renter/bookings')
        console.log('Bookings API response:', res)
        if (Array.isArray(res.data?.content) && res.data.content.length > 0) {
          console.log('First booking object:', res.data.content[0])
        }
        setBookings(res.data?.content || [])
      } catch (err) {
        console.error('Error fetching bookings:', err)
        setBookings([])
      }
    }
    fetchBookings()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    // Backend status and paymentStatus are uppercase
    const status = booking.status?.toLowerCase() || '';
    const matchesTab = 
      (activeTab === 'upcoming' && (status === 'confirmed' || status === 'pending')) ||
      (activeTab === 'completed' && status === 'completed') ||
      (activeTab === 'cancelled' && status === 'cancelled');

    const propertyTitle = booking.property?.title || '';
    const propertyLocation = booking.property?.location || '';
    const matchesSearch = searchTerm === '' || 
      propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyLocation.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => {
      const status = b.status?.toLowerCase() || '';
      return status === 'confirmed' || status === 'pending';
    }).length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => (b.status?.toLowerCase() || '') === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => (b.status?.toLowerCase() || '') === 'cancelled').length }
  ];

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all your property reservations and bookings
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by property name or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'upcoming' && 'You have no upcoming reservations. Book a property to get started!'}
              {activeTab === 'completed' && 'You haven\'t completed any stays yet.'}
              {activeTab === 'cancelled' && 'You have no cancelled bookings.'}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Property Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                      {booking.property?.image ? (
                        <img
                          src={
                            booking.property.image && !booking.property.image.startsWith('http')
                              ? `http://localhost:8080${booking.property.image}`
                              : booking.property.image
                          }
                          alt={booking.property.title}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      ) : (
                        <MapPin className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {booking.property?.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {booking.property?.location}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {/* Guests info not available in backend, so skip or show placeholder */}
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {calculateNights(booking.startDate, booking.endDate)} nights
                        </div>
                        {booking.specialRequests && (
                          <div className="flex items-center text-orange-600 dark:text-orange-400">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Special requests: {booking.specialRequests}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <div className="text-center lg:text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${booking.totalPrice}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor((booking.paymentStatus || '').toLowerCase())}`}>
                        {(booking.paymentStatus || '').toLowerCase()}
                      </span>
                    </div>

                    <div className="text-center lg:text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dates</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.startDate}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        to {booking.endDate}
                      </p>
                    </div>

                    <div className="text-center lg:text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor((booking.status || '').toLowerCase())}`}>
                          {getStatusIcon((booking.status || '').toLowerCase())}
                          <span className="ml-1">{(booking.status || '').toLowerCase()}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {booking.status === 'confirmed' && (
                        <>
                          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                            View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Contact Host
                          </button>
                        </>
                      )}

                      {/* Rating is not in backend response, so skip for now */}

                      {booking.status === 'cancelled' && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.cancellationReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Host</p>
                          <p>{booking.property?.ownerName}</p>
                        </div>
                      </div>
                      {/* Check-in/out times not available in backend, so skip */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Bookings
