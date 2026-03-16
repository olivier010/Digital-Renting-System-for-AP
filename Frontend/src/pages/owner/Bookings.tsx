
import { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, Search, Filter, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

type OwnerBooking = import('../../types').Booking & {
  propertyName?: string;
  propertyStatus?: string;
  propertyLocation?: string;
  propertyImages?: string[];
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  paymentStatus?: string;
};

const Bookings = () => {
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [statusEditId, setStatusEditId] = useState<string | null>(null);
  const [statusEditLoading, setStatusEditLoading] = useState(false);
  const statusModalRef = useRef<HTMLDivElement | null>(null);
    // Close modal on outside click or Escape
    useEffect(() => {
      if (!statusEditId) return;
      const handleClick = (e: MouseEvent) => {
        if (statusModalRef.current && !statusModalRef.current.contains(e.target as Node)) {
          setStatusEditId(null);
        }
      };
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setStatusEditId(null);
      };
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKey);
      return () => {
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('keydown', handleKey);
      };
    }, [statusEditId]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('rentwise_token');
        if (!token) {
          setError('You must be logged in as an owner.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/owner/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch bookings.');
          setLoading(false);
          return;
        }
        // API returns { success, data: { content: [...] } }
        const apiBookings = data.data?.content || [];
        setBookings(apiBookings.map((b: any) => ({
          id: b.id,
          propertyId: b.property?.id?.toString() || b.propertyId,
          propertyName: b.property?.title || '',
          propertyStatus: b.property?.status || '',
          propertyLocation: b.property?.location || '',
          propertyImages: Array.isArray(b.property?.images)
            ? b.property.images.map((img: string) => img.startsWith('http') ? img : `http://localhost:8080${img}`)
            : [],
          tenantId: b.renter?.id?.toString() || b.tenantId,
          tenantName: b.renter?.name || '',
          tenantEmail: b.renter?.email || '',
          tenantPhone: b.renter?.phone || '',
          startDate: b.startDate,
          endDate: b.endDate,
          totalPrice: Number(b.totalPrice),
          status: b.status?.toLowerCase() || 'pending',
          paymentStatus: b.paymentStatus?.toLowerCase() || '',
        })));
        setLoading(false);
      } catch (err) {
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Status helpers
  const getStatusColor = (status: OwnerBooking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  const getStatusIcon = (status: OwnerBooking['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Payment status (dummy, as owner may not have this, but for parity)
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Status list for dropdown
  const statusList = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'completed', label: 'Completed' },
  ];
  // Only status options for update (not 'all')
  const statusUpdateOptions = [
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'completed', label: 'Completed' },
  ];


  // Filter bookings for the selected status and search
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus =
      activeTab === 'all' ? true : booking.status === activeTab;
    const matchesSearch = searchTerm === '' ||
      (booking.propertyId && booking.propertyId.toString().includes(searchTerm)) ||
      (booking.tenantId && booking.tenantId.toString().includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-600 dark:text-gray-300">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Property Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage all bookings for your properties.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total</span>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{bookings.length}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Confirmed</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">{bookings.filter(b => b.status === 'confirmed').length}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pending</span>
          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{bookings.filter(b => b.status === 'pending').length}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Cancelled</span>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{bookings.filter(b => b.status === 'cancelled').length}</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by property or tenant ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Status Dropdown */}
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setStatusDropdownOpen((open) => !open)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {statusList.find(s => s.id === activeTab)?.label || 'Status'}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {statusList.map((status) => (
                  <button
                    key={status.id}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === status.id ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''}`}
                    onClick={() => { setActiveTab(status.id as any); setStatusDropdownOpen(false); }}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No {activeTab} bookings</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'pending' && 'You have no pending bookings.'}
              {activeTab === 'confirmed' && 'You have no confirmed bookings.'}
              {activeTab === 'cancelled' && 'You have no cancelled bookings.'}
              {activeTab === 'completed' && 'You have no completed bookings.'}
              {activeTab === 'all' && 'No bookings found.'}
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
                      {booking.propertyImages && booking.propertyImages.length > 0 ? (
                        <img
                          src={booking.propertyImages[0]}
                          alt={booking.propertyName || `Property #${booking.propertyId}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold">🏠</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {booking.propertyName || `Property #${booking.propertyId}`}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                          Status: {booking.propertyStatus || 'N/A'}
                        </span>
                        {booking.propertyLocation && (
                          <span className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                            {booking.propertyLocation}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div>Renter: <span className="text-gray-900 dark:text-white">{booking.tenantName || `#${booking.tenantId}`}</span></div>
                        <div>Email: <span className="text-gray-900 dark:text-white">{booking.tenantEmail || 'N/A'}</span></div>
                        <div>Phone: <span className="text-gray-900 dark:text-white">{booking.tenantPhone || 'N/A'}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details and Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    {/* Only show check-in and check-out in details below, not here */}
                    <div className="text-center lg:text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${booking.totalPrice}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus || 'paid')}`}>{booking.paymentStatus || 'paid'}</span>
                    </div>

                    <div className="text-center lg:text-left relative">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                      <div className="flex items-center space-x-2">
                        <button
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)} focus:outline-none`}
                          onClick={() => setStatusEditId(statusEditId === booking.id ? null : booking.id)}
                          disabled={statusEditLoading}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </button>
                        {statusEditId === booking.id && (
                          <>
                            {/* Modal Backdrop */}
                            <div className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity animate-fadeIn" />
                            {/* Modal Content */}
                            <div
                              ref={statusModalRef}
                              className="fixed inset-0 z-50 flex items-center justify-center px-4"
                            >
                              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-xs p-4 animate-modalPop">
                                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white text-center">Change Booking Status</h3>
                                <div className="flex flex-col gap-2">
                                  {statusUpdateOptions.map(option => (
                                    <button
                                      key={option.id}
                                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-gray-900 dark:text-white ${booking.status === option.id ? 'bg-gray-100 dark:bg-gray-700 font-semibold cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${statusEditLoading ? 'opacity-60' : ''}`}
                                      disabled={statusEditLoading || booking.status === option.id}
                                      onClick={async () => {
                                        setStatusEditLoading(true);
                                        try {
                                          const token = localStorage.getItem('rentwise_token');
                                          if (!token) return;
                                          const res = await fetch(`${API_BASE_URL}/bookings/${booking.id}`, {
                                            method: 'PUT',
                                            headers: {
                                              'Authorization': `Bearer ${token}`,
                                              'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                              ...booking,
                                              status: option.id.toUpperCase(),
                                            }),
                                          });
                                          if (res.ok) {
                                            setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: option.id as OwnerBooking['status'] } : b));
                                            setStatusEditId(null);
                                          }
                                        } finally {
                                          setStatusEditLoading(false);
                                        }
                                      }}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  className="mt-4 w-full py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                  onClick={() => setStatusEditId(null)}
                                  disabled={statusEditLoading}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                            {/* Animations */}
                            <style>{`
                              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                              .animate-fadeIn { animation: fadeIn 0.2s; }
                              @keyframes modalPop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                              .animate-modalPop { animation: modalPop 0.18s cubic-bezier(0.4,0,0.2,1); }
                            `}</style>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Modern actions */}
                    <div className="flex flex-col space-y-2">
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Contact Tenant</button>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Check-in</p>
                        <p>{booking.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Check-out</p>
                        <p>{booking.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
