import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Bed, Bath, Square } from 'lucide-react'

const MyProperties = () => {
  const [properties] = useState([
    {
      id: 1,
      title: 'Luxury Downtown Apartment',
      location: 'New York, NY',
      price: 2500,
      status: 'active',
      bookings: 45,
      rating: 4.8,
      image: '/api/placeholder/400/300',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      listedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Beach House Paradise',
      location: 'Miami, FL',
      price: 3500,
      status: 'active',
      bookings: 32,
      rating: 4.9,
      image: '/api/placeholder/400/300',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      listedDate: '2024-02-01'
    },
    {
      id: 3,
      title: 'Cozy Studio Loft',
      location: 'San Francisco, CA',
      price: 1800,
      status: 'inactive',
      bookings: 28,
      rating: 4.6,
      image: '/api/placeholder/400/300',
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      listedDate: '2023-12-10'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Properties</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {property.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {property.location}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${property.price}/mo
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1">{property.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div><Bed className="w-4 h-4 inline mr-1" />{property.bedrooms} beds</div>
                  <div><Bath className="w-4 h-4 inline mr-1" />{property.bathrooms} baths</div>
                  <div><Square className="w-4 h-4 inline mr-1" />{property.area} sqft</div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {property.bookings} bookings
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Listed {new Date(property.listedDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/owner/properties/${property.id}/edit`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/owner/properties/${property.id}`}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
