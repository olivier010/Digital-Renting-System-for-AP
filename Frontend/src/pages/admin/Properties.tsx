import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import { 
  Home, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  MapPin, 
  DollarSign,
  Download,
  Plus,
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

interface Property {
  id: number
  title: string
  type: string
  location: string
  owner: string
  ownerEmail: string
  status: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  rating: number
  reviews: number
  bookings: number
  revenue: number
  listedAt: string
  lastBooked: string
  images: string[]
  verified: boolean
  featured: boolean
  amenities: string[]
}

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch properties from backend
  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/properties?page=0&size=50')
      // Map API property objects to expected frontend structure
      const apiProperties = Array.isArray(res.data?.content) ? res.data.content.map((p: any) => ({
        id: p.id,
        title: p.title,
        type: (p.category || '').toLowerCase(),
        location: p.location,
        owner: p.ownerName || 'Unknown Owner',
        ownerEmail: p.ownerEmail || '',
        status: (p.status || 'active').toLowerCase(),
        price: p.price || 0,
        bedrooms: p.bedrooms || 0,
        bathrooms: p.bathrooms || 0,
        sqft: p.squareFeet || 0,
        rating: p.rating || 0,
        reviews: p.reviewsCount || 0,
        bookings: p.bookingsCount || 0,
        revenue: p.totalRevenue || 0,
        listedAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
        lastBooked: p.lastBookedAt ? new Date(p.lastBookedAt).toLocaleDateString() : 'Never',
        images: Array.isArray(p.images) ? p.images : [],
        verified: p.isVerified || false,
        featured: p.isFeatured || false,
        amenities: p.amenities || []
      })) : []
      setProperties(apiProperties)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.owner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    const matchesType = filterType === 'all' || property.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    pending: properties.filter(p => p.status === 'pending').length,
    suspended: properties.filter(p => p.status === 'suspended').length,
    featured: properties.filter(p => p.featured).length,
    verified: properties.filter(p => p.verified).length,
    totalRevenue: properties.reduce((sum, p) => sum + p.revenue, 0),
    totalBookings: properties.reduce((sum, p) => sum + p.bookings, 0)
  }

  // Toggle featured status
  const toggleFeatured = async (propertyId: number) => {
    try {
      await apiFetch(`/properties/${propertyId}/featured`, { method: 'PATCH' })
      // Update local state
      setProperties(prev => 
        prev.map(p => 
          p.id === propertyId ? { ...p, featured: !p.featured } : p
        )
      )
    } catch (err) {
      alert('Failed to update featured status')
    }
  }

  // Toggle verified status
  const toggleVerified = async (propertyId: number) => {
    try {
      await apiFetch(`/properties/${propertyId}/verified`, { method: 'PATCH' })
      // Update local state
      setProperties(prev => 
        prev.map(p => 
          p.id === propertyId ? { ...p, verified: !p.verified } : p
        )
      )
    } catch (err) {
      alert('Failed to update verified status')
    }
  }

  // Delete property
  const deleteProperty = async (propertyId: number) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    try {
      await apiFetch(`/properties/${propertyId}`, { method: 'DELETE' })
      // Update local state
      setProperties(prev => prev.filter(p => p.id !== propertyId))
    } catch (err) {
      alert('Failed to delete property')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Property Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all property listings and their approval status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Home className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartments</option>
              <option value="house">Houses</option>
              <option value="studio">Studios</option>
              <option value="condo">Condos</option>
              <option value="cabin">Cabins</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </button>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Properties
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchProperties}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProperties.map((property) => {
          const CategoryIcon = categoryIcons[property.type] || Package
          return (
            <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group">
              {/* Property Image */}
              <div className="relative h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0].startsWith('/') ? `http://localhost:8080${property.images[0]}` : property.images[0]}
                    alt={property.title}
                    className="object-cover w-full h-full absolute top-0 left-0"
                  />
                ) : (
                  <CategoryIcon className="w-8 h-8 text-gray-400 z-10" />
                )}
                {/* Status & Category Badges */}
                <div className="absolute top-2 left-2 flex gap-1 z-20">
                  <span className="flex items-center gap-0.5 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    <CategoryIcon className="w-2.5 h-2.5" />
                    {property.type}
                  </span>
                </div>
                {/* Featured & Verified Indicators */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
                  {property.featured && (
                    <div className="bg-yellow-500 text-white p-1 rounded-full" title="Featured">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  {property.verified && (
                    <div className="bg-blue-500 text-white p-1 rounded-full" title="Verified">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Property Info */}
              <div className="p-3">
                {/* Title & Price */}
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      ${property.price}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">/night</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      <span>{property.bookings}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                      <span>{property.rating}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {property.reviews} reviews
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => toggleFeatured(property.id)}
                      className={`p-1.5 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        property.featured 
                          ? 'text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400' 
                          : 'text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
                      }`}
                      title={property.featured ? 'Unmark as Featured' : 'Mark as Featured'}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => toggleVerified(property.id)}
                      className={`p-1.5 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        property.verified 
                          ? 'text-blue-500 hover:text-blue-600 dark:hover:text-blue-400' 
                          : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                      title={property.verified ? 'Unmark as Verified' : 'Mark as Verified'}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700" 
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700" 
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => deleteProperty(property.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
