import { useState } from 'react'
import { 
  Home, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Ban, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  DollarSign,
  Download,
  Plus
} from 'lucide-react'

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])

  const [properties] = useState([
    {
      id: 1,
      title: 'Luxury Downtown Apartment',
      type: 'apartment',
      location: 'New York, NY',
      owner: 'Jane Smith',
      ownerEmail: 'jane.smith@example.com',
      status: 'active',
      price: 250,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      rating: 4.8,
      reviews: 24,
      bookings: 45,
      revenue: 11250,
      listedAt: '2024-01-15',
      lastBooked: '2024-03-14',
      images: 12,
      verified: true,
      featured: true,
      amenities: ['WiFi', 'Parking', 'Gym', 'Pool']
    },
    {
      id: 2,
      title: 'Cozy Beach House',
      type: 'house',
      location: 'Miami, FL',
      owner: 'Alice Brown',
      ownerEmail: 'alice.brown@example.com',
      status: 'pending',
      price: 350,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      rating: 4.6,
      reviews: 18,
      bookings: 0,
      revenue: 0,
      listedAt: '2024-03-14',
      lastBooked: 'Never',
      images: 8,
      verified: false,
      featured: false,
      amenities: ['WiFi', 'Parking', 'Kitchen', 'Beach Access']
    },
    {
      id: 3,
      title: 'Modern Studio Loft',
      type: 'studio',
      location: 'Chicago, IL',
      owner: 'John Doe',
      ownerEmail: 'john.doe@example.com',
      status: 'suspended',
      price: 120,
      bedrooms: 0,
      bathrooms: 1,
      sqft: 600,
      rating: 4.2,
      reviews: 12,
      bookings: 28,
      revenue: 3360,
      listedAt: '2023-12-01',
      lastBooked: '2024-02-28',
      images: 6,
      verified: true,
      featured: false,
      amenities: ['WiFi', 'Workspace', 'Kitchen']
    },
    {
      id: 4,
      title: 'Mountain View Cabin',
      type: 'cabin',
      location: 'Aspen, CO',
      owner: 'Bob Wilson',
      ownerEmail: 'bob.wilson@example.com',
      status: 'active',
      price: 450,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      rating: 4.9,
      reviews: 36,
      bookings: 18,
      revenue: 8100,
      listedAt: '2024-02-01',
      lastBooked: '2024-03-12',
      images: 15,
      verified: true,
      featured: true,
      amenities: ['WiFi', 'Parking', 'Fireplace', 'Hot Tub', 'Kitchen']
    },
    {
      id: 5,
      title: 'Urban Condo with City Views',
      type: 'condo',
      location: 'Los Angeles, CA',
      owner: 'Diana Martinez',
      ownerEmail: 'diana.martinez@example.com',
      status: 'active',
      price: 280,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 800,
      rating: 4.5,
      reviews: 8,
      bookings: 12,
      revenue: 3360,
      listedAt: '2024-02-15',
      lastBooked: '2024-03-10',
      images: 10,
      verified: true,
      featured: false,
      amenities: ['WiFi', 'Gym', 'Pool', 'Parking']
    }
  ])

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.owner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    const matchesType = filterType === 'all' || property.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

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

  const handleSelectProperty = (propertyId: number) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
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
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedProperties.length} propert{selectedProperties.length !== 1 ? 'ies' : 'y'} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Approve Selected
              </button>
              <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            {/* Property Image */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <Home className="w-12 h-12 text-gray-400" />
              </div>
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
                {property.featured && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Featured
                  </span>
                )}
                {property.verified && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Verified
                  </span>
                )}
              </div>
              
              {/* Actions */}
              <div className="absolute top-3 right-3">
                <input
                  type="checkbox"
                  checked={selectedProperties.includes(property.id)}
                  onChange={() => handleSelectProperty(property.id)}
                  className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {property.rating}
                  </span>
                </div>
              </div>

              {/* Owner Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Owner: <span className="font-medium text-gray-900 dark:text-white">{property.owner}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {property.ownerEmail}
                </p>
              </div>

              {/* Property Specs */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {property.bedrooms} bed
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  {property.bathrooms} bath
                </div>
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  {property.sqft} sqft
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Price/night</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${property.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${property.revenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Activity */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span>{property.bookings} bookings</span>
                <span>{property.reviews} reviews</span>
                <span>{property.images} images</span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-4">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                    +{property.amenities.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  {property.status === 'active' ? (
                    <button className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400">
                      <Ban className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Listed {property.listedAt}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Properties
