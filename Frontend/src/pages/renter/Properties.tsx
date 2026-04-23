import { useState, useEffect } from 'react'
import PropertyCard from '../../components/PropertyCard'
import type { Property } from '../../types'
import Loading from '../../components/ui/Loading'
import { Star } from 'lucide-react'
import { apiFetch } from '../../utils/api'


const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'popular'>('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllProperties, setShowAllProperties] = useState(false)
  const ITEMS_PER_PAGE = 6 // 2 rows of 3 items each

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const res = await apiFetch('/api/properties?page=0&size=100');
        // API returns { success, data: { content: [...] } }
        let apiProperties = res.data?.content || [];
        // Fix image URLs: prefix with backend base if relative
        apiProperties = apiProperties.map((p: any) => ({
          ...p,
          available: p.isAvailable, // map backend isAvailable to frontend available
          images: Array.isArray(p.images)
            ? p.images.map((img: string) => img && !img.startsWith('http') ? `${import.meta.env.VITE_API_URL}${img}` : img)
            : [],
        }));
        // Only show verified properties
        const verifiedProperties = apiProperties.filter((p: any) => p.isVerified)
        setProperties(verifiedProperties)
        setFilteredProperties(verifiedProperties)
      } catch (err) {
        setProperties([])
        setFilteredProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  // Search and sort handler
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowAllProperties(false) // Reset show all when searching
    let filtered = properties.filter(property => {
      if (!property.isVerified) return false;
      if (query && !property.location.toLowerCase().includes(query.toLowerCase()) &&
        !property.title.toLowerCase().includes(query.toLowerCase()) &&
        !property.description.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      return true
    })
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price
      } else if (sortBy === 'price-desc') {
        return b.price - a.price
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'popular') {
        return (b.bookings * b.rating) - (a.bookings * a.rating)
      }
      return 0
    })
    setFilteredProperties(filtered)
  }

  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy)
    setShowAllProperties(false) // Reset show all when sorting
    // Re-apply current search with new sort
    handleSearch(searchQuery)
  }

  // Calculate properties to display
  const displayProperties = showAllProperties
    ? filteredProperties
    : filteredProperties.slice(0, ITEMS_PER_PAGE)

  const shouldShowViewMore = filteredProperties.length > ITEMS_PER_PAGE && !showAllProperties

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Perfect Rental</h1>
            <p className="text-xl text-primary-100 mb-8">
              Explore our curated collection of premium properties across the most desirable locations
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{properties.length}+</div>
                <div className="text-sm text-primary-100">Properties</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-primary-100">Cities</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold flex items-center">
                  <Star className="w-6 h-6 mr-1 fill-current text-yellow-500" />
                  4.8
                </div>
                <div className="text-sm text-primary-100">Avg Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-primary-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-surface-600 shadow-sm' : ''}`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5 text-surface-600 dark:text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-surface-600 shadow-sm' : ''}`}
                  title="List View"
                >
                  <svg className="w-5 h-5 text-surface-600 dark:text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Main Content */}
          <div>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
                  {filteredProperties.length} Properties Found
                </h2>
                <p className="text-surface-600 dark:text-surface-300">
                  {loading ? 'Searching...' : 'Discover your perfect home from our curated selection'}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-800 text-surface-900 dark:text-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-16">
                <Loading size="lg" text="Finding perfect properties for you..." />
              </div>
            )}

            {/* Properties Grid/List */}
            {!loading && filteredProperties.length > 0 && (
              <div>
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-6'}>
                  {displayProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* View More Button */}
                {shouldShowViewMore && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowAllProperties(true)}
                      className="inline-flex items-center px-6 py-2 bg-white dark:bg-surface-800 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-700 transition-all duration-200 font-medium shadow-md hover:shadow-soft dark:shadow-dark-soft transform hover:scale-105 text-sm"
                    >
                      <span>View More Properties</span>
                      <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                      Showing {displayProperties.length} of {filteredProperties.length} properties
                    </p>
                  </div>
                )}

                {/* Show Less Button (when showing all) */}
                {showAllProperties && filteredProperties.length > ITEMS_PER_PAGE && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowAllProperties(false)}
                      className="inline-flex items-center px-6 py-2 bg-white dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-200 font-medium shadow-md hover:shadow-soft dark:shadow-dark-soft transform hover:scale-105 text-sm"
                    >
                      <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>Show Less</span>
                    </button>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                      Showing all {filteredProperties.length} properties
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-surface-100 dark:bg-surface-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-surface-400 dark:text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-3">No properties found</h3>
                <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
                  We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilteredProperties(properties)
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Load More */}
            {/*
            {!loading && filteredProperties.length > 0 && filteredProperties.length < properties.length && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-white dark:bg-surface-800 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-700 transition-colors font-medium">
                  Load More Properties
                </button>
              </div>
            )}
            */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Properties


