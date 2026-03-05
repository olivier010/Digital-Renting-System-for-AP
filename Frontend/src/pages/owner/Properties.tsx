import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Search, 
  Filter, 
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  CheckCircle
} from 'lucide-react'

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const [properties] = useState([
    {
      id: 1,
      title: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      image: '🏢',
      price: 2500,
      rating: 4.8,
      reviews: 24,
      occupancy: 85,
      status: 'active',
      bookings: 8,
      revenue: 20000,
      beds: 2,
      baths: 1,
      sqft: 850,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Gym', 'Workspace'],
      lastBooking: '2024-03-01',
      nextBooking: '2024-03-15',
      createdAt: '2023-06-15',
      views: 1245,
      saves: 89
    },
    {
      id: 2,
      title: 'Beach House Paradise',
      location: 'Miami, FL',
      image: '🏖️',
      price: 3500,
      rating: 4.9,
      reviews: 18,
      occupancy: 92,
      status: 'active',
      bookings: 12,
      revenue: 42000,
      beds: 3,
      baths: 2,
      sqft: 1200,
      amenities: ['WiFi', 'Beach Access', 'Parking', 'Patio', 'BBQ'],
      lastBooking: '2024-02-28',
      nextBooking: '2024-03-20',
      createdAt: '2023-08-20',
      views: 987,
      saves: 76
    },
    {
      id: 3,
      title: 'Mountain View Cabin',
      location: 'Aspen, CO',
      image: '🏔️',
      price: 1800,
      rating: 4.7,
      reviews: 15,
      occupancy: 65,
      status: 'inactive',
      bookings: 5,
      revenue: 9000,
      beds: 1,
      baths: 1,
      sqft: 600,
      amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Ski Access'],
      lastBooking: '2024-01-15',
      nextBooking: null,
      createdAt: '2023-10-10',
      views: 654,
      saves: 43
    },
    {
      id: 4,
      title: 'Urban Studio Loft',
      location: 'Chicago, IL',
      image: '🏙️',
      price: 1500,
      rating: 4.5,
      reviews: 32,
      occupancy: 78,
      status: 'active',
      bookings: 15,
      revenue: 22500,
      beds: 1,
      baths: 1,
      sqft: 500,
      amenities: ['WiFi', 'Kitchen', 'Gym', 'Laundry'],
      lastBooking: '2024-03-05',
      nextBooking: '2024-03-18',
      createdAt: '2023-05-01',
      views: 1567,
      saves: 112
    },
    {
      id: 5,
      title: 'Cozy Suburban Home',
      location: 'Austin, TX',
      image: '🏡',
      price: 2200,
      rating: 4.6,
      reviews: 21,
      occupancy: 88,
      status: 'active',
      bookings: 10,
      revenue: 22000,
      beds: 2,
      baths: 2,
      sqft: 1100,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Garden', 'Pet Friendly'],
      lastBooking: '2024-03-02',
      nextBooking: '2024-03-22',
      createdAt: '2023-09-05',
      views: 823,
      saves: 67
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

  const togglePropertyStatus = (propertyId: number) => {
    // In a real app, this would call an API to update the property status
    console.log('Toggling status for property:', propertyId)
  }

  const deleteProperty = (propertyId: number) => {
    // In a real app, this would call an API to delete the property
    console.log('Deleting property:', propertyId)
  }

  const filteredAndSortedProperties = properties
    .filter(property => {
      const matchesSearch = searchTerm === '' || 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterStatus === 'all' || property.status === filterStatus
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'occupancy':
          return b.occupancy - a.occupancy
        case 'revenue':
          return b.revenue - a.revenue
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 80) return 'text-green-600 dark:text-green-400'
    if (occupancy >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    inactive: properties.filter(p => p.status === 'inactive').length,
    totalRevenue: properties.reduce((sum, p) => sum + p.revenue, 0),
    avgOccupancy: Math.round(properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length),
    avgRating: (properties.reduce((sum, p) => sum + p.rating, 0) / properties.length).toFixed(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Properties
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your rental properties and track their performance
            </p>
          </div>
          <Link
            to="/owner/add-property"
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Home className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(stats.totalRevenue / 1000).toFixed(0)}k
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Occupancy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgOccupancy}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="name">Sort by: Name</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="occupancy">Occupancy Rate</option>
              <option value="revenue">Revenue</option>
              <option value="rating">Rating</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedProperties.length} properties selected
            </span>
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                Bulk Edit
              </button>
              <button className="px-3 py-1 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded text-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                Bulk Delete
              </button>
              <button 
                onClick={() => setSelectedProperties([])}
                className="px-3 py-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {filteredAndSortedProperties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first property'}
          </p>
          {!searchTerm && (
            <Link
              to="/owner/add-property"
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Property
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>
                
                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
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

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Occupancy</p>
                    <p className={`text-lg font-bold ${getOccupancyColor(property.occupancy)}`}>
                      {property.occupancy}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(property.revenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Last: {property.lastBooking}
                  </div>
                  {property.nextBooking && (
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Next: {property.nextBooking}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-3">
                    <span>{property.bookings} bookings</span>
                    <span>{property.views} views</span>
                    <span>{property.saves} saves</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => togglePropertyStatus(property.id)}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    {property.status === 'active' ? (
                      <>
                        <ToggleRight className="w-5 h-5 mr-1 text-green-500" />
                        Active
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 mr-1 text-gray-400" />
                        Inactive
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteProperty(property.id)}
                      className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Properties
