import { useState } from 'react'
import { Star, MapPin, Search, MessageSquare, ThumbsUp, ThumbsDown, Clock, CheckCircle } from 'lucide-react'

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('to_write')
  const [searchTerm, setSearchTerm] = useState('')

  const [reviewsToWrite] = useState([
    {
      id: 1,
      property: 'Mountain View Cabin',
      location: 'Aspen, CO',
      image: '🏔️',
      checkIn: '2024-02-10',
      checkOut: '2024-02-12',
      host: 'Michael Brown',
      hostImage: 'MB',
      bookingId: 3,
      daysSinceCheckout: 15,
      rating: 0,
      review: '',
      wouldRecommend: null,
      cleanliness: 0,
      communication: 0,
      checkInRating: 0,
      accuracy: 0,
      locationRating: 0,
      value: 0
    }
  ])

  const [myReviews] = useState([
    {
      id: 1,
      property: 'Luxury Beach House',
      location: 'Miami Beach, FL',
      image: '🏖️',
      rating: 5,
      review: 'Absolutely stunning property! The host was incredibly responsive and the place was exactly as described. Clean, well-equipped, and the location was perfect. Would definitely stay here again!',
      date: '2024-02-15',
      hostResponse: 'Thank you so much for your wonderful review! We\'re thrilled you enjoyed your stay. You\'re always welcome back!',
      hostResponseDate: '2024-02-16',
      helpful: 12,
      notHelpful: 1,
      wouldRecommend: true,
      cleanliness: 5,
      communication: 5,
      checkInRating: 5,
      accuracy: 5,
      locationRating: 5,
      value: 4,
      host: 'Sarah Johnson',
      hostImage: 'SJ',
      bookingId: 1
    },
    {
      id: 2,
      property: 'Downtown Studio Apartment',
      location: 'Chicago, IL',
      image: '🏙️',
      rating: 4,
      review: 'Great location and very clean apartment. The host was helpful and check-in was smooth. Only minor issue was that the WiFi was a bit slow, but everything else was perfect. Good value for money.',
      date: '2024-01-20',
      hostResponse: null,
      helpful: 8,
      notHelpful: 2,
      wouldRecommend: true,
      cleanliness: 5,
      communication: 4,
      checkInRating: 5,
      accuracy: 4,
      locationRating: 5,
      value: 4,
      host: 'David Wilson',
      hostImage: 'DW',
      bookingId: 2
    },
    {
      id: 3,
      property: 'Cozy Mountain Cabin',
      location: 'Denver, CO',
      image: '🏔️',
      rating: 3,
      review: 'The cabin was nice and cozy, but there were some maintenance issues that weren\'t mentioned in the listing. The location was beautiful though. Host was responsive to our concerns.',
      date: '2023-12-10',
      hostResponse: 'We appreciate your feedback and apologize for the maintenance issues. We\'ve addressed them and hope you\'ll give us another chance in the future.',
      hostResponseDate: '2023-12-11',
      helpful: 5,
      notHelpful: 3,
      wouldRecommend: false,
      cleanliness: 3,
      communication: 4,
      checkInRating: 4,
      accuracy: 3,
      locationRating: 5,
      value: 3,
      host: 'Lisa Anderson',
      hostImage: 'LA',
      bookingId: 3
    }
  ])

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
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-500 fill-current cursor-pointer' 
                : 'text-gray-300 dark:text-gray-600 cursor-pointer hover:text-yellow-400'
            } ${onRate ? 'cursor-pointer' : ''}`}
            onClick={() => onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = myReviews.filter(review => 
    searchTerm === '' || 
    review.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.review.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Reviews
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your experience and help other renters make informed decisions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {myReviews.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Published
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {myReviews.length > 0 ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1) : '0.0'}
              </p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Would Recommend</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {myReviews.length > 0 ? Math.round((myReviews.filter(r => r.wouldRecommend).length / myReviews.length) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Positive
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {reviewsToWrite.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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

      {/* Reviews to Write */}
      {activeTab === 'to_write' && (
        <div className="space-y-6">
          {reviewsToWrite.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any pending reviews to write.
              </p>
            </div>
          ) : (
            reviewsToWrite.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                    {review.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {review.property}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {review.location}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>Stay: {review.checkIn} - {review.checkOut}</span>
                      <span>•</span>
                      <span>{review.daysSinceCheckout} days ago</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Overall Rating
                    </label>
                    {renderStars(reviewForm.rating, (rating) => setReviewForm({...reviewForm, rating}), 'lg')}
                  </div>

                  {/* Detailed Ratings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
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
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                          {renderStars(reviewForm[key as keyof typeof reviewForm] as number, (rating) => 
                            setReviewForm({...reviewForm, [key]: rating}), 'sm'
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Would Recommend */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Would you recommend this property?
                    </label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setReviewForm({...reviewForm, wouldRecommend: true})}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                          reviewForm.wouldRecommend === true
                            ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Yes
                      </button>
                      <button
                        onClick={() => setReviewForm({...reviewForm, wouldRecommend: false})}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                          reviewForm.wouldRecommend === false
                            ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-300'
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share your experience with this property..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Save as Draft
                    </button>
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                      Submit Review
                    </button>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t written any reviews yet'}
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                        {review.image}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {review.property}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {review.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          {renderStars(review.rating, undefined, 'sm')}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {review.date}
                          </span>
                          {review.wouldRecommend && (
                            <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Would recommend
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {review.review}
                  </p>

                  {/* Detailed Ratings */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cleanliness</p>
                      {renderStars(review.cleanliness, undefined, 'sm')}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Communication</p>
                      {renderStars(review.communication, undefined, 'sm')}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-in</p>
                      {renderStars(review.checkInRating, undefined, 'sm')}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Accuracy</p>
                      {renderStars(review.accuracy, undefined, 'sm')}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                      {renderStars(review.locationRating, undefined, 'sm')}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Value</p>
                      {renderStars(review.value, undefined, 'sm')}
                    </div>
                  </div>

                  {/* Host Response */}
                  {review.hostResponse && (
                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                            {review.hostImage}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.host} (Host)
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {review.hostResponseDate}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {review.hostResponse}
                      </p>
                    </div>
                  )}

                  {/* Helpful Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <ThumbsDown className="w-4 h-4" />
                        <span>Not Helpful ({review.notHelpful})</span>
                      </button>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      Edit Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Reviews
