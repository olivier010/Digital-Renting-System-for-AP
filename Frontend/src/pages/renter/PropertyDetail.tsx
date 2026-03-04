import { useParams } from 'react-router-dom'

const PropertyDetail = () => {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Property Details</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Property ID: {id}</p>
        <p className="text-gray-600 mt-2">Property details coming soon...</p>
      </div>
    </div>
  )
}

export default PropertyDetail
