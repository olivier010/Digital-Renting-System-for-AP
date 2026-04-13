import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import { Calendar, MapPin, Users, CheckCircle, XCircle, AlertCircle, Filter, Search, ChevronDown, ChevronUp, Clock, Eye } from 'lucide-react'

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null)
  const [cancelMessage, setCancelMessage] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<any | null>(null)
  const [cancelReasonInput, setCancelReasonInput] = useState('')

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
      default: return 'bg-surface-100 text-gray-800 dark:bg-surface-900 dark:text-surface-200'
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
      default: return 'bg-surface-100 text-gray-800 dark:bg-surface-900 dark:text-surface-200'
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

  // Toggle card expansion (independent for each card)
  const toggleCardExpansion = (bookingId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const openCancelModal = (booking: any) => {
    setCancelMessage(null)
    setSelectedBookingForCancel(booking)
    setCancelReasonInput('')
    setShowCancelModal(true)
  }

  const closeCancelModal = () => {
    setShowCancelModal(false)
    setSelectedBookingForCancel(null)
    setCancelReasonInput('')
  }

  const handleCancelBooking = async () => {
    if (!selectedBookingForCancel) return
    setCancelMessage(null)
    const reason = cancelReasonInput.trim()
    setCancellingBookingId(Number(selectedBookingForCancel.id))

    try {
      const response = await apiFetch(`/renter/bookings/${selectedBookingForCancel.id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ cancellationReason: reason })
      })

      const updated = response?.data
      setBookings((prev) =>
        prev.map((item) =>
          item.id === selectedBookingForCancel.id
            ? {
                ...item,
                status: updated?.status || 'CANCELLED',
                cancellationReason: updated?.cancellationReason || reason || item.cancellationReason
              }
            : item
        )
      )

      setCancelMessage('Booking cancelled successfully.')
      closeCancelModal()
    } catch (err) {
      setCancelMessage(err instanceof Error ? err.message : 'Failed to cancel booking')
    } finally {
      setCancellingBookingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          My Bookings
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Manage all your property reservations and bookings
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by property name or location..."
              className="w-full pl-10 pr-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-gray-300 dark:text-surface-400 dark:hover:text-surface-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-surface-500 dark:text-surface-400">
              {activeTab === 'upcoming' && 'You have no upcoming reservations. Book a property to get started!'}
              {activeTab === 'completed' && 'You haven\'t completed any stays yet.'}
              {activeTab === 'cancelled' && 'You have no cancelled bookings.'}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header - Always Visible */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-surface-200 dark:bg-surface-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                        <MapPin className="w-6 h-6 text-surface-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-surface-900 dark:text-white text-sm line-clamp-1 mb-1">
                        {booking.property?.title}
                      </h3>
                      <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{booking.property?.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor((booking.status || '').toLowerCase())}`}>
                      {getStatusIcon((booking.status || '').toLowerCase())}
                      <span className="ml-1">{(booking.status || '').toLowerCase()}</span>
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor((booking.paymentStatus || '').toLowerCase())}`}>
                      {(booking.paymentStatus || '').toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{calculateNights(booking.startDate, booking.endDate)} nights</span>
                  </div>
                  <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ${booking.totalPrice}
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleCardExpansion(booking.id)}
                  className="flex items-center justify-center w-full py-2 text-xs text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                  {expandedCards.has(booking.id) ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show More Details
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Details */}
              {expandedCards.has(booking.id) && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="pt-3 space-y-3">
                    {/* Dates */}
                    <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">Booking Dates</p>
                        <p className="text-xs">{booking.startDate} to {booking.endDate}</p>
                      </div>
                    </div>

                    {/* Host Info */}
                    {booking.property?.ownerName && (
                      <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white">Host</p>
                          <p className="text-xs">{booking.property.ownerName}</p>
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="flex items-start text-sm text-orange-600 dark:text-orange-400">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Special Requests</p>
                          <p className="text-xs">{booking.specialRequests}</p>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Reason */}
                    {(booking.status || '').toLowerCase() === 'cancelled' && booking.cancellationReason && (
                      <div className="flex items-start text-sm text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Cancellation Reason</p>
                          <p className="text-xs">{booking.cancellationReason}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      {(booking.status || '').toLowerCase() === 'confirmed' && (
                        <>
                          <button className="flex-1 flex justify-center items-center px-2 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg font-medium transition-colors whitespace-nowrap">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </button>
                          <button className="flex-1 px-3 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 text-xs rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                            Contact Host
                          </button>
                        </>
                      )}
                      {((booking.status || '').toLowerCase() === 'pending' || (booking.status || '').toLowerCase() === 'confirmed') && (booking.paymentStatus || '').toLowerCase() !== 'completed' && (
                        <button
                          onClick={() => openCancelModal(booking)}
                          disabled={cancellingBookingId === booking.id}
                          className="flex-1 px-3 py-2 border border-red-300 text-red-700 dark:text-red-300 dark:border-red-700 text-xs rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {cancelMessage && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
          {cancelMessage}
        </div>
      )}

      {showCancelModal && selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-surface-800">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Cancel Booking</h3>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              Are you sure you want to cancel booking #{selectedBookingForCancel.id}? You can add a reason below.
            </p>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Cancellation Reason (optional)
              </label>
              <textarea
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                rows={4}
                placeholder="Tell us why you are cancelling..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              />
            </div>

            <div className="mt-5 flex justify-end space-x-3">
              <button
                onClick={closeCancelModal}
                disabled={cancellingBookingId === selectedBookingForCancel.id}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 disabled:opacity-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-700"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancellingBookingId === selectedBookingForCancel.id}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancellingBookingId === selectedBookingForCancel.id ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings


