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
  Search, 
  Filter, 
  Phone,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Building2,
  Car,
  Landmark,
  Store,
  Package
} from 'lucide-react'

const categoryIcons: Record<string, typeof Home> = {
  house: Home,
  apartment: Building2,
  car: Car,
  land: Landmark,
  commercial: Store,
  other: Package,
}

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Luxury Downtown Apartment',
      category: 'apartment',
      location: 'Kigali, Nyarugenge',
      price: 2500,
      description: 'Spacious 2-bedroom apartment in the heart of downtown. Fully furnished with modern amenities.',
      rating: 4.8,
      reviews: 24,
      status: 'active',
      bookings: 8,
      contact: '+250 788 123 456',
      image: '🏢',
      createdAt: '2023-06-15',
    },
    {
      id: 2,
      title: 'Beach House Paradise',
      category: 'house',
      location: 'Gisenyi, Rubavu',
      price: 3500,
      description: 'Beautiful lakefront house with 4 bedrooms and stunning views.',
      rating: 4.9,
      reviews: 18,
      status: 'active',
      bookings: 12,
      contact: '+250 788 234 567',
      image: '🏖️',
      createdAt: '2023-08-20',
    },
    {
      id: 3,
      title: 'Toyota RAV4 2022',
      category: 'car',
      location: 'Kigali, Kicukiro',
      price: 1800,
      description: 'Well-maintained Toyota RAV4, automatic transmission, AC, GPS included.',
      rating: 4.7,
      reviews: 15,
      status: 'inactive',
      bookings: 5,
      contact: '+250 788 345 678',
      image: '🚗',
      createdAt: '2023-10-10',
    },
    {
      id: 4,
      title: 'Modern Studio Loft',
      category: 'apartment',
      location: 'Kigali, Gasabo',
      price: 1500,
      description: 'Cozy studio loft perfect for professionals. WiFi, parking, gym access.',
      rating: 4.5,
      reviews: 32,
      status: 'active',
      bookings: 15,
      contact: '+250 788 456 789',
      image: '🏙️',
      createdAt: '2023-05-01',
    },
    {
      id: 5,
      title: 'Family Home with Garden',
      category: 'house',
      location: 'Musanze, Muhoza',
      price: 2200,
      description: 'Spacious family home with a large garden, 3 bedrooms, pet friendly.',
      rating: 4.6,
      reviews: 21,
      status: 'active',
      bookings: 10,
      contact: '+250 788 567 890',
      image: '🏡',
      createdAt: '2023-09-05',
    }
  ])

  const togglePropertyStatus = (propertyId: number) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ))
  }

  const deleteProperty = (propertyId: number) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId))
  }

  const filteredAndSortedProperties = properties
    .filter(property => {
      const matchesSearch = searchTerm === '' || 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus
      const matchesCategory = filterCategory === 'all' || property.category === filterCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title)
        case 'price_low': return a.price - b.price
        case 'price_high': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'bookings': return b.bookings - a.bookings
        default: return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    inactive: properties.filter(p => p.status === 'inactive').length,
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
              Manage your rental properties and assets
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactive}</p>
            </div>
            <ToggleLeft className="w-8 h-8 text-gray-400" />
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Categories</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="car">Car</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="name">Sort by: Name</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="bookings">Most Bookings</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

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
          {filteredAndSortedProperties.map((property) => {
            const CategoryIcon = categoryIcons[property.category] || Package
            return (
              <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl">
                  {property.image}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                      <CategoryIcon className="w-3 h-3" />
                      {property.category}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <Link to={`/owner/properties/${property.id}`} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <Link to={`/owner/properties/${property.id}/edit`} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </Link>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-4">
                  {/* Name & Price */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 mr-2">
                      {property.title}
                    </h3>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        ${property.price}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                    </div>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-3">
                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                    {property.location}
                  </p>

                  {/* Contact */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-3">
                    <Phone className="w-4 h-4 mr-1 shrink-0" />
                    {property.contact}
                  </p>

                  {/* Bookings & Reviews */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{property.bookings}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bookings</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{property.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{property.reviews} reviews</p>
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
                      <Link to={`/owner/properties/${property.id}`} className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link to={`/owner/properties/${property.id}/edit`} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => deleteProperty(property.id)}
                        className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Properties
