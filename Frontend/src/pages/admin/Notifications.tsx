import { useState, useEffect, useCallback } from 'react'
import {
  Send, Users, User, Building, Bell, Search,
  Calendar, CreditCard, AlertCircle, Star,
  ChevronLeft, ChevronRight, Filter, Plus, X, Check,
  Megaphone, Clock, Eye
} from 'lucide-react'
import { apiFetch } from '../../utils/api'
import PageHeader from '../../components/ui/PageHeader'

type NotificationItem = {
  id: number
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt?: string
  recipientName?: string
  recipientEmail?: string
}

type Recipient = 'all' | 'renters' | 'owners' | 'individual'

const PAGE_SIZE = 10

const Notifications = () => {
  // --- Compose state ---
  const [showCompose, setShowCompose] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendError, setSendError] = useState('')
  const [compose, setCompose] = useState({
    title: '',
    body: '',
    type: 'SYSTEM',
    recipient: 'all' as Recipient,
    individualEmail: ''
  })

  // --- Notification history state ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')

  // --- Fetch notifications ---
  const fetchNotifications = useCallback(async (pageNum: number) => {
    setIsLoading(true)
    try {
      let endpoint = `/api/admin/notifications?page=${pageNum}&size=${PAGE_SIZE}`
      if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`
      if (filterType) endpoint += `&type=${encodeURIComponent(filterType)}`
      const res = await apiFetch(endpoint)
      const data = res.data || res
      setNotifications(data.content || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalElements || 0)
      setPage(pageNum)
    } catch {
      setNotifications([])
      setTotalPages(0)
      setTotalItems(0)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filterType])

  useEffect(() => {
    fetchNotifications(0)
  }, [fetchNotifications])

  // --- Send notification ---
  const handleSend = async () => {
    if (!compose.title.trim() || !compose.body.trim()) return
    if (compose.recipient === 'individual' && !compose.individualEmail.trim()) return

    setSending(true)
    setSendError('')
    setSendSuccess(false)

    try {
      await apiFetch('/api/admin/notifications/send', {
        method: 'POST',
        body: JSON.stringify({
          title: compose.title,
          body: compose.body,
          type: compose.type,
          recipient: compose.recipient,
          email: compose.recipient === 'individual' ? compose.individualEmail : undefined
        })
      })
      setSendSuccess(true)
      setCompose({ title: '', body: '', type: 'SYSTEM', recipient: 'all', individualEmail: '' })
      fetchNotifications(0)
      setTimeout(() => {
        setSendSuccess(false)
        setShowCompose(false)
      }, 2000)
    } catch (err: any) {
      setSendError(err.message || 'Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  // --- Helpers ---
  const formatRelativeTime = (timestamp?: string) => {
    if (!timestamp) return 'just now'
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

  const getNotificationMeta = (type: string) => {
    switch (type) {
      case 'BOOKING_STATUS_CHANGED':
      case 'BOOKING_CREATED':
      case 'BOOKING_CANCELLED':
        return { icon: <Calendar className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Booking' }
      case 'PAYMENT_SUCCEEDED':
      case 'PAYMENT_REFUNDED':
      case 'PAYMENT_FAILED':
      case 'ADMIN_PAYMENT_MONITORING':
        return { icon: <CreditCard className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Payment' }
      case 'REVIEW_RECEIVED':
        return { icon: <Star className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Review' }
      case 'SYSTEM':
        return { icon: <Megaphone className="w-4 h-4" />, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', label: 'System' }
      default:
        return { icon: <Bell className="w-4 h-4" />, color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-surface-700', label: type }
    }
  }

  const recipientOptions = [
    { value: 'all' as Recipient, label: 'All Users', icon: Users, desc: 'Send to every user on the platform' },
    { value: 'renters' as Recipient, label: 'All Renters', icon: User, desc: 'Target renter accounts only' },
    { value: 'owners' as Recipient, label: 'All Owners', icon: Building, desc: 'Target property owner accounts' },
    { value: 'individual' as Recipient, label: 'Individual User', icon: Search, desc: 'Send to a specific user by email' }
  ]

  const notificationTypes = [
    { value: 'SYSTEM', label: 'System Announcement' },
    { value: 'BOOKING_STATUS_CHANGED', label: 'Booking Update' },
    { value: 'PAYMENT_SUCCEEDED', label: 'Payment Notice' },
    { value: 'ADMIN_PAYMENT_MONITORING', label: 'Admin Alert' }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <PageHeader
          title="Notifications"
          subtitle="Send announcements and manage notification history"
        />
        <button
          id="notif-compose-btn"
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Send Notification
        </button>
      </div>

      {/* ===== COMPOSE MODAL ===== */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/50 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowCompose(false)} />
          <div className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-soft-xl dark:shadow-dark-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-surface-200 dark:border-surface-700 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <Send className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-900 dark:text-white">Send Notification</h2>
                  <p className="text-xs text-surface-400 dark:text-surface-500">Compose and broadcast a notification</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompose(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Recipient Selection */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
                  Recipients
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recipientOptions.map((opt) => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.value}
                        id={`notif-recipient-${opt.value}`}
                        onClick={() => setCompose(c => ({ ...c, recipient: opt.value }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          compose.recipient === opt.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          compose.recipient === opt.value
                            ? 'bg-primary-100 dark:bg-primary-800/30'
                            : 'bg-surface-100 dark:bg-surface-700'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            compose.recipient === opt.value
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-surface-500'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{opt.label}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500">{opt.desc}</p>
                        </div>
                        {compose.recipient === opt.value && (
                          <Check className="w-4 h-4 text-primary-500 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Individual email input */}
                {compose.recipient === 'individual' && (
                  <div className="mt-3">
                    <input
                      id="notif-individual-email"
                      type="email"
                      placeholder="Enter user email address"
                      className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                      value={compose.individualEmail}
                      onChange={e => setCompose(c => ({ ...c, individualEmail: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              {/* Notification Type */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Type
                </label>
                <select
                  id="notif-type"
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                  value={compose.type}
                  onChange={e => setCompose(c => ({ ...c, type: e.target.value }))}
                >
                  {notificationTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Title
                </label>
                <input
                  id="notif-title"
                  type="text"
                  placeholder="Notification title"
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
                  value={compose.title}
                  onChange={e => setCompose(c => ({ ...c, title: e.target.value }))}
                  maxLength={120}
                />
                <p className="text-xs text-surface-400 mt-1 text-right">{compose.title.length}/120</p>
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Message
                </label>
                <textarea
                  id="notif-body"
                  rows={4}
                  placeholder="Write your notification message..."
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition resize-none"
                  value={compose.body}
                  onChange={e => setCompose(c => ({ ...c, body: e.target.value }))}
                  maxLength={500}
                />
                <p className="text-xs text-surface-400 mt-1 text-right">{compose.body.length}/500</p>
              </div>

              {/* Preview Card */}
              {compose.title && compose.body && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </p>
                  <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/30 border border-surface-200/60 dark:border-surface-700/50">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${getNotificationMeta(compose.type).bg} ${getNotificationMeta(compose.type).color} flex items-center justify-center flex-shrink-0`}>
                        {getNotificationMeta(compose.type).icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">{compose.title}</p>
                        <p className="text-sm text-surface-800 dark:text-surface-200 mt-0.5">{compose.body}</p>
                        <p className="text-[11px] text-surface-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> just now
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error / Success */}
              {sendError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {sendError}
                  </p>
                </div>
              )}
              {sendSuccess && (
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4 flex-shrink-0" /> Notification sent successfully!
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={() => setShowCompose(false)}
                className="px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                id="notif-send-btn"
                onClick={handleSend}
                disabled={sending || !compose.title.trim() || !compose.body.trim() || (compose.recipient === 'individual' && !compose.individualEmail.trim())}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== STATS BAR ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900 dark:text-white">{totalItems}</p>
              <p className="text-xs text-surface-400 dark:text-surface-500">Total Sent</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900 dark:text-white">
                {notifications.filter(n => n.type === 'SYSTEM').length}
              </p>
              <p className="text-xs text-surface-400 dark:text-surface-500">System</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900 dark:text-white">
                {notifications.filter(n => n.type.includes('PAYMENT')).length}
              </p>
              <p className="text-xs text-surface-400 dark:text-surface-500">Payment</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900 dark:text-white">
                {notifications.filter(n => n.type.includes('BOOKING')).length}
              </p>
              <p className="text-xs text-surface-400 dark:text-surface-500">Booking</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FILTERS & SEARCH ===== */}
      <div className="card-elevated mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              id="notif-search"
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <select
              id="notif-filter-type"
              className="pl-10 pr-8 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 outline-none transition appearance-none min-w-[180px]"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="SYSTEM">System</option>
              <option value="BOOKING_STATUS_CHANGED">Booking</option>
              <option value="PAYMENT_SUCCEEDED">Payment</option>
              <option value="REVIEW_RECEIVED">Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== NOTIFICATION HISTORY TABLE ===== */}
      <div className="card-elevated overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <h3 className="text-base font-semibold text-surface-900 dark:text-white">Notification History</h3>
          <span className="text-xs text-surface-400 dark:text-surface-500">{totalItems} total</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-6 w-6 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin"></div>
            <p className="text-sm text-surface-400 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7 text-surface-400" />
            </div>
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">No notifications found</p>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
              Send your first notification using the button above
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-700/30">
                    <th className="text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider px-6 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider px-6 py-3">Title & Message</th>
                    <th className="text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider px-6 py-3">Recipient</th>
                    <th className="text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider px-6 py-3">Sent</th>
                    <th className="text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
                  {notifications.map((n) => {
                    const meta = getNotificationMeta(n.type)
                    return (
                      <tr key={n.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center`}>
                              {meta.icon}
                            </div>
                            <span className="text-xs font-medium text-surface-500 dark:text-surface-400">{meta.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">{n.title}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 truncate">{n.body}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-surface-600 dark:text-surface-300">
                            {n.recipientName || n.recipientEmail || 'All Users'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(n.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            n.isRead
                              ? 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${n.isRead ? 'bg-surface-400' : 'bg-green-500'}`} />
                            {n.isRead ? 'Read' : 'Delivered'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-surface-100 dark:divide-surface-700/50">
              {notifications.map((n) => {
                const meta = getNotificationMeta(n.type)
                return (
                  <div key={n.id} className="p-4 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">{n.title}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                            n.isRead
                              ? 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {n.isRead ? 'Read' : 'Sent'}
                          </span>
                        </div>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 line-clamp-2">{n.body}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px] text-surface-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(n.createdAt)}
                          </span>
                          <span className="text-[11px] text-surface-400">
                            {n.recipientName || n.recipientEmail || 'All Users'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 dark:border-surface-700">
                <p className="text-xs text-surface-400 dark:text-surface-500">
                  Page {page + 1} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    id="notif-prev-page"
                    onClick={() => fetchNotifications(page - 1)}
                    disabled={page === 0}
                    className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = page < 3 ? i : page - 2 + i
                    if (pageNum >= totalPages) return null
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchNotifications(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    )
                  })}
                  <button
                    id="notif-next-page"
                    onClick={() => fetchNotifications(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Notifications
