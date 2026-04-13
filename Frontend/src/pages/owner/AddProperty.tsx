import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Home, Building2, Car, Landmark, Store, Package, Upload, X, Camera, MapPin, DollarSign, FileText, ArrowLeft, Check } from 'lucide-react'

const categories = [
  { value: 'house', label: 'House', icon: Home },
  { value: 'apartment', label: 'Apartment', icon: Building2 },
  { value: 'car', label: 'Car', icon: Car },
  { value: 'land', label: 'Land', icon: Landmark },
  { value: 'commercial', label: 'Commercial', icon: Store },
  { value: 'other', label: 'Other', icon: Package },
]

const AddProperty = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'house',
    location: '',
    price: '',
    description: '',
    photos: [] as File[],
  })

  // Fetch property data if editing
  useEffect(() => {
    if (!id) return
    setLoading(true)
    const fetchProperty = async () => {
      const token = localStorage.getItem('rentwise_token')
      if (!token) {
        setLoading(false)
        return
      }
      const res = await fetch(`http://localhost:8080/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (res.ok) {
        setFormData({
          title: data.title || '',
          category: (data.category || 'house').toLowerCase(),
          location: data.location || '',
          price: data.price ? String(data.price) : '',
          description: data.description || '',
          photos: [],
        })
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }))
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Property name is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    // rules is optional
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // API_BASE_URL is not used, so removed to avoid unused variable warning

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})
    try {
      const token = localStorage.getItem('rentwise_token')
      if (!token) return

      // Prepare multipart form data with 'property' as JSON string
      const form = new FormData()
      const propertyPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category.toUpperCase(),
        location: formData.location,
        price: formData.price
      }
      form.append('property', JSON.stringify(propertyPayload))
      formData.photos.forEach((file) => {
        form.append('images', file)
      })

      let res
      if (id) {
        res = await fetch(`http://localhost:8080/api/properties/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
            // Do NOT set 'Content-Type' here
          },
          body: form,
        })
      } else {
        res = await fetch(`http://localhost:8080/api/properties`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Do NOT set 'Content-Type' here
          },
          body: form,
        })
      }
      const data = await res.json()
      if (!res.ok) {
        setErrors({ global: data.message || (id ? 'Failed to update property.' : 'Failed to create property.') })
        setIsSubmitting(false)
        return
      }
      navigate('/owner/properties')
    } catch (err) {
      setErrors({ global: 'An unexpected error occurred.' })
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-surface-600 dark:text-surface-300">Loading property...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/owner/properties')}
                className="p-2 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-gray-200 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{id ? 'Edit Property' : 'Add New Property'}</h1>
                <p className="text-surface-500 dark:text-surface-400">{id ? 'Update your property details' : 'List your property or asset for rent'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/owner/properties')}
              className="px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-dark-soft overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 px-8 py-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-white">Property Details</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Basic information about your property</p>
                </div>
              </div>
              <Check className="w-5 h-5 text-primary-600" />
            </div>
          </div>

          <div className="p-8 space-y-8">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2 text-primary-600" />
              Property Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(cat => {
                const Icon = cat.icon
                const isSelected = formData.category === cat.value
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md transform scale-105'
                        : 'border-gray-200 dark:border-surface-600 hover:border-gray-300 dark:hover:border-gray-500 text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                    aria-label={cat.label}
                  >
                    <Icon className="w-6 h-6 mb-2" aria-hidden="true" />
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Property Name */}
          <div>
            <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-primary-600" />
              Property Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white transition-colors ${
                errors.title ? 'border-red-500' : 'border-surface-200 dark:border-surface-600'
              }`}
              placeholder="e.g., Spacious Family House, Toyota Camry 2023"
            />
            {errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"><X className="w-4 h-4 mr-1" />{errors.title}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-primary-600" />
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white transition-colors ${
                errors.location ? 'border-red-500' : 'border-surface-200 dark:border-surface-600'
              }`}
              placeholder="e.g., Kigali, Nyarugenge"
            />
            {errors.location && <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"><X className="w-4 h-4 mr-1" />{errors.location}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
              Price per Month ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white transition-colors ${
                errors.price ? 'border-red-500' : 'border-surface-200 dark:border-surface-600'
              }`}
              placeholder="e.g., 500"
            />
            {errors.price && <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"><X className="w-4 h-4 mr-1" />{errors.price}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-primary-600" />
              Description *
            </label>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
              Describe your property in detail — features, condition, nearby amenities, etc.
            </p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white resize-none transition-colors ${
                errors.description ? 'border-red-500' : 'border-surface-200 dark:border-surface-600'
              }`}
              placeholder="Describe your property clearly. Include details like number of rooms, parking, furnishing, condition, special features, etc."
            />
            {errors.description && <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"><X className="w-4 h-4 mr-1" />{errors.description}</p>}
          </div>



          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
              <Camera className="w-4 h-4 mr-2 text-primary-600" />
              Photos (optional)
            </label>
            <div className="border-2 border-dashed border-surface-200 dark:border-surface-600 rounded-2xl p-8 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors bg-surface-50 dark:bg-surface-700/50">
              <Upload className="mx-auto h-12 w-12 text-surface-400 mb-4" />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Click to upload photos
                </span>
                <span className="mt-1 block text-xs text-surface-500 dark:text-surface-400">
                  PNG, JPG up to 10MB each
                </span>
              </label>
              <input
                id="photo-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {formData.photos.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Uploaded Photos ({formData.photos.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-700">
                        <img 
                          src={URL.createObjectURL(photo)} 
                          alt={`Photo ${index + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-soft dark:shadow-dark-soft"
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Global Error */}
          {errors.global && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-center">
                <X className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-700 dark:text-red-300 font-medium">{errors.global}</p>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={() => navigate('/owner/properties')}
              className="px-6 py-3 border-2 border-surface-200 dark:border-surface-600 rounded-2xl text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-all duration-200 shadow-soft dark:shadow-dark-soft hover:shadow-xl transform hover:scale-105 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {id ? 'Update Property' : 'Add Property'}
                </>
              )}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProperty


