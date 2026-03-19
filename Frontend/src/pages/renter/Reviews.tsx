import { useState, useEffect, useRef } from 'react'
import { Star, MapPin, Search, MessageSquare, ThumbsUp, ThumbsDown, Clock, CheckCircle, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { apiFetch } from '../../utils/api'

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('to_write')
  const [searchTerm, setSearchTerm] = useState('')

  const [reviewsToWrite, setReviewsToWrite] = useState<any[]>([])
  const [myReviews, setMyReviews] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  const [editModal, setEditModal] = useState<{ open: boolean, review: any | null }>({ open: false, review: null })
  const [editForm, setEditForm] = useState<any | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null)
      }
    }
    if (menuOpenId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpenId])

  useEffect(() => {
    const fetchData = async () => {
      setError(null)
      try {
        console.log('Fetching reviews data...')
        
        // Fetch only completed bookings for reviews to write
        const bookingsRes = await apiFetch('/renter/bookings?status=COMPLETED')
        console.log('Bookings response:', bookingsRes)
        const bookings = bookingsRes.data?.content || []
        // Filter to only bookings with status COMPLETED and not already reviewed
        const completedBookings = bookings.filter((b: any) => {
          const status = (b.status?.toLowerCase?.() || b.status)
          // Hide if booking has a review or reviewed flag
          const isReviewed = b.review || b.reviewed === true
          return status === 'completed' && !isReviewed
        })
        setReviewsToWrite(completedBookings)
        console.log('Reviews to write:', completedBookings.length)

        // Fetch user's existing reviews
        let reviews = []
        try {
          // Try renter-specific endpoint first
          const reviewsRes = await apiFetch('/reviews/my')
          reviews = reviewsRes.data?.content || reviewsRes.data || []
        } catch (renterError) {
          console.log('Renter reviews endpoint failed, trying alternative...')
          try {
            // Try alternative endpoint - maybe reviews are nested under user
            const userRes = await apiFetch('/user/reviews')
            reviews = userRes.data?.content || userRes.data || []
          } catch (userError) {
            console.log('User reviews endpoint failed, trying bookings approach...')
            try {
              // Last resort - get reviews from bookings data
              const allBookingsRes = await apiFetch('/renter/bookings')
              const allBookings = allBookingsRes.data?.content || []
              reviews = allBookings
                .filter((b: any) => b.review || b.reviews)
                .map((b: any) => b.review || b.reviews)
                .filter(Boolean)
            } catch (bookingsError) {
              console.error('All review fetch methods failed:', bookingsError)
            }
          }
        }
        
        console.log('Final reviews data:', reviews)
        setMyReviews(reviews)
      } catch (err: any) {
        console.error('Error fetching reviews:', err)
        setError(err.message || 'Failed to fetch data')
      }
    }
    fetchData()
  }, [])

  const tabs = [
    { id: 'to_write', label: 'Reviews to Write', count: reviewsToWrite.length },
    { id: 'my_reviews', label: 'My Reviews', count: myReviews.length }
  ]

  const renderStars = (rating: number, onRate?: (rating: number) => void, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            } ${onRate ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review: '',
    wouldRecommend: null as boolean | null,
    cleanliness: 0,
    communication: 0,
    checkInRating: 0,
    accuracy: 0,
    locationRating: 0,
    value: 0
  })

  const filteredReviews = myReviews.filter(review => 
    searchTerm === '' || 
    review.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.review.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            My Reviews
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Share your experience and help other renters make informed decisions
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading reviews
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myReviews.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Published
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myReviews.length > 0 ? (myReviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / myReviews.length).toFixed(1) : '0.0'}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Would Recommend</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myReviews.length > 0 ? Math.round((myReviews.filter(r => r.wouldRecommend).length / myReviews.length) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Positive
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reviewsToWrite.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  To write
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
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
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
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

        {/* Reviews to Write */}
        {activeTab === 'to_write' && (
          <div className="space-y-6">
            {reviewsToWrite.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-green-100 dark:bg-green-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  All caught up!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  You don't have any pending reviews to write. Thanks for sharing your experiences!
                </p>
              </div>
            ) : (
              reviewsToWrite.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {typeof review.property === 'object' && review.property && review.property.image ? (
                          <img
                            src={
                              review.property.image && !review.property.image.startsWith('http')
                                ? `http://localhost:8080${review.property.image}?t=${Date.now()}`
                                : `${review.property.image}?t=${Date.now()}`
                            }
                            alt={review.property.title || 'Property'}
                            className="object-cover w-full h-full"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-3xl text-gray-400">🏠</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {typeof review.property === 'object' && review.property ? review.property.title : review.property}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">
                            {typeof review.property === 'object' && review.property ? review.property.location : review.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Stay: {review.checkIn} - {review.checkOut}</span>
                          </div>
                          <span>•</span>
                          <span>{review.daysSinceCheckout} days ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Overall Rating */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Overall Rating
                        </label>
                        {renderStars(reviewForm.rating, (rating) => setReviewForm({...reviewForm, rating}), 'lg')}
                      </div>

                      {/* Detailed Ratings */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                          Detailed Ratings
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'cleanliness', label: 'Cleanliness' },
                            { key: 'communication', label: 'Communication' },
                            { key: 'checkInRating', label: 'Check-in' },
                            { key: 'accuracy', label: 'Accuracy' },
                            { key: 'locationRating', label: 'Location' },
                            { key: 'value', label: 'Value' }
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                              {renderStars(reviewForm[key as keyof typeof reviewForm] as number, (rating) => 
                                setReviewForm({...reviewForm, [key]: rating}), 'sm'
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Would Recommend */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Would you recommend this property?
                        </label>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setReviewForm({...reviewForm, wouldRecommend: true})}
                            className={`flex items-center px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                              reviewForm.wouldRecommend === true
                                ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-300 shadow-lg'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Yes
                          </button>
                          <button
                            onClick={() => setReviewForm({...reviewForm, wouldRecommend: false})}
                            className={`flex items-center px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                              reviewForm.wouldRecommend === false
                                ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-300 shadow-lg'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            No
                          </button>
                        </div>
                      </div>

                      {/* Review Text */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Your Review
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          placeholder="Share your experience with this property..."
                          value={reviewForm.review}
                          onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          onClick={async () => {
                            try {
                              // Compose review payload
                              const payload = {
                                bookingId: review.id,
                                propertyId: review.property?.id || review.propertyId,
                                overallRating: reviewForm.rating,
                                comment: reviewForm.review,
                                wouldRecommend: reviewForm.wouldRecommend,
                                cleanliness: reviewForm.cleanliness,
                                communication: reviewForm.communication,
                                checkInRating: reviewForm.checkInRating,
                                accuracy: reviewForm.accuracy,
                                locationRating: reviewForm.locationRating,
                                value: reviewForm.value
                              }

                              // Get token from localStorage
                              const token = localStorage.getItem('rentwise_token')
                              await apiFetch('/reviews', {
                                method: 'POST',
                                body: JSON.stringify(payload),
                                headers: {
                                  'Content-Type': 'application/json',
                                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                }
                              })

                              // Reset form
                              setReviewForm({
                                rating: 0,
                                review: '',
                                wouldRecommend: null,
                                cleanliness: 0,
                                communication: 0,
                                checkInRating: 0,
                                accuracy: 0,
                                locationRating: 0,
                                value: 0
                              })

                              // Refresh data
                              const bookingsRes = await apiFetch('/renter/bookings?status=COMPLETED')
                              const bookings = bookingsRes.data?.content || []
                              const completedBookings = bookings.filter((b: any) => {
                                const status = (b.status?.toLowerCase?.() || b.status)
                                const isReviewed = b.review || b.reviewed === true
                                return status === 'completed' && !isReviewed
                              })
                              setReviewsToWrite(completedBookings)

                              // Refresh reviews
                              let reviews = []
                              try {
                                const reviewsRes = await apiFetch('/reviews/my')
                                reviews = reviewsRes.data?.content || reviewsRes.data || []
                              } catch (err) {
                                // Fallback to bookings approach
                                const allBookingsRes = await apiFetch('/renter/bookings')
                                const allBookings = allBookingsRes.data?.content || []
                                reviews = allBookings
                                  .filter((b: any) => b.review || b.reviews)
                                  .map((b: any) => b.review || b.reviews)
                                  .filter(Boolean)
                              }
                              setMyReviews(reviews)

                              alert('Review submitted successfully!')
                            } catch (err: any) {
                              alert('Failed to submit review: ' + (err.message || 'Unknown error'))
                            }
                          }}
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* My Reviews */}
        {activeTab === 'my_reviews' && (
          <div>
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your reviews..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No reviews found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t written any reviews yet'}
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {review.propertyImage ? (
                              <img
                                src={review.propertyImage.startsWith('http') ? review.propertyImage : `http://localhost:8080${review.propertyImage}`}
                                alt={review.propertyTitle || 'Property'}
                                className="object-cover w-full h-full"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-xl text-gray-400">🏠</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                              {review.propertyTitle}
                            </h3>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="text-sm line-clamp-1">
                                {review.propertyLocation || ''}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {renderStars(review.overallRating, undefined, 'sm')}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Three-dot menu */}
                        <div className="relative" ref={menuRef}>
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setMenuOpenId(menuOpenId === review.id ? null : review.id)}
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {menuOpenId === review.id && (
                            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]">
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                  setEditModal({ open: true, review })
                                  setEditForm({
                                    overallRating: review.overallRating,
                                    comment: review.comment,
                                    wouldRecommend: review.wouldRecommend,
                                    cleanliness: review.cleanliness,
                                    communication: review.communication,
                                    checkIn: review.checkIn,
                                    accuracy: review.accuracy,
                                    locationRating: review.locationRating,
                                    value: review.value
                                  })
                                  setMenuOpenId(null)
                                }}
                              >
                                <Edit className="w-3 h-3 mr-2" />
                                Edit
                              </button>
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to delete this review?')) {
                                    try {
                                      const token = localStorage.getItem('rentwise_token')
                                      await apiFetch(`/reviews/${review.id}`, {
                                        method: 'DELETE',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                        }
                                      })
                                      
                                      // Refresh reviews
                                      let reviews = []
                                      try {
                                        const reviewsRes = await apiFetch('/renter/reviews')
                                        reviews = reviewsRes.data?.content || reviewsRes.data || []
                                      } catch (err) {
                                        const allBookingsRes = await apiFetch('/renter/bookings')
                                        const allBookings = allBookingsRes.data?.content || []
                                        reviews = allBookings
                                          .filter((b: any) => b.review || b.reviews)
                                          .map((b: any) => b.review || b.reviews)
                                          .filter(Boolean)
                                      }
                                      setMyReviews(reviews)
                                      setMenuOpenId(null)
                                      alert('Review deleted successfully!')
                                    } catch (err: any) {
                                      alert('Failed to delete review: ' + (err.message || 'Unknown error'))
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {review.comment}
                        </p>
                      </div>

                      {review.hostResponse && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Host Response
                            </span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {review.hostResponseDate ? new Date(review.hostResponseDate).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                            {review.hostResponse}
                          </p>
                        </div>
                      )}

                      {/* Helpful Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <button className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({review.helpfulCount || 0})</span>
                          </button>
                          <button className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                            <span>Not Helpful ({review.notHelpfulCount || 0})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Edit Review Modal */}
        {editModal.open && editModal.review && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setEditModal({ open: false, review: null })}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Review</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    const payload = {
                      overallRating: editForm.overallRating,
                      comment: editForm.comment,
                      wouldRecommend: editForm.wouldRecommend,
                      cleanliness: editForm.cleanliness,
                      communication: editForm.communication,
                      checkIn: editForm.checkIn,
                      accuracy: editForm.accuracy,
                      locationRating: editForm.locationRating,
                      value: editForm.value
                    }
                    const token = localStorage.getItem('rentwise_token')
                    await apiFetch(`/reviews/${editModal.review.id}`, {
                      method: 'PUT',
                      body: JSON.stringify(payload),
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                      }
                    })
                    alert('Review updated successfully!')
                    setEditModal({ open: false, review: null })
                    // Refresh reviews and fetch property details
                    let reviews = []
                    try {
                      const reviewsRes = await apiFetch('/reviews/my')
                      reviews = reviewsRes.data?.content || reviewsRes.data || []
                    } catch (err) {
                      // Fallback to bookings approach
                      const allBookingsRes = await apiFetch('/renter/bookings')
                      const allBookings = allBookingsRes.data?.content || []
                      reviews = allBookings
                        .filter((b: any) => b.review || b.reviews)
                        .map((b: any) => b.review || b.reviews)
                        .filter(Boolean)
                    }
                    // Fetch property details for each review
                    const reviewsWithProperty = await Promise.all(
                      reviews.map(async (review: any) => {
                        if (review.propertyId) {
                          try {
                            const propertyRes = await apiFetch(`/properties/${review.propertyId}`)
                            review.property = propertyRes.data || propertyRes
                          } catch (propertyError) {
                            review.property = null
                          }
                        }
                        return review
                      })
                    )
                    setMyReviews(reviewsWithProperty)
                  } catch (err: any) {
                    alert('Failed to update review: ' + (err.message || 'Unknown error'))
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Overall Rating
                    </label>
                    {renderStars(editForm.overallRating, (rating) => setEditForm({...editForm, overallRating: rating}), 'lg')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={editForm.comment}
                      onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium py-2 transition-colors mt-6"
                >
                  Update Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reviews
