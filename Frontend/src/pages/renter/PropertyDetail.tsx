import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star, 
  Heart, 
  Share2, 
  Shield, 
  Wifi, 
  Car, 
  Dumbbell, 
  Home,
  Wind,
  Tv,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react'

const PropertyDetail = () => {
  const { id } = useParams()
  const [currentImage, setCurrentImage] = useState(0)
  const [saved, setSaved] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  // Mock property data - in real app, this would come from API
  const property = {
    id: parseInt(id || '1'),
    title: 'Luxury Downtown Apartment with City Views',
    location: 'Manhattan, New York',
    price: 250,
    rating: 4.8,
    reviews: 124,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    ],
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: 'Apartment',
    host: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      verified: true,
      responseTime: 'Within 1 hour',
      memberSince: '2023'
    },
    description: 'Experience luxury living in this stunning downtown apartment with breathtaking city views. This modern space features floor-to-ceiling windows, high-end appliances, and premium finishes throughout. Located in the heart of Manhattan, you\'ll be steps away from world-class dining, shopping, and entertainment.',
    amenities: [
      { name: 'High-Speed WiFi', icon: Wifi, included: true },
      { name: 'Parking', icon: Car, included: true },
      { name: 'Fitness Center', icon: Dumbbell, included: true },
      { name: 'Swimming Pool', icon: Home, included: true },
      { name: 'Full Kitchen', icon: Coffee, included: true },
      { name: 'Air Conditioning', icon: Wind, included: true },
      { name: 'Smart TV', icon: Tv, included: true },
      { name: 'Coffee Maker', icon: Coffee, included: true }
    ],
    rules: [
      'No smoking',
      'No parties',
      'Quiet hours after 10 PM',
      'No pets allowed'
    ],
    availability: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      minStay: 2,
      maxStay: 30
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
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    return nights * property.price
  }

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
                  <p className="text-sm text-gray-500 dark:text-gray-400">per night</p>
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
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{property.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{property.bathrooms} baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this place</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => {
                  const Icon = amenity.icon
                  return (
                    <div key={index} className="flex items-center">
                      <Icon className={`w-5 h-5 mr-3 ${amenity.included ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`text-sm ${amenity.included ? 'text-gray-900 dark:text-white' : 'text-gray-400 line-through'}`}>
                        {amenity.name}
                      </span>
                      {amenity.included && <Check className="w-4 h-4 text-green-600 ml-auto" />}
                    </div>
                  )
                })}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">per night</p>
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
                    Check-in
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
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    ${property.price} x {checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0} nights
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ${calculateTotal()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Cleaning fee</span>
                  <span className="text-gray-900 dark:text-white">$50</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Service fee</span>
                  <span className="text-gray-900 dark:text-white">$25</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>${calculateTotal() + 75}</span>
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

            {/* Host Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hosted by {property.host.name}</h3>
              <div className="flex items-center mb-4">
                <img 
                  src={property.host.image} 
                  alt={property.host.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900 dark:text-white">{property.host.name}</p>
                    {property.host.verified && (
                      <Shield className="w-4 h-4 text-blue-600 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {property.host.memberSince}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>Response time: {property.host.responseTime}</p>
                <p>Response rate: 100%</p>
              </div>
              <button className="w-full mt-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Contact Host
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
