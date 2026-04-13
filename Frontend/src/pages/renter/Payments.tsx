import { useState, useEffect } from 'react'
import { CreditCard, DollarSign, Download, Filter, Search, FileText, CheckCircle, AlertCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { apiFetch } from '../../utils/api'
import PaymentInvoiceModal from '../../components/reports/PaymentInvoiceModal'
import { downloadPaymentInvoicePdf } from '../../components/reports/paymentInvoicePdf'
import { downloadPaymentsFullReportPdf } from '../../components/reports/paymentsFullReportPdf'

interface PaymentMethod {
  id: number
  brand: string
  last4: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
}

const Payments = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')

  const [payments, setPayments] = useState<any[]>([])
  const [pendingBookings, setPendingBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [processingPaymentId, setProcessingPaymentId] = useState<number | null>(null)
  const [paymentActionMessage, setPaymentActionMessage] = useState<string | null>(null)
  const [newCard, setNewCard] = useState({
    brand: 'VISA',
    last4: '',
    expiryMonth: '',
    expiryYear: ''
  })

  useEffect(() => {
    setLoading(true)
    Promise.all([
      apiFetch('/payments?page=0&size=100'),
      apiFetch('/renter/bookings')
    ])
      .then(([paymentsRes, bookingsRes]) => {
        // Payments
        const items = paymentsRes?.data?.content || []
        setPayments(items.map((p: any) => ({
          id: p.id,
          type: (p.type || '').toLowerCase(),
          description: p.property?.title || '',
          amount: Number(p.amount),
          status: p.status?.toLowerCase(),
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
          createdAt: p.createdAt,
          paymentMethod: p.method,
          cardType: p.method === 'CREDIT_CARD' ? 'Credit Card' : (p.method || ''),
          cardLast4: p.cardLastFour,
          bookingId: p.bookingId,
          property: p.property?.title || '',
          location: p.property?.location || '',
          host: '', // Not available in backend response
          invoiceId: p.invoiceId,
          refundable: !!p.refundAmount,
          refundDate: p.refundDate ? new Date(p.refundDate).toLocaleDateString() : '',
          refundAmount: p.refundAmount ? Number(p.refundAmount) : undefined,
          refundReason: p.refundReason,
        })))
        // Pending bookings
        const bookings = bookingsRes?.data?.content || []
        setPendingBookings(
          bookings
            .filter((b: any) => 
              b.status?.toLowerCase() === 'confirmed' &&
              b.paymentStatus?.toLowerCase() === 'pending'
            )
            .map((b: any) => ({
              id: b.id,
              type: 'booking_payment',
              description: b.property?.title || '',
              amount: Number(b.totalPrice),
              status: 'pending',
              date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '',
              createdAt: b.createdAt,
              paymentMethod: '',
              cardType: '',
              cardLast4: '',
              bookingId: b.id,
              property: b.property?.title || '',
              location: b.property?.location || '',
              host: '',
              invoiceId: '',
              refundable: false,
              refundDate: '',
              refundAmount: undefined,
              refundReason: '',
              isBooking: true
            }))
        )
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load payments/bookings')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const loadPaymentMethods = async () => {
      setIsLoadingPaymentMethods(true)
      try {
        const response = await apiFetch('/payment-methods')
        const methods = (response?.data ?? []) as PaymentMethod[]
        setPaymentMethods(Array.isArray(methods) ? methods : [])
      } catch {
        setPaymentMethods([])
      } finally {
        setIsLoadingPaymentMethods(false)
      }
    }

    void loadPaymentMethods()
  }, [])

  const handleAddCard = async () => {
    if (!newCard.last4 || newCard.last4.length !== 4 || !newCard.expiryMonth || !newCard.expiryYear) {
      return
    }

    const cleanLast4 = newCard.last4.replace(/\D/g, '').slice(-4)
    if (cleanLast4.length !== 4) {
      return
    }

    setIsAddingCard(true)
    try {
      const response = await apiFetch('/payment-methods', {
        method: 'POST',
        body: JSON.stringify({
          brand: newCard.brand,
          last4: cleanLast4,
          expiryMonth: newCard.expiryMonth,
          expiryYear: newCard.expiryYear,
          isDefault: paymentMethods.length === 0
        })
      })

      const created = response?.data as PaymentMethod | undefined
      if (created) {
        setPaymentMethods(prev => [...prev.filter(card => !created.isDefault || !card.isDefault), created])
      }
      setNewCard({ brand: 'VISA', last4: '', expiryMonth: '', expiryYear: '' })
      setShowAddCardForm(false)
    } finally {
      setIsAddingCard(false)
    }
  }

  const handleDeleteCard = async (id: number) => {
    try {
      await apiFetch(`/payment-methods/${id}`, { method: 'DELETE' })
      setPaymentMethods(prev => {
        const next = prev.filter(card => card.id !== id)
        if (next.length > 0 && !next.some(card => card.isDefault)) {
          next[0] = { ...next[0], isDefault: true }
        }
        return next
      })
    } catch {
      // no-op
    }
  }

  const handleSetDefaultCard = async (id: number) => {
    try {
      await apiFetch(`/payment-methods/${id}/default`, { method: 'PATCH' })
      setPaymentMethods(prev =>
        prev.map(card => ({
          ...card,
          isDefault: card.id === id
        }))
      )
    } catch {
      // no-op
    }
  }

  const refreshPaymentsAndBookings = async () => {
    setLoading(true)
    try {
      const [paymentsRes, bookingsRes] = await Promise.all([
        apiFetch('/payments?page=0&size=100'),
        apiFetch('/renter/bookings')
      ])

      const items = paymentsRes?.data?.content || []
      setPayments(items.map((p: any) => ({
        id: p.id,
        type: (p.type || '').toLowerCase(),
        description: p.property?.title || '',
        amount: Number(p.amount),
        status: p.status?.toLowerCase(),
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
        createdAt: p.createdAt,
        paymentMethod: p.method,
        cardType: p.method === 'CREDIT_CARD' ? 'Credit Card' : (p.method || ''),
        cardLast4: p.cardLastFour,
        bookingId: p.bookingId,
        property: p.property?.title || '',
        location: p.property?.location || '',
        host: '',
        invoiceId: p.invoiceId,
        refundable: !!p.refundAmount,
        refundDate: p.refundDate ? new Date(p.refundDate).toLocaleDateString() : '',
        refundAmount: p.refundAmount ? Number(p.refundAmount) : undefined,
        refundReason: p.refundReason,
      })))

      const bookings = bookingsRes?.data?.content || []
      setPendingBookings(
        bookings
          .filter((b: any) => 
            b.status?.toLowerCase() === 'confirmed' &&
            b.paymentStatus?.toLowerCase() === 'pending'
          )
          .map((b: any) => ({
            id: b.id,
            type: 'booking_payment',
            description: b.property?.title || '',
            amount: Number(b.totalPrice),
            status: 'pending',
            date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '',
            createdAt: b.createdAt,
            paymentMethod: '',
            cardType: '',
            cardLast4: '',
            bookingId: b.id,
            property: b.property?.title || '',
            location: b.property?.location || '',
            host: '',
            invoiceId: '',
            refundable: false,
            refundDate: '',
            refundAmount: undefined,
            refundReason: '',
            isBooking: true
          }))
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePayNow = async (booking: any) => {
    setPaymentActionMessage(null)

    if (!paymentMethods.length) {
      setPaymentActionMessage('Add a payment method first to pay for this booking.')
      return
    }

    const defaultMethod = paymentMethods.find(method => method.isDefault) || paymentMethods[0]
    if (!defaultMethod) {
      setPaymentActionMessage('No valid payment method is available.')
      return
    }

    setProcessingPaymentId(booking.id)
    try {
      await apiFetch('/payments', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: booking.bookingId,
          type: 'BOOKING_PAYMENT',
          amount: booking.amount,
          method: defaultMethod.brand,
          cardLastFour: defaultMethod.last4
        })
      })

      setPaymentActionMessage(`Payment completed for booking #${booking.bookingId}.`)
      await refreshPaymentsAndBookings()
    } catch (payError) {
      setPaymentActionMessage(payError instanceof Error ? payError.message : 'Payment failed')
    } finally {
      setProcessingPaymentId(null)
    }
  }

  const handleViewInvoice = (payment: any) => {
    setSelectedInvoice(payment)
  }

  const handleCloseInvoice = () => {
    setSelectedInvoice(null)
  }

  const handleDownloadInvoice = (payment: any) => {
    downloadPaymentInvoicePdf(payment)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-surface-100 text-gray-800 dark:bg-surface-900 dark:text-surface-200'
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
      default: return 'bg-surface-100 text-gray-800 dark:bg-surface-900 dark:text-surface-200'
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

  const matchesDateRange = (createdAt?: string) => {
    if (dateRange === 'all') return true
    if (!createdAt) return false

    const target = new Date(createdAt)
    if (Number.isNaN(target.getTime())) return false

    const now = new Date()
    const thisMonth = target.getMonth() === now.getMonth() && target.getFullYear() === now.getFullYear()

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonth = target.getMonth() === lastMonthDate.getMonth() && target.getFullYear() === lastMonthDate.getFullYear()

    const thisYear = target.getFullYear() === now.getFullYear()

    if (dateRange === 'thisMonth') return thisMonth
    if (dateRange === 'lastMonth') return lastMonth
    if (dateRange === 'thisYear') return thisYear
    return true
  }

  const matchesAdvancedFilters = (item: any) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (typeFilter !== 'all' && item.type !== typeFilter) return false

    const normalizedMethod = (item.paymentMethod || '').toString().toUpperCase()
    if (methodFilter !== 'all' && normalizedMethod !== methodFilter) return false

    const value = Number(item.amount || 0)
    if (minAmount !== '' && value < Number(minAmount)) return false
    if (maxAmount !== '' && value > Number(maxAmount)) return false

    if (!matchesDateRange(item.createdAt)) return false
    return true
  }

  const filteredPayments = payments.filter(payment => {
    const matchesTab = 
      (activeTab === 'all') ||
      (activeTab === 'completed' && payment.status === 'completed') ||
      (activeTab === 'refunded' && payment.status === 'refunded')
    const matchesSearch = searchTerm === '' || 
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch && matchesAdvancedFilters(payment)
  })

  // For pending tab, merge pending bookings and payments with status 'pending'
  const pendingItems = [
    ...pendingBookings,
    ...payments.filter(p => p.status === 'pending')
  ].filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.property.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch && matchesAdvancedFilters(item)
  })

  const handleExport = () => {
    downloadPaymentsFullReportPdf(payments)
  }

  const tabs = [
    { id: 'all', label: 'All Payments', count: payments.length },
    { id: 'completed', label: 'Completed', count: payments.filter(p => p.status === 'completed').length },
    { id: 'refunded', label: 'Refunded', count: payments.filter(p => p.status === 'refunded').length },
    { id: 'pending', label: 'Pending', count: pendingBookings.length + payments.filter(p => p.status === 'pending').length }
  ]

  const totalSpent = payments
    .filter(p => p.status === 'completed' && p.type !== 'refund')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const totalRefunded = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + (p.refundAmount || p.amount || 0), 0)

  const netSpent = totalSpent - totalRefunded

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Payment History
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Track all your payments, refunds, and transaction history
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Spent</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
                All time
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Refunded</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">
                ${totalRefunded.toLocaleString()}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
                {payments.filter(p => p.status === 'refunded').length} refunds
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Net Spent</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">
                ${netSpent.toLocaleString()}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
                After refunds
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Payment Methods</p>
              <p className="text-3xl font-bold text-surface-900 dark:text-white mt-2">
                {paymentMethods.length}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
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
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              className="w-full pl-10 pr-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
            
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center px-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'More Filters'}
            </button>
            
            <button
              onClick={handleExport}
              disabled={payments.length === 0}
              className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="booking_payment">Booking Payment</option>
              <option value="security_deposit">Security Deposit</option>
              <option value="service_fee">Service Fee</option>
              <option value="refund">Refund</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            >
              <option value="all">All Methods</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CASH">Cash</option>
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="Min Amount"
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            />

            <input
              type="number"
              min="0"
              step="0.01"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Max Amount"
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            />
          </div>
        )}
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

      {/* Payment Methods Section */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Payment Methods</h2>
          <button
            onClick={() => setShowAddCardForm(!showAddCardForm)}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
          >
            {showAddCardForm ? 'Cancel' : 'Add New Card'}
          </button>
        </div>

        {showAddCardForm && (
          <div className="mb-6 p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-900/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={newCard.brand}
                onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              >
                <option value="VISA">Visa</option>
                <option value="MASTERCARD">Mastercard</option>
                <option value="AMEX">Amex</option>
              </select>
              <input
                type="text"
                placeholder="Last 4"
                maxLength={4}
                value={newCard.last4}
                onChange={(e) => setNewCard({ ...newCard, last4: e.target.value.replace(/\D/g, '') })}
                className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="MM"
                maxLength={2}
                value={newCard.expiryMonth}
                onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value.replace(/\D/g, '') })}
                className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="YYYY"
                maxLength={4}
                value={newCard.expiryYear}
                onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value.replace(/\D/g, '') })}
                className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddCard}
                disabled={isAddingCard}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isAddingCard ? 'Saving...' : 'Save Card'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoadingPaymentMethods ? (
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading payment methods...</p>
          ) : paymentMethods.length === 0 ? (
            <p className="text-sm text-surface-500 dark:text-surface-400">No payment methods saved yet.</p>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCardIcon(method.brand)}</span>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault ? (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefaultCard(method.id)}
                      className="text-xs px-2 py-1 border border-surface-200 dark:border-surface-600 rounded text-surface-700 dark:text-surface-300"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCard(method.id)}
                    className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                    title="Delete card"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
              Loading payments...
            </h3>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
              {error}
            </h3>
          </div>
        ) : activeTab === 'pending' ? (
          pendingItems.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                No pending bookings or payments
              </h3>
              <p className="text-surface-500 dark:text-surface-400">
                {searchTerm ? 'Try adjusting your search terms' : 'No pending items match the selected criteria'}
              </p>
            </div>
          ) : (
            pendingItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
                          {item.description}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                            Pending
                          </span>
                          {item.bookingId && <span>Booking ID: #{item.bookingId}</span>}
                        </div>
                        <div className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                          <p>{item.property} • {item.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <div className="text-center lg:text-right">
                      <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Amount</p>
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">
                        ${item.amount}
                      </p>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Date</p>
                      <p className="font-medium text-surface-900 dark:text-white">
                        {item.date}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handlePayNow(item)}
                        disabled={processingPaymentId === item.id}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        {processingPaymentId === item.id ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
              No payments found
            </h3>
            <p className="text-surface-500 dark:text-surface-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No payments match the selected criteria'}
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Payment Info */}
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                      {payment.type === 'booking_payment' && <DollarSign className="w-6 h-6 text-blue-600" />}
                      {payment.type === 'security_deposit' && <CreditCard className="w-6 h-6 text-yellow-600" />}
                      {payment.type === 'service_fee' && <FileText className="w-6 h-6 text-purple-600" />}
                      {payment.type === 'refund' && <TrendingDown className="w-6 h-6 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
                        {payment.description}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(payment.type)}`}>
                          {payment.type.replace('_', ' ')}
                        </span>
                        <span>Invoice: {payment.invoiceId}</span>
                        {payment.bookingId && <span>Booking ID: #{payment.bookingId}</span>}
                      </div>
                      
                      <div className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                        <p>{payment.property} • {payment.location}</p>
                        <p>Host: {payment.host}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                  <div className="text-center lg:text-right">
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Amount</p>
                    <p className={`text-2xl font-bold ${
                      payment.status === 'refunded' ? 'text-green-600 dark:text-green-400' : 'text-surface-900 dark:text-white'
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
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Date</p>
                    <p className="font-medium text-surface-900 dark:text-white">
                      {payment.date}
                    </p>
                    {payment.refundDate && (
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        Refunded: {payment.refundDate}
                      </p>
                    )}
                  </div>

                  <div className="text-center lg:text-right">
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Status</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-center lg:text-right">
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Payment Method</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCardIcon(payment.cardType)}</span>
                      <span className="text-sm text-surface-900 dark:text-white">
                        {payment.cardType} •••• {payment.cardLast4}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleViewInvoice(payment)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      View Invoice
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(payment)}
                      className="px-4 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-sm"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {payment.refundReason && (
                <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    <span className="font-medium">Refund Reason:</span> {payment.refundReason}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {paymentActionMessage && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
          {paymentActionMessage}
        </div>
      )}

      <PaymentInvoiceModal
        payment={selectedInvoice}
        isOpen={selectedInvoice !== null}
        onClose={handleCloseInvoice}
      />
    </div>
  )
}

export default Payments


