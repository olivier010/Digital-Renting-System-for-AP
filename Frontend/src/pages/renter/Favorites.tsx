import { useState } from 'react'
import { Heart, MapPin, Star, Bed, Bath, Square, DollarSign, Search, Filter, X } from 'lucide-react'

const Favorites = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('savedDate')

  const [favoriteProperties] = useState([
    {
      id: 1,
      title: 'Modern City Loft',
      location: 'San Francisco, CA',
      price: 2800,
      rating: 4.8,
      reviews: 124,
      image: '🏙️',
      beds: 2,
      baths: 1,
      sqft: 850,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Gym', 'Workspace'],
      savedDate: '2024-03-01',
      availability: 'Available Mar 15-30',
      host: 'Emily Chen',
      hostImage: 'EC',
      lastViewed: '2024-03-10',
      priceChange: 0,
      propertyType: 'apartment'
    },
    {
      id: 2,
      title: 'Cozy Beach Cottage',
      location: 'San Diego, CA',
      price: 2200,
      rating: 4.6,
      reviews: 89,
      image: '🏖️',
      beds: 1,
      baths: 1,
      sqft: 600,
      amenities: ['WiFi', 'Beach Access', 'Parking', 'Patio'],
      savedDate: '2024-02-28',
      availability: 'Available Apr 1-15',
      host: 'Robert Martinez',
      hostImage: 'RM',
      lastViewed: '2024-03-05',
      priceChange: -200,
      propertyType: 'house'
    },
    {
      id: 3,
      title: 'Luxury Penthouse',
      location: 'New York, NY',
      price: 4500,
      rating: 4.9,
      reviews: 67,
      image: '🏢',
      beds: 3,
      baths: 2,
      sqft: 1500,
      amenities: ['WiFi', 'Gym', 'Concierge', 'Pool', 'City View'],
      savedDate: '2024-02-15',
      availability: 'Available May 1-31',
      host: 'James Wilson',
      hostImage: 'JW',
      lastViewed: '2024-03-01',
      priceChange: 500,
      propertyType: 'penthouse'
    },
    {
      id: 4,
      title: 'Mountain Retreat Cabin',
      location: 'Aspen, CO',
      price: 3200,
      rating: 4.7,
      reviews: 45,
      image: '🏔️',
      beds: 2,
      baths: 2,
      sqft: 1100,
      amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Ski Access'],
      savedDate: '2024-02-10',
      availability: 'Available Dec 15 - Jan 15',
      host: 'Lisa Anderson',
      hostImage: 'LA',
      lastViewed: '2024-02-28',
      priceChange: 0,
      propertyType: 'cabin'
    },
    {
      id: 5,
      title: 'Urban Studio Apartment',
      location: 'Seattle, WA',
      price: 1800,
      rating: 4.5,
      reviews: 92,
      image: '🏙️',
      beds: 1,
      baths: 1,
      sqft: 500,
      amenities: ['WiFi', 'Kitchen', 'Gym', 'Laundry'],
      savedDate: '2024-01-25',
      availability: 'Available Mar 20-31',
      host: 'Michael Brown',
      hostImage: 'MB',
      lastViewed: '2024-02-20',
      priceChange: -100,
      propertyType: 'studio'
    }
  ])

  const [selectedProperties, setSelectedProperties] = useState<number[]>([])

  const togglePropertySelection = (propertyId: number) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const removeSelectedProperties = () => {
    // In a real app, this would call an API to remove from favorites
    console.log('Removing properties:', selectedProperties)
    setSelectedProperties([])
  }

  const filteredAndSortedProperties = favoriteProperties
    .filter(property => 
      searchTerm === '' || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'savedDate':
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
        case 'priceLow':
          return a.price - b.price
        case 'priceHigh':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600 dark:text-red-400'
    if (change < 0) return 'text-green-600 dark:text-green-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getPriceChangeText = (change: number) => {
    if (change > 0) return `+$${change}`
    if (change < 0) return `-$${Math.abs(change)}`
    return 'No change'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Favorite Properties
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Properties you've saved for later viewing
            </p>
          </div>
          {selectedProperties.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProperties.length} selected
              </span>
              <button
                onClick={removeSelectedProperties}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Remove Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search saved properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="savedDate">Sort by: Saved Date</option>
              <option value="priceLow">Sort by: Price (Low to High)</option>
              <option value="priceHigh">Sort by: Price (High to Low)</option>
              <option value="rating">Sort by: Rating</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{favoriteProperties.length}</p>
            </div>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${Math.round(favoriteProperties.reduce((sum, p) => sum + p.price, 0) / favoriteProperties.length)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(favoriteProperties.reduce((sum, p) => sum + p.rating, 0) / favoriteProperties.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Price Drops</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {favoriteProperties.filter(p => p.priceChange < 0).length}
              </p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredAndSortedProperties.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No saved properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Start browsing and save properties you like!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProperties.map((property) => (
            <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl">
                {property.image}
                
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => togglePropertySelection(property.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                
                {/* Remove Button */}
                <button className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                
                {/* Availability Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                    {property.availability}
                  </span>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${property.price}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                    {property.priceChange !== 0 && (
                      <p className={`text-xs font-medium ${getPriceChangeColor(property.priceChange)}`}>
                        {getPriceChangeText(property.priceChange)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                      {property.rating}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      ({property.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.beds} beds
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.baths} baths
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    {property.sqft} sqft
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {property.amenities.slice(0, 3).map((amenity: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Host and Saved Date */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-300">
                        {property.hostImage}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                      {property.host}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Saved {property.savedDate}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Viewed {property.lastViewed}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg font-medium transition-colors">
                    Book Now
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
