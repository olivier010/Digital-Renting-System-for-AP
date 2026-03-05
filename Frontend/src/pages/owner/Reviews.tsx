import { useState } from 'react'
import { 
  Star, 
  MapPin, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Reply,
  Flag,
  MoreVertical,
  TrendingUp
} from 'lucide-react'

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('received')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [filterProperty, setFilterProperty] = useState('all')

  const [reviews] = useState([
    {
      id: 1,
      property: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      image: '🏢',
      guest: 'John Smith',
      guestImage: 'JS',
      rating: 5,
      review: 'Absolutely stunning property! The host was incredibly responsive and the place was exactly as described. Clean, well-equipped, and the location was perfect. Would definitely stay here again!',
      date: '2024-03-15',
      checkIn: '2024-03-10',
      checkOut: '2024-03-15',
      hostResponse: 'Thank you so much for your wonderful review! We\'re thrilled you enjoyed your stay. You\'re always welcome back!',
      hostResponseDate: '2024-03-16',
      helpful: 12,
      notHelpful: 1,
      wouldRecommend: true,
      cleanliness: 5,
      communication: 5,
      checkInRating: 5,
      accuracy: 5,
      locationRating: 5,
      value: 4,
      bookingId: 'BK001',
      verified: true
    },
    {
      id: 2,
      property: 'Beach House Paradise',
      location: 'Miami, FL',
      image: '🏖️',
      guest: 'Sarah Johnson',
      guestImage: 'SJ',
      rating: 4,
      review: 'Great location and very clean property. The host was helpful and check-in was smooth. Only minor issue was that the WiFi was a bit slow, but everything else was perfect. Good value for money.',
      date: '2024-03-14',
      checkIn: '2024-03-08',
      checkOut: '2024-03-14',
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
      bookingId: 'BK002',
      verified: true
    },
    {
      id: 3,
      property: 'Mountain View Cabin',
      location: 'Aspen, CO',
      image: '🏔️',
      guest: 'Michael Brown',
      guestImage: 'MB',
      rating: 3,
      review: 'The cabin was nice and cozy, but there were some maintenance issues that weren\'t mentioned in the listing. The location was beautiful though. Host was responsive to our concerns.',
      date: '2024-03-12',
      checkIn: '2024-03-05',
      checkOut: '2024-03-12',
      hostResponse: 'We appreciate your feedback and apologize for the maintenance issues. We\'ve addressed them and hope you\'ll give us another chance in the future.',
      hostResponseDate: '2024-03-13',
      helpful: 5,
      notHelpful: 3,
      wouldRecommend: false,
      cleanliness: 3,
      communication: 4,
      checkInRating: 4,
      accuracy: 3,
      locationRating: 5,
      value: 3,
      bookingId: 'BK003',
      verified: true
    },
    {
      id: 4,
      property: 'Urban Studio Loft',
      location: 'Chicago, IL',
      image: '🏙️',
      guest: 'Emily Davis',
      guestImage: 'ED',
      rating: 5,
      review: 'Perfect place for a city getaway! The loft was exactly as pictured, clean, and had everything we needed. The location was great for exploring the city. Highly recommend!',
      date: '2024-03-10',
      checkIn: '2024-03-05',
      checkOut: '2024-03-10',
      hostResponse: null,
      helpful: 15,
      notHelpful: 0,
      wouldRecommend: true,
      cleanliness: 5,
      communication: 5,
      checkInRating: 5,
      accuracy: 5,
      locationRating: 5,
      value: 5,
      bookingId: 'BK004',
      verified: true
    }
  ])

  const [reviewsToWrite] = useState([
    {
      id: 1,
      guest: 'David Wilson',
      guestImage: 'DW',
      property: 'Cozy Suburban Home',
      location: 'Austin, TX',
      image: '🏡',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      bookingId: 'BK005',
      daysSinceCheckout: 2,
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
    { id: 'received', label: 'Received Reviews', count: reviews.length },
    { id: 'to_write', label: 'Reviews to Write', count: reviewsToWrite.length }
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
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            } ${onRate ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating)
    const matchesProperty = filterProperty === 'all' || review.property === filterProperty
    
    return matchesSearch && matchesRating && matchesProperty
  })

  const stats = {
    totalReviews: reviews.length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    fiveStarReviews: reviews.filter(r => r.rating === 5).length,
    fourStarReviews: reviews.filter(r => r.rating === 4).length,
    threeStarReviews: reviews.filter(r => r.rating === 3).length,
    responseRate: 75,
    averageResponseTime: '2 hours'
  }

  const handleReviewSubmit = () => {
    console.log('Submitting review:', reviewForm)
    // In a real app, this would call an API to submit the review
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reviews Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage guest reviews and maintain your property reputation
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReviews}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">5-Star Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fiveStarReviews}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.responseRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageResponseTime}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
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

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Properties</option>
              <option value="Luxury Downtown Apartment">Luxury Downtown Apartment</option>
              <option value="Beach House Paradise">Beach House Paradise</option>
              <option value="Mountain View Cabin">Mountain View Cabin</option>
              <option value="Urban Studio Loft">Urban Studio Loft</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'received' ? (
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-primary-600 dark:text-primary-300">
                        {review.guestImage}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {review.guest}
                        </h3>
                        {review.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{review.date}</span>
                        <span>•</span>
                        <span>{review.checkIn} - {review.checkOut}</span>
                        <span>•</span>
                        <span>Booking #{review.bookingId}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Flag className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-4 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {review.rating}.0
                    </span>
                    {review.wouldRecommend && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        ✓ Would recommend
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
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

                  {/* Property Info */}
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-lg">{review.image}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{review.property}</p>
                      <p className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {review.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Host Response */}
                {review.hostResponse ? (
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Your Response</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">{review.hostResponseDate}</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {review.hostResponse}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No response yet
                    </span>
                    <button className="flex items-center px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded font-medium transition-colors">
                      <Reply className="w-3 h-3 mr-1" />
                      Respond
                    </button>
                  </div>
                )}

                {/* Helpful Votes */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <ThumbsDown className="w-4 h-4" />
                      <span>Not helpful ({review.notHelpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviewsToWrite.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reviews to write
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You'll see reviews to write here after guests complete their stays
              </p>
            </div>
          ) : (
            reviewsToWrite.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Write a Review for {review.guest}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-lg">{review.image}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{review.property}</p>
                      <p className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {review.location}
                      </p>
                      <p>
                        Stay: {review.checkIn} - {review.checkOut}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Overall Rating
                  </label>
                  {renderStars(reviewForm.rating, (rating) => 
                    setReviewForm({...reviewForm, rating}), 'lg'
                  )}
                </div>

                {/* Detailed Ratings */}
                <div className="mb-6">
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Would you host this guest again?
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setReviewForm({...reviewForm, wouldRecommend: true})}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reviewForm.wouldRecommend === true
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setReviewForm({...reviewForm, wouldRecommend: false})}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reviewForm.wouldRecommend === false
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Written Review */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Written Review (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Share your experience with this guest..."
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewForm.rating === 0}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Reviews
