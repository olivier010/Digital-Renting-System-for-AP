import { useState } from 'react'
import { Search, MapPin, Star, Heart, Bed, Bath, Square, Filter, Grid, List, ChevronDown } from 'lucide-react'

const SearchProperties = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 5000],
    propertyType: 'all',
    amenities: [],
    bedrooms: 'any',
    bathrooms: 'any',
    sortBy: 'recommended'
  })

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [properties] = useState([
    {
      id: 1,
      title: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      price: 2500,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      beds: 2,
      baths: 1,
      sqft: 850,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Gym'],
      available: true,
      host: 'John Smith',
      hostImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      type: 'apartment',
      featured: true,
      instantBook: true
    },
    {
      id: 2,
      title: 'Beach House Paradise',
      location: 'Miami, FL',
      price: 3500,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      beds: 3,
      baths: 2,
      sqft: 1200,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Beach Access'],
      available: true,
      host: 'Maria Garcia',
      hostImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      type: 'house',
      featured: false,
      instantBook: false
    },
    {
      id: 3,
      title: 'Mountain View Cabin',
      location: 'Aspen, CO',
      price: 1800,
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      beds: 2,
      baths: 1,
      sqft: 750,
      amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Mountain View'],
      available: true,
      host: 'Michael Brown',
      hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      type: 'cabin',
      featured: false,
      instantBook: true
    }
  ])

  const [savedProperties, setSavedProperties] = useState<number[]>([])

  const toggleSaveProperty = (propertyId: number) => {
    setSavedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Find Your Perfect Property
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {properties.length} properties available
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
              Guests
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchFilters.guests}
              onChange={(e) => setSearchFilters({...searchFilters, guests: parseInt(e.target.value)})}
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4+ Guests</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchFilters.propertyType}
              onChange={(e) => setSearchFilters({...searchFilters, propertyType: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="studio">Studio</option>
            </select>
          </div>
          
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
            {properties.length} Properties Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Based on your search criteria
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Sort by: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            {/* Property Image */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl">
              {property.image}
              {!property.available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Not Available</span>
                </div>
              )}
              <button
                onClick={() => toggleSaveProperty(property.id)}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart className={`w-4 h-4 ${savedProperties.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
              </button>
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

              {/* Host Info */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-300">
                      {property.hostImage}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {property.host}
                  </span>
                </div>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    property.available 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!property.available}
                >
                  {property.available ? 'Book Now' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
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
