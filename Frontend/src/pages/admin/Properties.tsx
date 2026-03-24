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
  Plus,
  ToggleLeft,
  ToggleRight
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

  // Toggle featured status
  const toggleFeatured = (propertyId: number) => {
    // In a real app, this would make an API call
    console.log('Toggle featured:', propertyId)
  }

  // Toggle verified status
  const toggleVerified = (propertyId: number) => {
    // In a real app, this would make an API call
    console.log('Toggle verified:', propertyId)
  }

  // Toggle property status
  const togglePropertyStatus = (propertyId: number) => {
    // In a real app, this would make an API call
    console.log('Toggle property status:', propertyId)
  }

  // Delete property
  const deleteProperty = (propertyId: number) => {
    // In a real app, this would make an API call
    console.log('Delete property:', propertyId)
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{property.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{property.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-3 text-xs">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-gray-600 dark:text-gray-400 ml-1">{property.rating} ({property.reviews})</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">• {property.bookings} bookings</span>
                <span className="text-gray-500 dark:text-gray-400 capitalize">• {property.type}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">${property.price}/night</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons - Same as Owner */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={() => togglePropertyStatus(property.id)}
                  className={`flex items-center text-xs px-2 py-1 rounded-full transition-colors ${
                    property.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {property.status === 'active' ? (
                    <>
                      <ToggleRight className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </button>
                
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
        ))}
      </div>
    </div>
  )
}

export default Properties
