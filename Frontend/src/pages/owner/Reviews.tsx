import { useState, useEffect } from 'react'
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

  type Review = {
    id: number;
    property: string;
    location: string;
    image: string;
    guest: string;
    guestImage: string;
    rating: number;
    review: string;
    date: string;
    checkIn: string;
    checkOut: string;
    hostResponse: string | null;
    hostResponseDate?: string;
    helpful: number;
    notHelpful: number;
    wouldRecommend: boolean | null;
    cleanliness: number;
    communication: number;
    checkInRating: number;
    accuracy: number;
    locationRating: number;
    value: number;
    bookingId: string;
    verified: boolean;
  };
  type ReviewToWrite = {
    id: number;
    guest: string;
    guestImage: string;
    property: string;
    location: string;
    image: string;
    checkIn: string;
    checkOut: string;
    bookingId: string;
    daysSinceCheckout: number;
    rating: number;
    review: string;
    wouldRecommend: boolean | null;
    cleanliness: number;
    communication: number;
    checkInRating: number;
    accuracy: number;
    locationRating: number;
    value: number;
  };
  const [reviews, setReviews] = useState<Review[]>([])

  // Fetch reviews from API on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('rentwise_token');
        if (!token) return;
        const res = await fetch('http://localhost:8080/api/owner/reviews', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        // Map API data to Review[] (match API response fields)
        const apiReviews = (data.data?.content || []).map((r: any) => ({
          id: r.id,
          property: r.propertyTitle || '',
          location: '', // Not provided in API
          image: '', // Not provided in API
          guest: r.reviewer?.name || '',
          guestImage: r.reviewer?.avatar || '',
          rating: r.overallRating || 0,
          review: r.comment || '',
          date: r.createdAt || '',
          checkIn: '',
          checkOut: '',
          hostResponse: r.hostResponse || null,
          hostResponseDate: r.hostResponseDate || '',
          helpful: r.helpfulCount || 0,
          notHelpful: 0,
          wouldRecommend: r.wouldRecommend ?? null,
          cleanliness: r.cleanliness || 0,
          communication: r.communication || 0,
          checkInRating: r.checkIn || 0,
          accuracy: r.accuracy || 0,
          locationRating: r.locationRating || 0,
          value: r.value || 0,
          bookingId: r.bookingId?.toString() || '',
          verified: r.isVerified || false,
        }));
        setReviews(apiReviews);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchReviews();
  }, []);

  const [reviewsToWrite] = useState<ReviewToWrite[]>([])

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
  }) // No mock data, just empty initial state

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
                : 'text-surface-300 dark:text-surface-600'
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
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Reviews Management
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Manage guest reviews and maintain your property reputation
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Reviews</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.totalReviews}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Average Rating</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.averageRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">5-Star Reviews</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.fiveStarReviews}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Response Rate</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.responseRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Avg Response</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.averageResponseTime}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
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

      {/* Search and Filter */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
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
              className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm"
            >
              <option value="all">All Properties</option>
              {/* Dynamically generate property options from reviews if available */}
              {/* {Array.from(new Set(reviews.map(r => r.property))).map(property => (
                <option key={property} value={property}>{property}</option>
              ))} */}
            </select>
            
            <button className="flex items-center px-4 py-2 border border-surface-200 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'received' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReviews.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MessageSquare className="w-16 h-16 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                No reviews found
              </h3>
              <p className="text-surface-500 dark:text-surface-400">
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                          {review.guestImage ? (
                            <img src={review.guestImage} alt={review.guest} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            review.guest.charAt(0).toUpperCase()
                          )}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-surface-900 dark:text-white text-sm truncate">
                            {review.guest}
                          </h3>
                          {review.verified && (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-surface-500 dark:text-surface-400">
                          <span>{review.date}</span>
                          <span>•</span>
                          <span className="truncate">{review.property}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button className="p-1.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 rounded hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 rounded hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rating and Property Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm font-medium text-surface-900 dark:text-white">
                        {review.rating}.0
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{review.location}</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-4">
                  <p className="text-sm text-surface-700 dark:text-surface-300 mb-3 line-clamp-3">
                    {review.review}
                  </p>
                  
                  {review.wouldRecommend && (
                    <div className="flex items-center text-xs text-green-600 dark:text-green-400 mb-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Would recommend
                    </div>
                  )}
                  
                  {/* Detailed Ratings */}
                  <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Cleanliness</p>
                      <div className="flex justify-center items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-surface-900 dark:text-white ml-1">{review.cleanliness}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Communication</p>
                      <div className="flex justify-center items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-surface-900 dark:text-white ml-1">{review.communication}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Value</p>
                      <div className="flex justify-center items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-surface-900 dark:text-white ml-1">{review.value}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400 mb-3">
                    <span>{review.checkIn} - {review.checkOut}</span>
                    <span>#{review.bookingId}</span>
                  </div>

                  {/* Response Section */}
                  {review.hostResponse ? (
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Your Response</span>
                        <span className="text-xs text-surface-500 dark:text-surface-400">{review.hostResponseDate}</span>
                      </div>
                      <p className="text-xs text-surface-700 dark:text-surface-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        {review.hostResponse}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button className="flex items-center text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                        <Reply className="w-3 h-3 mr-1" />
                        Respond to review
                      </button>
                      <div className="flex items-center space-x-3 text-xs text-surface-500 dark:text-surface-400">
                        <button className="flex items-center hover:text-surface-700 dark:hover:text-surface-300">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {review.helpful}
                        </button>
                        <button className="flex items-center hover:text-surface-700 dark:hover:text-surface-300">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          {review.notHelpful}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'to-write' ? (
        <div className="space-y-6">
          {reviewsToWrite.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                No reviews to write
              </h3>
              <p className="text-surface-500 dark:text-surface-400">
                You'll see reviews to write here after guests complete their stays
              </p>
            </div>
          ) : (
            reviewsToWrite.map((review) => (
              <div key={review.id} className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                    Write a Review for {review.guest}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                    <span className="text-lg">{review.image}</span>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">{review.property}</p>
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
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Overall Rating
                  </label>
                  {renderStars(reviewForm.rating, (rating) => 
                    setReviewForm({...reviewForm, rating}), 'lg'
                  )}
                </div>

                {/* Detailed Ratings */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-4">
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
                        <span className="text-sm text-surface-700 dark:text-surface-300">{label}</span>
                        {renderStars(reviewForm[key as keyof typeof reviewForm] as number, (rating) => 
                          setReviewForm({...reviewForm, [key]: rating}), 'sm'
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Would Recommend */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Would you host this guest again?
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setReviewForm({...reviewForm, wouldRecommend: true})}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reviewForm.wouldRecommend === true
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setReviewForm({...reviewForm, wouldRecommend: false})}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reviewForm.wouldRecommend === false
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Written Review */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Written Review (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
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
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

export default Reviews


