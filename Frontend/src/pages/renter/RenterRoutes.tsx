import { Routes, Route } from 'react-router-dom'
import RenterDashboard from './RenterDashboard'

const RenterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RenterDashboard />} />
      <Route path="/dashboard" element={<RenterDashboard />} />
      <Route path="/search" element={<div className="p-6"><h1 className="text-2xl font-bold">Search Properties</h1><p className="text-gray-600">Advanced property search coming soon...</p></div>} />
      <Route path="/bookings" element={<div className="p-6"><h1 className="text-2xl font-bold">My Bookings</h1><p className="text-gray-600">Bookings management coming soon...</p></div>} />
      <Route path="/favorites" element={<div className="p-6"><h1 className="text-2xl font-bold">Favorite Properties</h1><p className="text-gray-600">Saved properties coming soon...</p></div>} />
      <Route path="/payments" element={<div className="p-6"><h1 className="text-2xl font-bold">Payment History</h1><p className="text-gray-600">Payment management coming soon...</p></div>} />
      <Route path="/reviews" element={<div className="p-6"><h1 className="text-2xl font-bold">My Reviews</h1><p className="text-gray-600">Review management coming soon...</p></div>} />
      <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile Settings</h1><p className="text-gray-600">Settings page coming soon...</p></div>} />
    </Routes>
  )
}

export default RenterRoutes
