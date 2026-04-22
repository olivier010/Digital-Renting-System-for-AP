import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../utils/api'
import type { Property } from '../../types'
import { Search, MapPin, Star, Heart, Eye, Home, Building2, Car, Landmark, Store, Package, Filter, Grid, List, ChevronDown } from 'lucide-react'

const categoryIcons: Record<string, typeof Home> = {
  house: Home,
  apartment: Building2,
  car: Car,
  land: Landmark,
  commercial: Store,
  other: Package,
}

const SearchProperties = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    priceRange: [0, 5000],
    category: 'all',
    sortBy: 'recommended'
  })

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showAllProperties, setShowAllProperties] = useState(false)

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [favoriteError, setFavoriteError] = useState<string | null>(null)
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<number[]>([])

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const res = await apiFetch('/api/favorites');
      // API returns { data: { content: [ { property: { id, ... }, ... } ] } }
      const items = res.data?.content || [];
      const ids = items.map((fav: any) => fav.property?.id).filter((id: any) => typeof id === 'number');
      setFavoritePropertyIds(ids);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };
  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async (propertyId: number) => {
    setFavoriteError(null);
    if (favoritePropertyIds.includes(propertyId)) {
      // Remove from favorites
      try {
        await apiFetch(`/api/favorites/${propertyId}`, { method: 'DELETE' });
        await fetchFavorites();
      } catch (err) {
        setFavoriteError('Failed to remove from favorites.');
      }
    } else {
      try {
        await apiFetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId })
        });
        await fetchFavorites();
      } catch (err) {
        setFavoriteError('Failed to add to favorites.');
      }
    }
  };

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        // Build query params from filters
        const params = new URLSearchParams()
        if (searchFilters.category && searchFilters.category !== 'all') params.append('category', searchFilters.category)
        if (searchFilters.location) params.append('location', searchFilters.location)
        if (searchFilters.priceRange[0]) params.append('minPrice', String(searchFilters.priceRange[0]))
        if (searchFilters.priceRange[1]) params.append('maxPrice', String(searchFilters.priceRange[1]))
        // Optionally add sort
        if (searchFilters.sortBy && searchFilters.sortBy !== 'recommended') params.append('sort', searchFilters.sortBy)
        // Only show available by default
        params.append('available', 'true')

        const res = await apiFetch(`/api/properties?${params.toString()}`)
        // API returns { data: { content: [ ... ] } }
        const items = res.data?.content || []
        // Map backend fields to frontend Property type
        setProperties(items
          .filter((p: any) => p.isVerified)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            location: p.location,
            category: p.category,
            images: Array.isArray(p.images)
              ? p.images.map((img: string) => img && !img.startsWith('http') ? `${import.meta.env.VITE_API_URL}${img}` : img)
              : [],
            available: p.isAvailable,
            bookings: p.bookingsCount,
            rating: p.rating,
            reviews: p.reviewsCount,
            status: p.status,
            owner: {
              id: p.owner?.id,
              name: p.owner?.name,
              email: p.owner?.email,
              phone: p.owner?.phone,
            },
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }))
        )
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties')
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [searchFilters])



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-primary-100 dark:text-primary-200 max-w-2xl mx-auto">
              Discover amazing properties for rent, sale, or lease in your preferred location
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">Loading properties...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Results Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
                  {properties.length} Properties Found
                </h2>
                <p className="text-surface-500 dark:text-surface-400">
                  Based on your search criteria
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-surface-600 shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-surface-600 shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={searchFilters.sortBy}
                    onChange={(e) => setSearchFilters({...searchFilters, sortBy: e.target.value})}
                    className="appearance-none bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-surface-400 pointer-events-none" />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 px-4 py-2 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

      {/* Property Grid */}
            <div>
              {/* First Two Rows - Always Visible */}
              <div className={`grid gap-6 mb-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {properties.slice(0, viewMode === 'grid' ? 8 : properties.length).map((property) => {
                  const CategoryIcon = categoryIcons[property.category] || Package
                  return (
                    <div key={property.id} className={`bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}>
                      {/* Property Image */}
                      <div className={`relative ${
                        viewMode === 'list' ? 'w-64 h-48 flex-shrink-0' : 'h-48'
                      } bg-surface-200 dark:bg-surface-700 flex items-center justify-center`}>
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <CategoryIcon className="w-16 h-16 text-surface-400" />
                        )}
                        
                        {/* Availability Overlay */}
                        {!property.available && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">Not Available</span>
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-soft dark:shadow-dark-soft">
                            <CategoryIcon className="w-3 h-3" />
                            {property.category}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <button
                            className="p-2 bg-white dark:bg-surface-800 rounded-full shadow-soft dark:shadow-dark-soft hover:shadow-xl transition-all duration-200 group/btn"
                            title={favoritePropertyIds.includes(Number(property.id)) ? 'Remove from favorites' : 'Add to favorites'}
                            onClick={() => toggleFavorite(Number(property.id))}
                          >
                            <Heart className={`w-4 h-4 transition-colors duration-200 group-hover/btn:scale-110 ${
                              favoritePropertyIds.includes(Number(property.id))
                                ? 'fill-red-500 text-red-500'
                                : 'text-surface-400 group-hover/btn:text-red-500'
                            }`} />
                          </button>
                          <Link
                            to={`/properties/${property.id}`}
                            className="p-2 bg-white dark:bg-surface-800 rounded-full shadow-soft dark:shadow-dark-soft hover:shadow-xl transition-all duration-200 group/btn"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover/btn:scale-110" />
                          </Link>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className={`flex justify-between items-start mb-3 ${viewMode === 'list' ? '' : ''}`}>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-surface-500 dark:text-surface-400 mb-3">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm line-clamp-1">{property.location}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                              ${property.price}
                            </p>
                            <p className="text-sm text-surface-500 dark:text-surface-400">per month</p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="text-sm font-medium text-surface-900 dark:text-white">
                                {property.rating}
                              </span>
                              <span className="text-sm text-surface-500 dark:text-surface-400 ml-1">
                                ({property.reviews})
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>{property.bookings} bookings</span>
                            </div>
                          </div>
                        </div>

                        {/* Owner Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
                            <div className="w-8 h-8 bg-surface-200 dark:bg-surface-600 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-medium text-surface-600 dark:text-surface-300">
                                {property.owner.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span>{property.owner.name}</span>
                          </div>
                          
                          {property.available ? (
                            <Link
                              to={`/properties/${property.id}`}
                              className="flex items-center justify-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-soft dark:shadow-dark-soft hover:shadow-md whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View
                            </Link>
                          ) : (
                            <button
                              className="px-4 py-2 bg-surface-300 dark:bg-surface-600 text-surface-500 dark:text-surface-400 rounded-lg font-medium cursor-not-allowed"
                              disabled
                            >
                              Unavailable
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* See More Button */}
              {viewMode === 'grid' && properties.length > 8 && !showAllProperties && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllProperties(true)}
                    className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-soft dark:shadow-dark-soft hover:shadow-xl"
                  >
                    See More Properties ({properties.length - 8} more)
                  </button>
                </div>
              )}

              {/* Remaining Properties (shown when "See More" is clicked) */}
              {viewMode === 'grid' && showAllProperties && properties.length > 8 && (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {properties.slice(8).map((property) => {
                    const CategoryIcon = categoryIcons[property.category] || Package
                    return (
                      <div key={property.id} className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        {/* Property Image */}
                        <div className="relative h-48 bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          ) : (
                            <CategoryIcon className="w-16 h-16 text-surface-400" />
                          )}
                          
                          {/* Availability Overlay */}
                          {!property.available && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">Not Available</span>
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-soft dark:shadow-dark-soft">
                              <CategoryIcon className="w-3 h-3" />
                              {property.category}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute bottom-3 right-3 flex space-x-2">
                            <button
                              className="p-2 bg-white dark:bg-surface-800 rounded-full shadow-soft dark:shadow-dark-soft hover:shadow-xl transition-all duration-200 group/btn"
                              title={favoritePropertyIds.includes(Number(property.id)) ? 'Remove from favorites' : 'Add to favorites'}
                              onClick={() => toggleFavorite(Number(property.id))}
                            >
                              <Heart className={`w-4 h-4 transition-colors duration-200 group-hover/btn:scale-110 ${
                                favoritePropertyIds.includes(Number(property.id))
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-surface-400 group-hover/btn:text-red-500'
                              }`} />
                            </button>
                            <Link
                              to={`/properties/${property.id}`}
                              className="p-2 bg-white dark:bg-surface-800 rounded-full shadow-soft dark:shadow-dark-soft hover:shadow-xl transition-all duration-200 group/btn"
                              title="View details"
                            >
                              <Eye className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover/btn:scale-110" />
                            </Link>
                          </div>
                        </div>

                        {/* Property Info */}
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-surface-500 dark:text-surface-400 mb-3">
                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="text-sm line-clamp-1">{property.location}</span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                ${property.price}
                              </p>
                              <p className="text-sm text-surface-500 dark:text-surface-400">per month</p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                <span className="text-sm font-medium text-surface-900 dark:text-white">
                                  {property.rating}
                                </span>
                                <span className="text-sm text-surface-500 dark:text-surface-400 ml-1">
                                  ({property.reviews})
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span>{property.bookings} bookings</span>
                              </div>
                            </div>
                          </div>

                          {/* Owner Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
                              <div className="w-8 h-8 bg-surface-200 dark:bg-surface-600 rounded-full flex items-center justify-center mr-2">
                                <span className="text-xs font-medium text-surface-600 dark:text-surface-300">
                                  {property.owner.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span>{property.owner.name}</span>
                            </div>
                            
                            {property.available ? (
                              <Link
                                to={`/properties/${property.id}`}
                                className="flex items-center justify-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-soft dark:shadow-dark-soft hover:shadow-md whitespace-nowrap"
                              >
                                <Eye className="w-4 h-4 mr-1.5" />
                                View
                              </Link>
                            ) : (
                              <button
                                className="px-4 py-2 bg-surface-300 dark:bg-surface-600 text-surface-500 dark:text-surface-400 rounded-lg font-medium cursor-not-allowed"
                                disabled
                              >
                                Unavailable
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

      {/* No Results Message */}
            {properties.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-surface-100 dark:bg-surface-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-surface-400" />
                </div>
                <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-3">
                  No properties found
                </h3>
                <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-6">
                  Try adjusting your search filters or browse different categories to see more results
                </p>
                <button
                  onClick={() => setSearchFilters({
                    location: '',
                    checkIn: '',
                    checkOut: '',
                    priceRange: [0, 5000],
                    category: 'all',
                    sortBy: 'recommended'
                  })}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Favorite Error Message */}
            {favoriteError && (
              <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-sm shadow-soft dark:shadow-dark-soft">
                <p className="text-red-600 dark:text-red-400 text-sm">{favoriteError}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchProperties


