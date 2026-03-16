import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../utils/api'
import type { Property } from '../../types'
import { Search, MapPin, Star, Heart, Eye, Phone, Home, Building2, Car, Landmark, Store, Package, Filter, Grid, List, ChevronDown } from 'lucide-react'

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

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [favoriteError, setFavoriteError] = useState<string | null>(null)
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<number[]>([])

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const res = await apiFetch('/favorites');
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
        await apiFetch(`/favorites/${propertyId}`, { method: 'DELETE' });
        await fetchFavorites();
      } catch (err) {
        setFavoriteError('Failed to remove from favorites.');
      }
    } else {
      try {
        await apiFetch('/favorites', {
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

        const res = await apiFetch(`/properties?${params.toString()}`)
        // API returns { data: { content: [ ... ] } }
        const items = res.data?.content || []
        // Map backend fields to frontend Property type
        setProperties(items.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          location: p.location,
          category: p.category,
          images: Array.isArray(p.images)
            ? p.images.map((img: string) => img && !img.startsWith('http') ? `http://localhost:8080${img}` : img)
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
        })))
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties')
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [searchFilters])



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading && (
        <div className="text-center py-8 text-lg text-gray-600 dark:text-gray-300">Loading properties...</div>
      )}
      {error && (
        <div className="text-center py-8 text-lg text-red-500">{error}</div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Find Your Perfect Property
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {loading ? 'Loading...' : `${properties.length} properties available`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={searchFilters.sortBy}
                onChange={(e) => setSearchFilters({...searchFilters, sortBy: e.target.value})}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="City, neighborhood, or address"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchFilters.checkIn}
              onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchFilters.checkOut}
              onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchFilters.category}
              onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="car">Car</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchFilters.priceRange[0]}
                onChange={(e) => setSearchFilters({...searchFilters, priceRange: [parseInt(e.target.value), searchFilters.priceRange[1]]})}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchFilters.priceRange[1]}
                onChange={(e) => setSearchFilters({...searchFilters, priceRange: [searchFilters.priceRange[0], parseInt(e.target.value)]})}
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {loading ? 'Loading...' : `${properties.length} Properties Found`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Based on your search criteria
          </p>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const CategoryIcon = categoryIcons[property.category] || Package
          return (
            <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl">
                {property.images && property.images.length > 0 ? (
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <span>{CategoryIcon === Home ? '🏠' : CategoryIcon === Building2 ? '🏢' : CategoryIcon === Car ? '🚗' : '🏡'}</span>
                )}
                {!property.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Not Available</span>
                  </div>
                )}

                {/* Favorite and View Details Icons */}
                <div className="absolute bottom-3 right-3 flex flex-row-reverse space-x-reverse space-x-2">
                  <button
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
                    title={favoritePropertyIds.includes(Number(property.id)) ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => toggleFavorite(Number(property.id))}
                  >
                    <Heart className={
                      `w-4 h-4 transition-colors duration-150 ` +
                      (favoritePropertyIds.includes(Number(property.id))
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400')
                    } />
                  </button>
                  <Link
                    to={`/properties/${property.id}`}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </Link>
                </div>
                      {favoriteError && (
                        <div className="text-center py-2 text-red-500">{favoriteError}</div>
                      )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2 py-1 bg-white dark:bg-gray-800 text-xs font-medium rounded-full shadow-sm capitalize">
                    <CategoryIcon className="w-3 h-3 mr-1" />
                    {property.category}
                  </span>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
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
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                    {property.bookings} bookings
                  </span>
                </div>

                {/* Contact Info */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <Phone className="w-4 h-4 mr-1" />
                  {property.owner.phone}
                </div>

                {/* Owner and Book */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {property.owner.name}
                  </span>
                  {property.available ? (
                    <Link
                      to={`/properties/${property.id}`}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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

      {/* No Results Message */}
      {properties.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search filters to see more results
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchProperties
