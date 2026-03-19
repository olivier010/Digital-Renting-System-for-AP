import { Link } from 'react-router-dom'
import type { Property } from '../types'
import Card, { CardBody, CardFooter } from './ui/Card'
import Button from './ui/Button'

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card hover className="overflow-hidden">
      {/* Property Image */}
      <div className="relative h-32 bg-gray-200">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold capitalize">
            {property.category}
          </span>
        </div>
        
        {/* Availability Status */}
        <div className="absolute top-2 right-2">
          <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
            property.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.available ? 'Available' : 'Occupied'}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <CardBody className="p-3">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs text-gray-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>
        </div>

        {/* Contact */}
        {property.owner?.phone && (
          <p className="text-xs text-gray-600 flex items-center mb-2">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {property.owner.phone}
          </p>
        )}

        {/* Bookings & Reviews */}
        <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
          <span>{property.bookings ?? 0} bookings</span>
          <div className="flex items-center">
            <svg className="w-3 h-3 text-yellow-500 fill-current mr-1" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{property.rating ?? 0} ({property.reviews ?? 0})</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">
              ${property.price}
            </span>
            <span className="text-xs text-gray-600">/month</span>
          </div>
        </div>
      </CardBody>

      {/* Card Footer */}
      <CardFooter className="p-3 pt-0">
        <div className="pt-2">
          <Link to={`/properties/${property.id}`} className="w-full">
            <Button variant="primary" className="w-full py-1.5 text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PropertyCard
