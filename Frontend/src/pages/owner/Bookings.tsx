import { useState } from 'react'
import { 
  Calendar, 
  MapPin, 
  Star, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Filter, 
  Search, 
  MessageSquare,
  FileText,
  Phone,
  Mail,
  Download
} from 'lucide-react'

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('all')

  const [bookings] = useState([
    {
      id: 1,
      property: 'Luxury Downtown Apartment',
      location: 'Kigali, Nyarugenge',
      image: '🏢',
      guest: 'John Smith',
      guestEmail: 'john.smith@email.com',
      guestPhone: '+1 (555) 123-4567',
      guestImage: 'JS',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      amount: 750,
      status: 'confirmed',
      guests: 2,
      bookingDate: '2024-03-01',
      paymentStatus: 'paid',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      specialRequests: 'Late check-in requested',
      propertyId: 1,
      messageCount: 2,
      rating: null,
      review: null,
      cancellationPolicy: 'Flexible',
      totalPaid: 750,
      balanceDue: 0
    },
    {
      id: 2,
      property: 'Beach House Paradise',
      location: 'Gisenyi, Rubavu',
      image: '🏖️',
      guest: 'Sarah Johnson',
      guestEmail: 'sarah.j@email.com',
      guestPhone: '+1 (555) 987-6543',
      guestImage: 'SJ',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      amount: 1250,
      status: 'pending',
      guests: 4,
      bookingDate: '2024-03-02',
      paymentStatus: 'pending',
      checkInTime: '4:00 PM',
      checkOutTime: '10:00 AM',
      specialRequests: null,
      propertyId: 2,
      messageCount: 0,
      rating: null,
      review: null,
      cancellationPolicy: 'Moderate',
      totalPaid: 250,
      balanceDue: 1000
    },
    {
      id: 3,
      property: 'Toyota RAV4 2022',
      location: 'Kigali, Kicukiro',
      image: '🚗',
      guest: 'Michael Brown',
      guestEmail: 'michael.b@email.com',
      guestPhone: '+1 (555) 456-7890',
      guestImage: 'MB',
      checkIn: '2024-02-10',
      checkOut: '2024-02-12',
      amount: 450,
      status: 'completed',
      guests: 2,
      bookingDate: '2024-02-01',
      paymentStatus: 'paid',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      specialRequests: 'Early check-in',
      propertyId: 3,
      messageCount: 1,
      rating: 5,
      review: 'Amazing cabin! Perfect for a weekend getaway. Host was very responsive.',
      cancellationPolicy: 'Strict',
      totalPaid: 450,
      balanceDue: 0
    },
    {
      id: 4,
      property: 'Modern Studio Loft',
      location: 'Kigali, Gasabo',
      image: '🏙️',
      guest: 'Emily Davis',
      guestEmail: 'emily.d@email.com',
      guestPhone: '+1 (555) 234-5678',
      guestImage: 'ED',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      amount: 800,
      status: 'cancelled',
      guests: 1,
      bookingDate: '2024-01-05',
      paymentStatus: 'refunded',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      specialRequests: null,
      propertyId: 4,
      messageCount: 0,
      rating: null,
      review: null,
      cancellationPolicy: 'Flexible',
      totalPaid: 800,
      balanceDue: 0,
      cancellationReason: 'Guest cancelled due to personal emergency',
      refundAmount: 800
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
      case 'partial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = 
      (activeTab === 'upcoming' && (booking.status === 'confirmed' || booking.status === 'pending')) ||
      (activeTab === 'completed' && booking.status === 'completed') ||
      (activeTab === 'cancelled' && booking.status === 'cancelled')
    
    const matchesSearch = searchTerm === '' || 
      booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ]

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings.filter(b => b.paymentStatus === 'paid' || b.paymentStatus === 'partial').reduce((sum, b) => sum + b.totalPaid, 0),
    pendingRevenue: bookings.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0)
  }

  const handleBookingAction = (bookingId: number, action: string) => {
    console.log(`Booking ${bookingId}: ${action}`)
    // In a real app, this would call an API to perform the action
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Booking Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all your property reservations and guest communications
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcoming}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(stats.totalRevenue / 1000).toFixed(1)}k
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(stats.pendingRevenue / 1000).toFixed(1)}k
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by property, location, guest, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
            
            <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
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
              {activeTab === 'upcoming' && 'You have no upcoming reservations.'}
              {activeTab === 'completed' && 'You haven\'t completed any stays yet.'}
              {activeTab === 'cancelled' && 'You have no cancelled bookings.'}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Property & Guest Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      {booking.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {booking.property}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {booking.location}
                      </p>
                      
                      {/* Guest Info */}
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-300">
                            {booking.guestImage}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.guest}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {booking.guestEmail}
                            </span>
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {booking.guestPhone}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {booking.guests} guests
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {calculateNights(booking.checkIn, booking.checkOut)} nights
                        </div>
                        {booking.specialRequests && (
                          <div className="flex items-center text-orange-600 dark:text-orange-400">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Special requests
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
                        ${booking.amount}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      {(booking.totalPaid > 0 || booking.balanceDue > 0) && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Paid: ${booking.totalPaid} • Due: ${booking.balanceDue}
                        </div>
                      )}
                    </div>

                    <div className="text-center lg:text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dates</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.checkIn}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        to {booking.checkOut}
                      </p>
                    </div>

                    <div className="text-center lg:text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        {booking.messageCount > 0 && (
                          <span className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {booking.messageCount} messages
                          </span>
                        )}
                        {booking.rating && (
                          <span className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {booking.rating}/5
                          </span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleBookingAction(booking.id, 'accept')}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded font-medium transition-colors"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleBookingAction(booking.id, 'decline')}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <>
                            <button className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded font-medium transition-colors">
                              Contact Guest
                            </button>
                            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              View Details
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'completed' && (
                          <>
                            <button className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded font-medium transition-colors">
                              View Review
                            </button>
                            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              Book Again
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'cancelled' && (
                          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Check-in</p>
                          <p>{booking.checkInTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Check-out</p>
                          <p>{booking.checkOutTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FileText className="w-4 h-4 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Policy</p>
                          <p>{booking.cancellationPolicy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review */}
                {booking.review && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Guest Review</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                            {booking.rating}/5
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        "{booking.review}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancellation Details */}
                {booking.status === 'cancelled' && booking.cancellationReason && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Cancellation Reason</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {booking.cancellationReason}
                      </p>
                      {booking.refundAmount && (
                        <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                          Refund Amount: ${booking.refundAmount}
                        </p>
                      )}
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
