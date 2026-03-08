import { useState } from 'react'
import PropertyCard from '../../components/PropertyCard'
import type { Property } from '../../types'
import Loading from '../../components/ui/Loading'
import { Star } from 'lucide-react'

// Enhanced mock data with categories
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment Kigali',
    description: 'Beautiful modern apartment in the heart of Kigali with stunning city views and comfortable living spaces.',
    price: 500,
    location: 'Kigali, Nyarugenge',
    category: 'apartment',
    images: [],
    available: true,
    bookings: 12,
    rating: 4.8,
    reviews: 24,
    status: 'active',
    owner: {
      id: 'owner1',
      name: 'Jean Mugabo',
      email: 'jean@example.com',
      phone: '+250 788 123 456'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Family House Kimironko',
    description: 'Spacious family house with a beautiful garden, located in a quiet neighborhood with easy access to schools.',
    price: 800,
    location: 'Kigali, Gasabo',
    category: 'house',
    images: [],
    available: true,
    bookings: 8,
    rating: 4.6,
    reviews: 15,
    status: 'active',
    owner: {
      id: 'owner2',
      name: 'Marie Uwase',
      email: 'marie@example.com',
      phone: '+250 788 234 567'
    },
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Toyota RAV4 2022',
    description: 'Well-maintained Toyota RAV4 2022 model, perfect for city driving and long trips. Full insurance included.',
    price: 200,
    location: 'Kigali, Kicukiro',
    category: 'car',
    images: [],
    available: true,
    bookings: 20,
    rating: 4.9,
    reviews: 32,
    status: 'active',
    owner: {
      id: 'owner3',
      name: 'Patrick Habimana',
      email: 'patrick@example.com',
      phone: '+250 788 345 678'
    },
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Commercial Space Remera',
    description: 'Prime commercial space ideal for offices or retail business, located on a busy street with high foot traffic.',
    price: 1200,
    location: 'Kigali, Gasabo',
    category: 'commercial',
    images: [],
    available: true,
    bookings: 3,
    rating: 4.5,
    reviews: 8,
    status: 'active',
    owner: {
      id: 'owner4',
      name: 'Alice Mutesi',
      email: 'alice@example.com',
      phone: '+250 788 456 789'
    },
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '5',
    title: 'Land Plot Nyamirambo',
    description: 'Large plot of land suitable for residential construction with clear title deed and all utilities available.',
    price: 300,
    location: 'Kigali, Nyarugenge',
    category: 'land',
    images: [],
    available: true,
    bookings: 2,
    rating: 4.3,
    reviews: 5,
    status: 'active',
    owner: {
      id: 'owner5',
      name: 'Emmanuel Nshuti',
      email: 'emmanuel@example.com',
      phone: '+250 788 567 890'
    },
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z'
  },
  {
    id: '6',
    title: 'Apartment Gisenyi Lakeside',
    description: 'Beautiful lakeside apartment in Gisenyi with stunning views of Lake Kivu. Perfect for peaceful living.',
    price: 450,
    location: 'Gisenyi, Rubavu',
    category: 'apartment',
    images: [],
    available: true,
    bookings: 15,
    rating: 4.7,
    reviews: 19,
    status: 'active',
    owner: {
      id: 'owner6',
      name: 'Grace Ingabire',
      email: 'grace@example.com',
      phone: '+250 788 678 901'
    },
    createdAt: '2024-01-10T16:30:00Z',
    updatedAt: '2024-01-10T16:30:00Z'
  },
  {
    id: '7',
    title: 'Honda CR-V 2023',
    description: 'Brand new Honda CR-V 2023, fully loaded with all features. Available for monthly rental with insurance.',
    price: 250,
    location: 'Musanze',
    category: 'car',
    images: [],
    available: true,
    bookings: 10,
    rating: 4.8,
    reviews: 14,
    status: 'active',
    owner: {
      id: 'owner7',
      name: 'David Niyonzima',
      email: 'david@example.com',
      phone: '+250 788 789 012'
    },
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z'
  },
  {
    id: '8',
    title: 'Villa Nyarutarama',
    description: 'Luxury villa in the prestigious Nyarutarama area with modern finishes, spacious rooms and beautiful garden.',
    price: 1500,
    location: 'Kigali, Gasabo',
    category: 'house',
    images: [],
    available: true,
    bookings: 6,
    rating: 4.9,
    reviews: 22,
    status: 'active',
    owner: {
      id: 'owner8',
      name: 'Diane Umutoni',
      email: 'diane@example.com',
      phone: '+250 788 890 123'
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
          // Simulate popularity based on bookings and rating
          return (b.bookings * b.rating) - (a.bookings * a.rating)
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
