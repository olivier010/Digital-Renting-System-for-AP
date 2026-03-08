import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
  Shield, 
  Phone,
  Home,
  Building2,
  Car,
  Landmark,
  Store,
  Package,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'

const categoryIcons: Record<string, typeof Home> = {
  house: Home,
  apartment: Building2,
  car: Car,
  land: Landmark,
  commercial: Store,
  other: Package,
}

const PropertyDetail = () => {
  const { id } = useParams()
  const [currentImage, setCurrentImage] = useState(0)
  const [saved, setSaved] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  // Mock property data - in real app, this would come from API
  const property = {
    id: parseInt(id || '1'),
    title: 'Modern Apartment Kigali',
    location: 'Kigali, Nyarugenge',
    price: 500,
    rating: 4.8,
    reviews: 24,
    bookings: 12,
    category: 'apartment' as const,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    ],
    owner: {
      name: 'Jean Mugabo',
      phone: '+250 788 123 456',
      email: 'jean@example.com',
      verified: true,
      responseTime: 'Within 1 hour',
      memberSince: '2023'
    },
    description: 'Beautiful modern apartment in the heart of Kigali with stunning city views and comfortable living spaces. This property features well-maintained interiors, natural lighting, and easy access to shops, restaurants, and public transport.',
    rules: [
      'No smoking',
      'No parties',
      'Quiet hours after 10 PM',
      'No pets allowed'
    ],
    availability: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      minStay: 1,
      maxStay: 12
    }
  }

  const toggleSave = () => {
    setSaved(!saved)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const months = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return months * property.price
  }

  const CategoryIcon = categoryIcons[property.category] || Package

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/properties" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Properties
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                onClick={toggleSave}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                <img 
                  src={property.images[currentImage]} 
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Image Navigation */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Thumbnails */}
              <div className="flex space-x-2 mt-4">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-1 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 ${
                      currentImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`Property view ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${property.price}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {property.rating}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    ({property.reviews} reviews)
                  </span>
                </div>
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full capitalize">
                  <CategoryIcon className="w-4 h-4 mr-1" />
                  {property.category}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {property.bookings} bookings
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this property</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{property.owner.phone}</span>
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">House Rules</h3>
              <ul className="space-y-2">
                {property.rules.map((rule, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <X className="w-4 h-4 mr-2 text-red-500" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${property.price}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-medium">{property.rating}</span>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    ${property.price} x {checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0} months
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ${calculateTotal()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                Reserve Now
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                You won't be charged yet
              </p>
            </div>

            {/* Owner Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Owner: {property.owner.name}</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg font-medium text-primary-600 dark:text-primary-300">
                    {property.owner.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900 dark:text-white">{property.owner.name}</p>
                    {property.owner.verified && (
                      <Shield className="w-4 h-4 text-blue-600 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {property.owner.memberSince}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {property.owner.phone}
                </p>
                <p>Response time: {property.owner.responseTime}</p>
              </div>
              <button className="w-full mt-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
