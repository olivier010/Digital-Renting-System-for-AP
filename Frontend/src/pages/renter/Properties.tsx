import { useState } from 'react'
import PropertyCard from '../../components/PropertyCard'
import type { Property } from '../../types'
import Loading from '../../components/ui/Loading'
import { Star } from 'lucide-react'

// Enhanced mock data with more realistic properties
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Downtown Apartment',
    description: 'Experience urban living at its finest in this stunning modern apartment with floor-to-ceiling windows and breathtaking city views.',
    price: 2500,
    location: 'Manhattan, New York',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: 'apartment',
    images: [],
    amenities: ['WiFi', 'Gym', 'Parking', 'Pool', 'Concierge', 'Rooftop Terrace'],
    available: true,
    owner: {
      id: 'owner1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234-567-8900'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Charming Suburban Family Home',
    description: 'Perfect family retreat with spacious rooms, beautiful garden, and excellent school district. Your dream home awaits.',
    price: 3200,
    location: 'Westchester, New York',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'house',
    images: [],
    amenities: ['WiFi', 'Parking', 'Garden', 'Storage', 'Garage', 'Patio'],
    available: true,
    owner: {
      id: 'owner2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8901'
    },
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Ultra-Modern Penthouse Suite',
    description: 'Indulge in luxury with this penthouse featuring panoramic views, premium finishes, and exclusive building amenities.',
    price: 5000,
    location: 'Upper East Side, New York',
    bedrooms: 3,
    bathrooms: 3,
    area: 2500,
    type: 'apartment',
    images: [],
    amenities: ['WiFi', 'Gym', 'Parking', 'Pool', 'Concierge', 'Rooftop', 'Wine Cellar', 'Smart Home'],
    available: true,
    owner: {
      id: 'owner3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 234-567-8902'
    },
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Oceanfront Beach Villa',
    description: 'Wake up to ocean views in this stunning beachfront property with private beach access and luxury amenities.',
    price: 4500,
    location: 'Miami Beach, Florida',
    bedrooms: 4,
    bathrooms: 3,
    area: 3000,
    type: 'house',
    images: [],
    amenities: ['WiFi', 'Parking', 'Pool', 'Beach Access', 'Outdoor Kitchen', 'Hot Tub', 'Guest House'],
    available: true,
    owner: {
      id: 'owner4',
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      phone: '+1 234-567-8903'
    },
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '5',
    title: 'Trendy Brooklyn Studio Loft',
    description: 'Perfect for young professionals, this industrial-chic studio combines style, functionality, and prime location.',
    price: 1800,
    location: 'Williamsburg, Brooklyn',
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    type: 'studio',
    images: [],
    amenities: ['WiFi', 'Gym', 'Laundry', 'Rooftop Access', 'Bike Storage', 'Co-working Space'],
    available: true,
    owner: {
      id: 'owner5',
      name: 'David Kim',
      email: 'david@example.com',
      phone: '+1 234-567-8904'
    },
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z'
  },
  {
    id: '6',
    title: 'Luxury Mountain Retreat',
    description: 'Escape to this sophisticated mountain cabin featuring modern amenities, stunning views, and ultimate privacy.',
    price: 2200,
    location: 'Aspen, Colorado',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    type: 'house',
    images: [],
    amenities: ['WiFi', 'Parking', 'Fireplace', 'Hot Tub', 'Mountain Views', 'Ski Storage', 'Smart Home'],
    available: true,
    owner: {
      id: 'owner6',
      name: 'Lisa Thompson',
      email: 'lisa@example.com',
      phone: '+1 234-567-8905'
    },
    createdAt: '2024-01-10T16:30:00Z',
    updatedAt: '2024-01-10T16:30:00Z'
  },
  {
    id: '7',
    title: 'Historic Brownstone Townhouse',
    description: 'Step into history with this beautifully restored brownstone featuring original details and modern conveniences.',
    price: 3800,
    location: 'Park Slope, Brooklyn',
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    type: 'house',
    images: [],
    amenities: ['WiFi', 'Parking', 'Garden', 'Storage', 'Original Details', 'Modern Kitchen'],
    available: true,
    owner: {
      id: 'owner7',
      name: 'Robert Williams',
      email: 'robert@example.com',
      phone: '+1 234-567-8906'
    },
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z'
  },
  {
    id: '8',
    title: 'Waterfront Condo with Marina Access',
    description: 'Luxury waterfront living with private marina access, stunning water views, and resort-style amenities.',
    price: 4200,
    location: 'Newport, Rhode Island',
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    type: 'apartment',
    images: [],
    amenities: ['WiFi', 'Gym', 'Parking', 'Pool', 'Marina Access', 'Concierge', 'Wine Storage'],
    available: true,
    owner: {
      id: 'owner8',
      name: 'Jennifer Davis',
      email: 'jennifer@example.com',
      phone: '+1 234-567-8907'
    },
    createdAt: '2024-01-08T14:30:00Z',
    updatedAt: '2024-01-08T14:30:00Z'
  }
]

const Properties = () => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'popular'>('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setLoading(true)
    setSearchQuery(query)
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      let filtered = mockProperties.filter(property => {
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
          // Simulate popularity based on price and features
          return (b.price * b.amenities.length) - (a.price * a.amenities.length)
        }
        return 0
      })

      setFilteredProperties(filtered)
      setLoading(false)
    }, 800)
  }

  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy)
    // Re-apply current search with new sort
    handleSearch(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
                <div className="text-2xl font-bold">{mockProperties.length}+</div>
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                  title="List View"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {filteredProperties.length} Properties Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {loading ? 'Searching...' : 'Discover your perfect home from our curated selection'}
                </p>
              </div>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No properties found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilteredProperties(mockProperties)
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Load More */}
            {!loading && filteredProperties.length > 0 && filteredProperties.length < mockProperties.length && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors font-medium">
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Properties
