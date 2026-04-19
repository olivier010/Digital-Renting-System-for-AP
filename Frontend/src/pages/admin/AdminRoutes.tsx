import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import Users from './Users'
import Properties from './Properties'
import Bookings from './Bookings'
import Reports from './Reports'
import Settings from './Settings'
import Notifications from './Notifications'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default AdminRoutes


