import { useCallback, useEffect, useRef, useState } from 'react'
import { Calendar, CreditCard, Star, AlertCircle, X, Trash2 } from 'lucide-react'
import { apiFetch } from '../utils/api'

const PAGE_SIZE = 3

type NotificationItem = {
  id: number
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt?: string
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  onNotificationsUpdated?: () => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title = 'Notifications',
  onNotificationsUpdated
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef<HTMLDivElement | null>(null)

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
        return { icon: <Calendar className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', bar: 'bg-blue-500' }
      case 'PAYMENT_SUCCEEDED':
      case 'PAYMENT_REFUNDED':
      case 'PAYMENT_FAILED':
      case 'ADMIN_PAYMENT_MONITORING':
        return { icon: <CreditCard className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', bar: 'bg-green-500' }
      case 'REVIEW_RECEIVED':
        return { icon: <Star className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', bar: 'bg-amber-500' }
      default:
        return { icon: <AlertCircle className="w-4 h-4" />, color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-surface-700', bar: 'bg-surface-400' }
    }
  }

  const fetchNotificationsPage = useCallback(async (pageNumber: number, append: boolean) => {
    if (append) setIsLoadingMore(true)
    else setIsLoading(true)

    try {
      const res = await apiFetch(`/notifications?page=${pageNumber}&size=${PAGE_SIZE}`)
      const items = res.data?.content || []

      setNotifications((prev) => {
        if (!append) return items
        const existingIds = new Set(prev.map((n) => n.id))
        const merged = [...prev]
        items.forEach((n: NotificationItem) => {
          if (!existingIds.has(n.id)) merged.push(n)
        })
        return merged
      })

      const totalPages = res.data?.totalPages ?? 0
      setHasMore(pageNumber + 1 < totalPages)
      setPage(pageNumber)
    } catch {
      if (!append) setNotifications([])
      setHasMore(false)
    } finally {
      if (append) setIsLoadingMore(false)
      else setIsLoading(false)
    }
  }, [])

  const fetchInitialNotifications = useCallback(async () => {
    setHasMore(true)
    await fetchNotificationsPage(0, false)
  }, [fetchNotificationsPage])

  const fetchMoreNotifications = async () => {
    if (isLoading || isLoadingMore || !hasMore) return
    await fetchNotificationsPage(page + 1, true)
  }

  const markNotificationAsRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      onNotificationsUpdated?.()
    } catch { /* no-op */ }
  }

  const markAllAsRead = async () => {
    try {
      await apiFetch('/notifications/read-all', { method: 'PATCH' })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      onNotificationsUpdated?.()
    } catch { /* no-op */ }
  }

  const deleteNotification = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      onNotificationsUpdated?.()
    } catch { /* no-op */ }
  }

  useEffect(() => {
    if (!isOpen) return
    fetchInitialNotifications()
  }, [isOpen, fetchInitialNotifications])

  const handleListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 40
    if (nearBottom) fetchMoreNotifications()
  }

  const handleListWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const canScroll = target.scrollHeight > target.clientHeight
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 40
    if ((!canScroll && event.deltaY > 0) || (canScroll && nearBottom && event.deltaY > 0)) {
      fetchMoreNotifications()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Popover dropdown */}
      <div
        className="fixed z-50 top-14 right-4 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-surface-800 shadow-soft-xl dark:shadow-dark-xl border border-surface-200 dark:border-surface-700 animate-fade-in-down overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-700">
          <h3 className="text-base font-semibold text-surface-900 dark:text-white">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              onClick={markAllAsRead}
            >
              Mark all read
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:text-surface-300 dark:hover:bg-surface-700 transition-colors"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto"
          onScroll={handleListScroll}
          onWheel={handleListWheel}
        >
          {isLoading && (
            <div className="py-12 text-center">
              <div className="inline-block h-6 w-6 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin"></div>
              <p className="text-sm text-surface-400 mt-2">Loading...</p>
            </div>
          )}
          
          {!isLoading && notifications.length === 0 && (
            <div className="py-12 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                No notifications yet
              </p>
            </div>
          )}

          {!isLoading && notifications.length > 0 && (
            <div className="py-2">
              {notifications.map((notification) => {
                const meta = getNotificationMeta(notification.type)
                return (
                  <div key={notification.id} className="relative group px-2">
                    <button
                      type="button"
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`w-full text-left flex gap-3 px-3 py-3 rounded-2xl my-0.5 transition-colors ${
                        notification.isRead
                          ? 'hover:bg-surface-50 dark:hover:bg-surface-700/50'
                          : 'bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                    >
                      {/* Left color bar */}
                      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${notification.isRead ? 'bg-transparent' : meta.bar}`}></div>
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        {meta.icon}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">
                          {notification.title}
                        </p>
                        <p className="text-sm text-surface-800 dark:text-surface-200 mt-0.5 line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </button>
                    {/* Delete button */}
                    <button
                      className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Delete notification"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                )
              })}
              {isLoadingMore && (
                <div className="py-3 text-center">
                  <div className="inline-block h-4 w-4 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NotificationModal


