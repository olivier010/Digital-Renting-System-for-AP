import { useState } from 'react'
import { CreditCard, DollarSign, Download, Filter, Search, FileText, CheckCircle, AlertCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react'

const Payments = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('all')

  const [payments] = useState([
    {
      id: 1,
      type: 'booking_payment',
      description: 'Luxury Downtown Apartment - Mar 15-18',
      amount: 750,
      status: 'completed',
      date: '2024-03-01',
      paymentMethod: 'credit_card',
      cardType: 'Visa',
      cardLast4: '4242',
      bookingId: 1,
      property: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      host: 'John Smith',
      invoiceId: 'INV-2024-001',
      refundable: false
    },
    {
      id: 2,
      type: 'booking_payment',
      description: 'Beach House Paradise - Mar 20-25',
      amount: 1250,
      status: 'completed',
      date: '2024-03-02',
      paymentMethod: 'credit_card',
      cardType: 'Mastercard',
      cardLast4: '5555',
      bookingId: 2,
      property: 'Beach House Paradise',
      location: 'Miami, FL',
      host: 'Sarah Johnson',
      invoiceId: 'INV-2024-002',
      refundable: false
    },
    {
      id: 3,
      type: 'security_deposit',
      description: 'Security Deposit - Mountain View Cabin',
      amount: 200,
      status: 'refunded',
      date: '2024-02-15',
      paymentMethod: 'credit_card',
      cardType: 'Visa',
      cardLast4: '4242',
      bookingId: 3,
      property: 'Mountain View Cabin',
      location: 'Aspen, CO',
      host: 'Michael Brown',
      invoiceId: 'INV-2024-003',
      refundable: true,
      refundDate: '2024-02-14',
      refundAmount: 200
    },
    {
      id: 4,
      type: 'booking_payment',
      description: 'Urban Studio Loft - Jan 15-20',
      amount: 800,
      status: 'refunded',
      date: '2024-01-05',
      paymentMethod: 'credit_card',
      cardType: 'Mastercard',
      cardLast4: '5555',
      bookingId: 4,
      property: 'Urban Studio Loft',
      location: 'Chicago, IL',
      host: 'David Wilson',
      invoiceId: 'INV-2024-004',
      refundable: true,
      refundDate: '2024-01-18',
      refundAmount: 800,
      refundReason: 'Host cancelled due to maintenance'
    },
    {
      id: 5,
      type: 'service_fee',
      description: 'Service Fee - Beach House Paradise',
      amount: 125,
      status: 'completed',
      date: '2024-03-02',
      paymentMethod: 'credit_card',
      cardType: 'Mastercard',
      cardLast4: '5555',
      bookingId: 2,
      property: 'Beach House Paradise',
      location: 'Miami, FL',
      host: 'Platform',
      invoiceId: 'INV-2024-005',
      refundable: false
    }
  ])

  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'credit_card',
      cardType: 'Visa',
      cardLast4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      brand: 'Visa'
    },
    {
      id: 2,
      type: 'credit_card',
      cardType: 'Mastercard',
      cardLast4: '5555',
      expiryMonth: 8,
      expiryYear: 2024,
      isDefault: false,
      brand: 'Mastercard'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      case 'refunded': return <TrendingDown className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking_payment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'security_deposit': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'service_fee': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'refund': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCardIcon = (cardType: string) => {
    switch (cardType.toLowerCase()) {
      case 'visa': return '💳'
      case 'mastercard': return '💳'
      case 'amex': return '💳'
      default: return '💳'
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesTab = 
      (activeTab === 'all') ||
      (activeTab === 'completed' && payment.status === 'completed') ||
      (activeTab === 'refunded' && payment.status === 'refunded') ||
      (activeTab === 'pending' && payment.status === 'pending')
    
    const matchesSearch = searchTerm === '' || 
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const tabs = [
    { id: 'all', label: 'All Payments', count: payments.length },
    { id: 'completed', label: 'Completed', count: payments.filter(p => p.status === 'completed').length },
    { id: 'refunded', label: 'Refunded', count: payments.filter(p => p.status === 'refunded').length },
    { id: 'pending', label: 'Pending', count: payments.filter(p => p.status === 'pending').length }
  ]

  const totalSpent = payments
    .filter(p => p.status === 'completed' && p.type !== 'refund')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunded = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + (p.refundAmount || p.amount), 0)

  const netSpent = totalSpent - totalRefunded

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track all your payments, refunds, and transaction history
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                All time
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Refunded</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${totalRefunded.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {payments.filter(p => p.status === 'refunded').length} refunds
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Spent</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${netSpent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                After refunds
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Methods</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {paymentMethods.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Saved cards
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
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
              placeholder="Search payments..."
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

      {/* Payment Methods Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
          <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
            Add New Card
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCardIcon(method.cardType)}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {method.cardType} •••• {method.cardLast4}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {method.isDefault && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                    Default
                  </span>
                )}
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No payments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No payments match the selected criteria'}
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Payment Info */}
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {payment.type === 'booking_payment' && <DollarSign className="w-6 h-6 text-blue-600" />}
                      {payment.type === 'security_deposit' && <CreditCard className="w-6 h-6 text-yellow-600" />}
                      {payment.type === 'service_fee' && <FileText className="w-6 h-6 text-purple-600" />}
                      {payment.type === 'refund' && <TrendingDown className="w-6 h-6 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {payment.description}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(payment.type)}`}>
                          {payment.type.replace('_', ' ')}
                        </span>
                        <span>Invoice: {payment.invoiceId}</span>
                        {payment.bookingId && <span>Booking ID: #{payment.bookingId}</span>}
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>{payment.property} • {payment.location}</p>
                        <p>Host: {payment.host}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                  <div className="text-center lg:text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                    <p className={`text-2xl font-bold ${
                      payment.status === 'refunded' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {payment.status === 'refunded' ? '-' : ''}${payment.amount}
                    </p>
                    {payment.refundAmount && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Refunded: ${payment.refundAmount}
                      </p>
                    )}
                  </div>

                  <div className="text-center lg:text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {payment.date}
                    </p>
                    {payment.refundDate && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Refunded: {payment.refundDate}
                      </p>
                    )}
                  </div>

                  <div className="text-center lg:text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-center lg:text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCardIcon(payment.cardType)}</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {payment.cardType} •••• {payment.cardLast4}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm">
                      View Invoice
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {payment.refundReason && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Refund Reason:</span> {payment.refundReason}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Payments
