import { Link } from 'react-router-dom'
import type { Property } from '../types'

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const imageUrl = property.images.length > 0
    ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:8080${property.images[0]}`)
    : ''

  return (
    <div className="group card-elevated overflow-hidden hover:shadow-soft-lg dark:hover:shadow-dark-lg hover:-translate-y-1 transition-all duration-300">
      {/* Property Image */}
      <div className="relative h-48 bg-surface-200 dark:bg-surface-700 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-surface-300 dark:text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm text-surface-700 dark:text-surface-200 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize shadow-sm">
            {property.category}
          </span>
        </div>

        {/* Availability Status */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm shadow-sm ${
            property.available
              ? 'bg-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}>
            {property.available ? 'Available' : 'Occupied'}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-md">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">${property.price}</span>
            <span className="text-xs text-surface-500 dark:text-surface-400">/mo</span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {property.title}
        </h3>
        
        <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1 mb-3">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{property.location}</span>
        </p>

        {/* Contact */}
        {property.owner?.phone && (
          <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1 mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {property.owner.phone}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-700/50">
          <span className="text-xs text-surface-400 dark:text-surface-500">{property.bookings ?? 0} bookings</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{property.rating ?? 0}</span>
            <span className="text-xs text-surface-400 dark:text-surface-500">({property.reviews ?? 0})</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4">
        <Link
          to={`/properties/${property.id}`}
          className="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-2 px-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </Link>
      </div>
    </div>
  )
}

export default PropertyCard


