import { Routes, Route } from 'react-router-dom'
import OwnerDashboard from './OwnerDashboard'
import Properties from './Properties'
import Bookings from './Bookings'
import Earnings from './Earnings'
import Reviews from './Reviews'
import Settings from './Settings'
import AddProperty from './AddProperty'
import OwnerPropertyDetail from './OwnerPropertyDetail'

const OwnerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerDashboard />} />
      <Route path="/dashboard" element={<OwnerDashboard />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/properties/:id/edit" element={<AddProperty />} />
      <Route path="/properties/:id" element={<OwnerPropertyDetail />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default OwnerRoutes
