import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import { Heart, MapPin, Star, DollarSign, Search, Filter, X, Home, Building2, Car, Landmark, Store, Package } from 'lucide-react'

const categoryIcons: Record<string, typeof Home> = {
  house: Home,
  apartment: Building2,
  car: Car,
  land: Landmark,
  commercial: Store,
  other: Package,
}

const Favorites = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('savedDate')
  const [showAllFavorites, setShowAllFavorites] = useState(false)

  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      setError(null)
      try {
        // Backend returns: { data: { content: [ ... ], ...pagination } }
        const res = await apiFetch('/favorites')
        // Map backend FavoriteResponse to UI shape
        const mapped = (res?.data?.content || []).map((fav: any) => {
          const p = fav.property
          return {
            id: p.id,
            title: p.title,
            location: p.location,
            price: Number(p.price),
            rating: Number(p.rating),
            reviews: p.reviewsCount,
            image: p.image || '',
            category: p.category,
            bookings: 0, // Not provided by backend
            savedDate: fav.savedAt ? fav.savedAt.split('T')[0] : '',
            availability: p.isAvailable ? 'Available' : 'Unavailable',
            owner: { name: '', phone: '' }, // Not provided by backend
            lastViewed: '', // Not provided by backend
            priceChange: 0 // Not provided by backend
          }
        })
        setFavoriteProperties(mapped)
      } catch (err: any) {
        setError(err.message || 'Failed to load favorites')
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg text-gray-600 dark:text-gray-300">Loading favorites...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
      </div>
    )
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        <>
          {/* First Row - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {filteredAndSortedProperties.slice(0, 4).map((property) => {
              const CategoryIcon = categoryIcons[property.category] || Package
              return (
                <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group">
                  {/* Property Image */}
                  <div className="relative h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {property.image ? (
                      <img
                        src={property.image.startsWith('http') ? property.image : `http://localhost:8080${property.image}`}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CategoryIcon className="w-8 h-8 text-gray-400" />
                    )}
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => togglePropertySelection(property.id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    
                    {/* Remove Button */}
                    <button className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                      <X className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className="flex items-center gap-0.5 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                        <CategoryIcon className="w-2.5 h-2.5" />
                        {property.category}
                      </span>
                    </div>
                    
                    {/* Availability Badge */}
                    <div className="absolute bottom-2 right-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        property.availability === 'Available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {property.availability}
                      </span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-3">
                    {/* Title & Price */}
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ${property.price}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center mr-3">
                          <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                          <span>{property.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span>{property.bookings}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {property.reviews} reviews
                      </span>
                    </div>

                    {/* Price Change & Saved Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        {property.priceChange !== 0 && (
                          <span className={`text-xs font-medium ${getPriceChangeColor(property.priceChange)}`}>
                            {getPriceChangeText(property.priceChange)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Saved {property.savedDate}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* See More Link */}
          {filteredAndSortedProperties.length > 4 && !showAllFavorites && (
            <div className="text-center">
              <button
                onClick={() => setShowAllFavorites(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                See More Favorites ({filteredAndSortedProperties.length - 4} more)
              </button>
            </div>
          )}

          {/* Remaining Properties (shown when "See More" is clicked) */}
          {showAllFavorites && filteredAndSortedProperties.length > 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedProperties.slice(4).map((property) => {
                const CategoryIcon = categoryIcons[property.category] || Package
                return (
                  <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group">
                    {/* Property Image */}
                    <div className="relative h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {property.image ? (
                        <img
                          src={property.image.startsWith('http') ? property.image : `http://localhost:8080${property.image}`}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CategoryIcon className="w-8 h-8 text-gray-400" />
                      )}
                      
                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property.id)}
                          onChange={() => togglePropertySelection(property.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </div>
                      
                      {/* Remove Button */}
                      <button className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                        <X className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                      </button>
                      
                      {/* Category Badge */}
                      <div className="absolute bottom-2 left-2">
                        <span className="flex items-center gap-0.5 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          <CategoryIcon className="w-2.5 h-2.5" />
                          {property.category}
                        </span>
                      </div>
                      
                      {/* Availability Badge */}
                      <div className="absolute bottom-2 right-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          property.availability === 'Available' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {property.availability}
                        </span>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="p-3">
                      {/* Title & Price */}
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            ${property.price}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">/month</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center mr-3">
                            <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                            <span>{property.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            <span>{property.bookings}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {property.reviews} reviews
                        </span>
                      </div>

                      {/* Price Change & Saved Date */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                          {property.priceChange !== 0 && (
                            <span className={`text-xs font-medium ${getPriceChangeColor(property.priceChange)}`}>
                              {getPriceChangeText(property.priceChange)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Saved {property.savedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Favorites
