
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../../utils/api'
import type { Property } from '../../types'
import Loading from '../../components/ui/Loading'
import {
  MapPin,
  Star,
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

const OwnerPropertyDetail = () => {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await apiFetch(`/properties/${id}`)
        let p = res.data || res
        p.images = Array.isArray(p.images)
          ? p.images.map((img: string) => img && !img.startsWith('http') ? `http://localhost:8080${img}` : img)
          : []
        setProperty(p)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch property')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProperty()
  }, [id])

  if (loading) return <Loading />
  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!property) return <div className="p-4">Property not found.</div>

  const CategoryIcon = property ? (categoryIcons[property.category] || Package) : Package
  // House rules (if present)
  const rules = (property as any).rules || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/owner/properties" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Properties
            </Link>
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
                {property.images && property.images.length > 0 ? (
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
              {property.images && property.images.length > 1 && <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev + 1) % property.images.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>}
              {/* Image Thumbnails */}
              {property.images && property.images.length > 1 && (
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
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{property.owner?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{property.owner?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* House Rules (only if present) */}
            {Array.isArray(rules) && rules.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">House Rules</h3>
                <ul className="space-y-2">
                  {rules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <X className="w-4 h-4 mr-2 text-red-500" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar: Owner Info */}
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

              {/* Owner Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Owner: {property.owner?.name || 'N/A'}</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg font-medium text-primary-600 dark:text-primary-300">
                      {property.owner?.name ? property.owner.name.split(' ').map(n => n[0]).join('') : '?'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900 dark:text-white">{property.owner?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {property.owner?.phone || 'N/A'}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{property.owner?.email || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerPropertyDetail
