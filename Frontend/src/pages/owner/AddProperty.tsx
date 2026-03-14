import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Home, Building2, Car, Landmark, Store, Package } from 'lucide-react'

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
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-lg text-gray-600 dark:text-gray-300">Loading property...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{id ? 'Edit Property' : 'Add New Property'}</h1>
              <p className="text-gray-600 dark:text-gray-400">{id ? 'Update your property details' : 'List your property or asset for rent'}</p>
            </div>
            <button
              onClick={() => navigate('/owner/properties')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Category *</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {categories.map(cat => {
                const Icon = cat.icon
                const isSelected = formData.category === cat.value
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                    }`}
                    aria-label={cat.label}
                  >
                    <Icon className="w-6 h-6 mb-1" aria-hidden="true" />
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Property Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Name *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g., Spacious Family House, Toyota Camry 2023"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g., Kigali, Nyarugenge"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price per Month ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g., 500"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Describe your property in detail — features, condition, nearby amenities, etc.
            </p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Describe your property clearly. Include details like number of rooms, parking, furnishing, condition, special features, etc."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
          </div>



          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photos (optional)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <label htmlFor="photo-upload" className="cursor-pointer mt-2 block">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Click to upload photos</span>
                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB each</span>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img src={URL.createObjectURL(photo)} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          {errors.global && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-center font-medium">{errors.global}</div>
          )}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/owner/properties')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProperty
