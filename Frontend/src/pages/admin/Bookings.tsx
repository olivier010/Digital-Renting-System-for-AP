import { useState } from 'react'
import { 
  Calendar, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  MapPin,
  Download,
  MessageSquare,
  FileText
} from 'lucide-react'

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDateRange, setFilterDateRange] = useState('all')
  const [selectedBookings, setSelectedBookings] = useState<number[]>([])

  const [bookings] = useState([
    {
      id: 'BK001',
      property: {
        id: 1,
        title: 'Luxury Downtown Apartment',
        location: 'New York, NY',
        image: '🏢'
      },
      guest: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'JD'
      },
      owner: {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: 'JS'
      },
      status: 'confirmed',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      totalPrice: 1250,
      nights: 5,
      guests: 2,
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      bookingDate: '2024-03-15',
      specialRequests: 'Early check-in requested if possible',
      reviewed: false,
      issues: false
    },
    {
      id: 'BK002',
      property: {
        id: 2,
        title: 'Cozy Beach House',
        location: 'Miami, FL',
        image: '🏖️'
      },
      guest: {
        id: 3,
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        avatar: 'AB'
      },
      owner: {
        id: 4,
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        avatar: 'BW'
      },
      status: 'pending',
      checkIn: '2024-03-22',
      checkOut: '2024-03-24',
      totalPrice: 700,
      nights: 2,
      guests: 4,
      paymentStatus: 'pending',
      paymentMethod: 'paypal',
      bookingDate: '2024-03-16',
      specialRequests: 'Bringing a small dog',
      reviewed: false,
      issues: false
    },
    {
      id: 'BK003',
      property: {
        id: 3,
        title: 'Mountain View Cabin',
        location: 'Aspen, CO',
        image: '🏔️'
      },
      guest: {
        id: 5,
        name: 'Charlie Wilson',
        email: 'charlie.wilson@example.com',
        avatar: 'CW'
      },
      owner: {
        id: 6,
        name: 'Diana Martinez',
        email: 'diana.martinez@example.com',
        avatar: 'DM'
      },
      status: 'cancelled',
      checkIn: '2024-03-18',
      checkOut: '2024-03-21',
      totalPrice: 1350,
      nights: 3,
      guests: 2,
      paymentStatus: 'refunded',
      paymentMethod: 'credit_card',
      bookingDate: '2024-03-10',
      specialRequests: '',
      reviewed: false,
      issues: true
    },
    {
      id: 'BK004',
      property: {
        id: 4,
        title: 'Urban Studio Loft',
        location: 'Chicago, IL',
        image: '🏙️'
      },
      guest: {
        id: 7,
        name: 'Diana Martinez',
        email: 'diana.martinez@example.com',
        avatar: 'DM'
      },
      owner: {
        id: 8,
        name: 'Eva Davis',
        email: 'eva.davis@example.com',
        avatar: 'ED'
      },
      status: 'completed',
      checkIn: '2024-03-10',
      checkOut: '2024-03-15',
      totalPrice: 600,
      nights: 5,
      guests: 1,
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      bookingDate: '2024-03-05',
      specialRequests: 'Late checkout on last day',
      reviewed: true,
      issues: false
    },
    {
      id: 'BK005',
      property: {
        id: 5,
        title: 'Suburban Family Home',
        location: 'Austin, TX',
        image: '🏡'
      },
      guest: {
        id: 9,
        name: 'Frank Miller',
        email: 'frank.miller@example.com',
        avatar: 'FM'
      },
      owner: {
        id: 10,
        name: 'Grace Lee',
        email: 'grace.lee@example.com',
        avatar: 'GL'
      },
      status: 'confirmed',
      checkIn: '2024-03-28',
      checkOut: '2024-04-02',
      totalPrice: 1750,
      nights: 5,
      guests: 6,
      paymentStatus: 'paid',
      paymentMethod: 'bank_transfer',
      bookingDate: '2024-03-14',
      specialRequests: 'Need baby crib',
      reviewed: false,
      issues: false
    }
  ])

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesDateRange = filterDateRange === 'all' || filterDateRange === filterDateRange
    
    return matchesSearch && matchesStatus && matchesDateRange
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0),
    pendingRevenue: bookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.totalPrice, 0),
    issues: bookings.filter(b => b.issues).length
  }

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(filteredBookings.map(b => parseInt(b.id.replace('BK', ''))))
    }
  }

  const handleSelectBooking = (bookingId: string) => {
    const numericId = parseInt(bookingId.replace('BK', ''))
    setSelectedBookings(prev => 
      prev.includes(numericId) 
        ? prev.filter(id => id !== numericId)
        : [...prev, numericId]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Booking Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage all booking transactions across the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {selectedBookings.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Approve Selected
              </button>
              <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                Cancel Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(parseInt(booking.id.replace('BK', '')))}
                      onChange={() => handleSelectBooking(booking.id)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Booked {booking.bookingDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">{booking.property.image}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.property.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {booking.property.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                          {booking.guest.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.guest.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.guests} guests
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {booking.checkIn}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        to {booking.checkOut}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {booking.nights} nights
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        ${booking.totalPrice.toLocaleString()}
                      </div>
                      <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.issues && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Issues
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FileText className="w-4 h-4" />
                      </button>
                      {booking.status === 'pending' && (
                        <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Bookings
