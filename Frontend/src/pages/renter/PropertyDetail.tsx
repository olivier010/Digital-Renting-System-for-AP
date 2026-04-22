import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/api'
import type { Property } from '../../types'
import { 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
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
  const [specialRequest, setSpecialRequest] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)


  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const res = await apiFetch(`/api/properties/${id}`)
        let p = res.data
        // Fix image URLs if needed
        p.images = Array.isArray(p.images)
          ? p.images.map((img: string) => img && !img.startsWith('http') ? `${import.meta.env.VITE_API_URL}${img}` : img)
          : []
        setProperty(p)
      } catch {
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProperty()
  }, [id])


  const toggleSave = () => setSaved((s) => !s)
  const nextImage = () => property && setCurrentImage((prev) => (prev + 1) % property.images.length)
  const prevImage = () => property && setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length)
  const calculateTotal = () => {
    if (!property || !checkIn || !checkOut) return 0
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const months = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return months * property.price
  }
  const CategoryIcon = property ? (categoryIcons[property.category] || Package) : Package

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg text-surface-600 dark:text-surface-300">Loading property details...</span>
      </div>
    )
  }
  if (!property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg text-red-600 dark:text-red-400">Property not found.</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <div className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/properties" className="flex items-center text-surface-600 dark:text-surface-300 hover:text-gray-900 dark:hover:text-white">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Properties
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <Share2 className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
              <button 
                onClick={toggleSave}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-red-500 text-red-500' : 'text-surface-600 dark:text-surface-300'}`} />
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
              <div className="aspect-w-16 aspect-h-9 bg-surface-200 dark:bg-surface-700 rounded-2xl overflow-hidden">
                {property.images.length > 0 ? (
                  <img 
                    src={property.images[currentImage]} 
                    alt={property.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-3xl">🏠</div>
                )}
              </div>
              {/* Image Navigation */}
              {property.images.length > 1 && <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-soft dark:shadow-dark-soft"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-soft dark:shadow-dark-soft"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>}
              {/* Image Thumbnails */}
              {property.images.length > 1 && (
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
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-surface-600 dark:text-surface-300">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${property.price}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">per month</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-medium text-surface-900 dark:text-white">
                    {property.rating}
                  </span>
                  <span className="text-surface-500 dark:text-surface-400 ml-1">
                    ({property.reviews} reviews)
                  </span>
                </div>
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full capitalize">
                  <CategoryIcon className="w-4 h-4 mr-1" />
                  {property.category}
                </span>
                <span className="text-sm text-surface-500 dark:text-surface-400">
                  {property.bookings} bookings
                </span>
              </div>

              <div className="border-t border-surface-200 dark:border-surface-700 pt-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">About this property</h3>
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Contact Info */}
              <div className="border-t border-surface-200 dark:border-surface-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">Contact</h3>
                <div className="flex items-center text-surface-600 dark:text-surface-300 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{property.owner.phone}</span>
                </div>
                <div className="flex items-center text-surface-600 dark:text-surface-300">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{property.owner.email}</span>
                </div>
              </div>
            </div>

            {/* House Rules (only if present) */}
            {Array.isArray((property as any).rules) && (property as any).rules.length > 0 && (
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">House Rules</h3>
                <ul className="space-y-2">
                  {(property as any).rules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-surface-600 dark:text-surface-300">
                      <X className="w-4 h-4 mr-2 text-red-500" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-sm sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    ${property.price}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">per month</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-medium">{property.rating}</span>
                </div>
              </div>

              {/* Booking Form */}
              <form
                className="space-y-4 mb-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBookingError(null);
                  setBookingSuccess(false);
                  setBookingLoading(true);
                  try {
                    await apiFetch('/api/bookings', {
                      method: 'POST',
                      body: JSON.stringify({
                        propertyId: property.id,
                        startDate: checkIn,
                        endDate: checkOut,
                        specialRequests: specialRequest,
                      }),
                    });
                    setBookingSuccess(true);
                    setCheckIn('');
                    setCheckOut('');
                    setSpecialRequest('');
                  } catch (err: any) {
                    setBookingError(err.message || 'Failed to reserve property');
                  } finally {
                    setBookingLoading(false);
                  }
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Special Request (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white resize-none"
                    placeholder="Add any special request for the owner..."
                    value={specialRequest}
                    onChange={e => setSpecialRequest(e.target.value)}
                  />
                </div>
                {bookingError && (
                  <div className="text-red-500 text-sm">{bookingError}</div>
                )}
                {bookingSuccess && (
                  <div className="text-green-600 text-sm">Reservation successful!</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Reserving...' : 'Reserve Now'}
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-surface-600 dark:text-surface-300">
                    ${property.price} x {checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0} months
                  </span>
                  <span className="text-surface-900 dark:text-white">
                    ${calculateTotal()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-surface-200 dark:border-surface-700">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              {/* Book Button removed (duplicate) */}
              <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-4">
                You won't be charged yet
              </p>
            </div>

            {/* Owner Info */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Owner: {property.owner.name}</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg font-medium text-primary-600 dark:text-primary-300">
                    {property.owner.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-surface-900 dark:text-white">{property.owner.name}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-surface-600 dark:text-surface-300">
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {property.owner.phone}
                </p>
                <p className="flex items-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{property.owner.email}</span>
                </p>
              </div>
              <button className="w-full mt-4 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 py-2 px-4 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
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


