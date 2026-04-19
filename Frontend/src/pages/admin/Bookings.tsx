
import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import type { Booking } from '../../types'
import { 
  Calendar, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  // MapPin,
  Download,
  // MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from 'lucide-react'

const Bookings = () => {
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDateRange, setFilterDateRange] = useState('all')
  const [selectedBookings, setSelectedBookings] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(6)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiFetch(`/bookings?page=${currentPage - 1}&size=${bookingsPerPage}`)
      .then((data) => {
        // The backend returns { success, message, data: { content, ... } }
        setBookings((data.data && data.data.content) ? data.data.content : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch bookings')
        setLoading(false)
      })
  }, [currentPage, bookingsPerPage])

  const filteredBookings = bookings.filter(booking => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      String(booking.id).toLowerCase().includes(lowerSearch) ||
      booking.property?.title?.toLowerCase().includes(lowerSearch) ||
      booking.property?.location?.toLowerCase().includes(lowerSearch) ||
      booking.property?.ownerName?.toLowerCase().includes(lowerSearch) ||
      booking.renter?.name?.toLowerCase().includes(lowerSearch) ||
      booking.renter?.email?.toLowerCase().includes(lowerSearch);
    const matchesStatus = filterStatus === 'all' || booking.status?.toLowerCase() === filterStatus.toLowerCase();

    // Date range filter
    let matchesDateRange = true;
    if (filterDateRange !== 'all') {
      const today = new Date();
      const start = new Date(booking.startDate);
      switch (filterDateRange) {
        case 'today':
          matchesDateRange = start.toDateString() === today.toDateString();
          break;
        case 'week': {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDateRange = start >= weekStart && start <= weekEnd;
          break;
        }
        case 'month':
          matchesDateRange = start.getMonth() === today.getMonth() && start.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDateRange = start.getFullYear() === today.getFullYear();
          break;
        default:
          matchesDateRange = true;
      }
    }
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-surface-100 text-gray-800 dark:bg-surface-700 dark:text-surface-200'
    }
  }



  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length,
    pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
    cancelled: bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length,
    completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length,
    totalRevenue: bookings.filter(b => b.status?.toLowerCase() === 'completed' || b.status?.toLowerCase() === 'confirmed').reduce((sum, b) => sum + Number(b.totalPrice), 0),
    pendingRevenue: bookings.filter(b => b.status?.toLowerCase() === 'pending').reduce((sum, b) => sum + Number(b.totalPrice), 0),
    issues: 0 // Not in Booking type, set to 0 or implement if needed
  }

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(filteredBookings.map(b => Number(b.id)))
    }
  }

  const handleSelectBooking = (bookingId: number) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-surface-500 dark:text-surface-400">Loading bookings...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-red-500 dark:text-red-400">{error}</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Booking Management
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Monitor and manage all booking transactions across the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400">Total Bookings</p>
              <p className="text-lg font-bold text-surface-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-md">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400">Confirmed</p>
              <p className="text-lg font-bold text-surface-900 dark:text-white">{stats.confirmed}</p>
            </div>
            <div className="p-1 bg-green-100 dark:bg-green-900 rounded-md">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400">Pending</p>
              <p className="text-lg font-bold text-surface-900 dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-1 bg-yellow-100 dark:bg-yellow-900 rounded-md">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400">Completed</p>
              <p className="text-lg font-bold text-surface-900 dark:text-white">{stats.completed}</p>
            </div>
            <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded-md">
              <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-3 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400">Total Revenue</p>
              <p className="text-lg font-bold text-surface-900 dark:text-white break-words max-w-[120px]">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-1 bg-green-100 dark:bg-green-900 rounded-md">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
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
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 dark:bg-surface-700">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-surface-200 dark:border-surface-600"
                  />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Booking No</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Property</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Owner</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Renter</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Dates</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Payment</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(Number(booking.id))}
                      onChange={() => handleSelectBooking(Number(booking.id))}
                      className="rounded border-surface-200 dark:border-surface-600"
                    />
                  </td>
                  {/* Booking No */}
                  <td className="px-3 py-2">
                    <div className="text-xs font-medium text-surface-900 dark:text-white">
                      BK{String(booking.id).padStart(4, '0')}
                    </div>
                  </td>
                  {/* Property */}
                  <td className="px-3 py-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-surface-200 dark:bg-surface-700 rounded flex items-center justify-center mr-2 overflow-hidden">
                        {booking.property?.image ? (
                          <img
                            src={booking.property.image.startsWith('http') ? booking.property.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${booking.property.image}`}
                            alt="property"
                            className="w-6 h-6 object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs">🏠</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-surface-900 dark:text-white truncate max-w-32">
                          {booking.property?.title}
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center">
                          {booking.property?.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Owner */}
                  <td className="px-3 py-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          {booking.property?.ownerName ? booking.property.ownerName.split(' ').map((n: string) => n[0]).join('') : '?'}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-surface-900 dark:text-white">
                          {booking.property?.ownerName}
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-400 truncate max-w-24">
                          ID: {booking.property?.ownerId}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Renter */}
                  <td className="px-3 py-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                          {booking.renter?.name ? booking.renter.name.split(' ').map((n: string) => n[0]).join('') : '?'}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-surface-900 dark:text-white">
                          {booking.renter?.name}
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-400 truncate max-w-24">
                          {booking.renter?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Dates */}
                  <td className="px-3 py-2">
                    <div className="text-xs">
                      <div className="font-medium text-surface-900 dark:text-white">
                        {booking.startDate}
                      </div>
                      <div className="text-surface-500 dark:text-surface-400">
                        to {booking.endDate}
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-3 py-2">
                    <div className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(booking.status?.toLowerCase?.() || '')}`}> 
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </div>
                  </td>
                  {/* Payment */}
                  <td className="px-3 py-2">
                    <div className="text-xs">
                      <div className="font-medium text-surface-900 dark:text-white">
                        ${Number(booking.totalPrice).toLocaleString()}
                      </div>
                      <div className={`inline-flex px-1 py-0.5 text-xs font-medium rounded-full ${getStatusColor(booking.paymentStatus?.toLowerCase?.() || '')}`}>
                        {booking.paymentStatus?.toLowerCase?.()}
                      </div>
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <button className="p-0.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300" onClick={() => setViewBooking(booking)}>
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-0.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
                        <FileText className="w-3 h-3" />
                      </button>
                      {booking.status?.toLowerCase() === 'pending' && (
                        <button className="p-0.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                          <CheckCircle className="w-3 h-3" />
                        </button>
                      )}
                      {booking.status?.toLowerCase() === 'confirmed' && (
                        <button className="p-0.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                          <XCircle className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                            {/* Booking Details Modal - move outside table to avoid <div> in <tr> hydration error */}
                            {viewBooking && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white dark:bg-surface-800 rounded-lg shadow-soft dark:shadow-dark-soft max-w-lg w-full p-6 relative">
                                  <button className="absolute top-2 right-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300" onClick={() => setViewBooking(null)}>
                                    <span className="text-2xl">&times;</span>
                                  </button>
                                  <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Booking Details</h2>
                                  <div className="space-y-2 text-sm text-surface-900 dark:text-white">
                                    <div><span className="font-medium text-surface-900 dark:text-white">Booking No:</span> BK{String(viewBooking.id).padStart(4, '0')}</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Status:</span> {viewBooking.status}</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Payment Status:</span> {viewBooking.paymentStatus}</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Property:</span> {viewBooking.property?.title} ({viewBooking.property?.location})</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Owner:</span> {viewBooking.property?.ownerName} (ID: {viewBooking.property?.ownerId})</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Renter:</span> {viewBooking.renter?.name} ({viewBooking.renter?.email})</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Dates:</span> {viewBooking.startDate} to {viewBooking.endDate}</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Total Price:</span> ${Number(viewBooking.totalPrice).toLocaleString()}</div>
                                    {viewBooking.specialRequests && <div><span className="font-medium text-surface-900 dark:text-white">Special Requests:</span> {viewBooking.specialRequests}</div>}
                                    {viewBooking.cancellationReason && <div><span className="font-medium text-surface-900 dark:text-white">Cancellation Reason:</span> {viewBooking.cancellationReason}</div>}
                                    <div><span className="font-medium text-surface-900 dark:text-white">Created At:</span> {viewBooking.createdAt}</div>
                                    <div><span className="font-medium text-surface-900 dark:text-white">Updated At:</span> {viewBooking.updatedAt}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-surface-200 dark:border-surface-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-surface-700 dark:text-surface-300">
                Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, filteredBookings.length)} of{' '}
                {filteredBookings.length} bookings
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 border border-surface-200 dark:border-surface-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-700"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-xs text-surface-700 dark:text-surface-300 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 border border-surface-200 dark:border-surface-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-700"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings


