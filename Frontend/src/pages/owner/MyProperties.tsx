import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Phone, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Home, Building2, Car, Landmark, Store, Package } from 'lucide-react'

const categoryIcons: Record<string, typeof Home> = {
  house: Home,
  apartment: Building2,
  car: Car,
  land: Landmark,
  commercial: Store,
  other: Package,
}

const MyProperties = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Luxury Downtown Apartment',
      category: 'apartment',
      location: 'Kigali, Nyarugenge',
      price: 2500,
      status: 'active',
      bookings: 45,
      rating: 4.8,
      reviews: 24,
      contact: '+250 788 123 456',
      image: '/api/placeholder/400/300',
    },
    {
      id: 2,
      title: 'Beach House Paradise',
      category: 'house',
      location: 'Gisenyi, Rubavu',
      price: 3500,
      status: 'active',
      bookings: 32,
      rating: 4.9,
      reviews: 18,
      contact: '+250 788 234 567',
      image: '/api/placeholder/400/300',
    },
    {
      id: 3,
      title: 'Toyota RAV4 2022',
      category: 'car',
      location: 'Kigali, Kicukiro',
      price: 1800,
      status: 'inactive',
      bookings: 28,
      rating: 4.6,
      reviews: 12,
      contact: '+250 788 345 678',
      image: '/api/placeholder/400/300',
    }
  ])

  const [filter, setFilter] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter
    const matchesCategory = filterCategory === 'all' || property.category === filterCategory
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesCategory && matchesSearch
  })

  const togglePropertyStatus = (propertyId: number) => {
    setProperties(prev => prev.map(p =>
      p.id === propertyId ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ))
  }

  const deleteProperty = (propertyId: number) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Properties</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your property listings</p>
            </div>
            <Link
              to="/owner/add-property"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add New Property
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Properties</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const CategoryIcon = categoryIcons[property.category] || Package
            return (
              <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                      <CategoryIcon className="w-3 h-3" />
                      {property.category}
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  {/* Name & Price */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 mr-2">
                      {property.title}
                    </h3>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        ${property.price}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                  </div>

                  {/* Location */}
                  <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                    {property.location}
                  </p>

                  {/* Contact */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center text-sm">
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

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first property'
              }
            </p>
            <Link
              to="/owner/add-property"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Property
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyProperties
