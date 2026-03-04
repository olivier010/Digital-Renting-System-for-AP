import { Routes, Route } from 'react-router-dom'
import OwnerDashboard from './OwnerDashboard'
import AddProperty from './AddProperty'

const OwnerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerDashboard />} />
      <Route path="/dashboard" element={<OwnerDashboard />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/properties/:id/edit" element={<AddProperty />} />
      {/* Add more owner routes here as needed */}
      <Route path="/properties" element={<div className="p-6"><h1 className="text-2xl font-bold">My Properties</h1><p className="text-gray-600">Properties page coming soon...</p></div>} />
      <Route path="/bookings" element={<div className="p-6"><h1 className="text-2xl font-bold">Bookings</h1><p className="text-gray-600">Bookings page coming soon...</p></div>} />
      <Route path="/reviews" element={<div className="p-6"><h1 className="text-2xl font-bold">Reviews</h1><p className="text-gray-600">Reviews page coming soon...</p></div>} />
      <Route path="/earnings" element={<div className="p-6"><h1 className="text-2xl font-bold">Earnings</h1><p className="text-gray-600">Earnings page coming soon...</p></div>} />
      <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Settings page coming soon...</p></div>} />
    </Routes>
  )
}

export default OwnerRoutes
