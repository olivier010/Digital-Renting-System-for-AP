import { Routes, Route } from 'react-router-dom'
import RenterDashboard from './RenterDashboard'
import SearchProperties from './SearchProperties'
import Bookings from './Bookings'
import Favorites from './Favorites'
import Payments from './Payments'
import Reviews from './Reviews'
import Settings from './Settings'

const RenterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RenterDashboard />} />
      <Route path="/dashboard" element={<RenterDashboard />} />
      <Route path="/search" element={<SearchProperties />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default RenterRoutes


