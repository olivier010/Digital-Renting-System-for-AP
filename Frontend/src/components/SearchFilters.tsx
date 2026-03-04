import { useState } from 'react'
import Input from './ui/Input'
import Button from './ui/Button'
import Card, { CardBody } from './ui/Card'

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
}

export interface SearchFilters {
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({})

  const handleInputChange = (field: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters({})
    onSearch({})
  }

  return (
    <Card className="sticky top-24">
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Search Filters</h3>
        
        <div className="space-y-4">
          <Input
            placeholder="Enter location..."
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
          
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.propertyType || ''}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.bedrooms || ''}
            onChange={(e) => handleInputChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">Any Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
          
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.bathrooms || ''}
            onChange={(e) => handleInputChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">Any Bathrooms</option>
            <option value="1">1 Bathroom</option>
            <option value="2">2 Bathrooms</option>
            <option value="3">3 Bathrooms</option>
            <option value="4">4+ Bathrooms</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <Button 
            onClick={handleSearch}
            className="flex-1"
          >
            Search
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default SearchFilters
