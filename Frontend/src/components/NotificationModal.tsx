import { useCallback, useEffect, useRef, useState } from 'react'
import { Calendar, CreditCard, Star, AlertCircle, X } from 'lucide-react'
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_STATUS_CHANGED':
      case 'BOOKING_CREATED':
      case 'BOOKING_CANCELLED':
        return <Calendar className="w-4 h-4 text-blue-600" />
      case 'PAYMENT_SUCCEEDED':
      case 'PAYMENT_REFUNDED':
      case 'PAYMENT_FAILED':
      case 'ADMIN_PAYMENT_MONITORING':
        return <CreditCard className="w-4 h-4 text-green-600" />
      case 'REVIEW_RECEIVED':
        return <Star className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const fetchNotificationsPage = useCallback(async (pageNumber: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }

    try {
      const res = await apiFetch(`/notifications?page=${pageNumber}&size=${PAGE_SIZE}`)
      const items = res.data?.content || []

      setNotifications((prev) => {
        if (!append) return items

        const existingIds = new Set(prev.map((n) => n.id))
        const merged = [...prev]
        items.forEach((n: NotificationItem) => {
          if (!existingIds.has(n.id)) {
            merged.push(n)
          }
        })
        return merged
      })

      const totalPages = res.data?.totalPages ?? 0
      setHasMore(pageNumber + 1 < totalPages)
      setPage(pageNumber)
    } catch {
      if (!append) {
        setNotifications([])
      }
      setHasMore(false)
    } finally {
      if (append) {
        setIsLoadingMore(false)
      } else {
        setIsLoading(false)
      }
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
    } catch {
      // no-op
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiFetch('/notifications/read-all', { method: 'PATCH' })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      onNotificationsUpdated?.()
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    if (!isOpen) return
    fetchInitialNotifications()
  }, [isOpen, fetchInitialNotifications])

  const handleListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 40
    if (nearBottom) {
      fetchMoreNotifications()
    }
  }

  const handleListWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const canScroll = target.scrollHeight > target.clientHeight
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 40

    // When the initial 3 items do not overflow, a downward wheel gesture means user wants more.
    if ((!canScroll && event.deltaY > 0) || (canScroll && nearBottom && event.deltaY > 0)) {
      fetchMoreNotifications()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - close on click */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Popover dropdown */}
      <div
        className="fixed z-50 top-12 right-4 w-96 rounded-xl bg-white shadow-2xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
            <button
              type="button"
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-4"
          onScroll={handleListScroll}
          onWheel={handleListWheel}
        >
          {isLoading && <div className="py-10 text-center text-gray-400">Loading notifications...</div>}
          {!isLoading && notifications.length === 0 && (
            <div className="py-10 text-center text-gray-400">No notifications</div>
          )}

          {!isLoading && notifications.length > 0 && (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={`w-full rounded-lg p-3 text-left ${
                    notification.isRead
                      ? 'bg-gray-50 dark:bg-gray-700'
                      : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">{notification.body}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              {isLoadingMore && (
                <div className="py-3 text-center text-sm text-gray-400">Loading more...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NotificationModal
