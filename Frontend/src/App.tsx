import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar.tsx'
import AdminLayout from './components/AdminLayout.tsx'
import OwnerLayout from './components/OwnerLayout.tsx'
import RenterLayout from './components/RenterLayout.tsx'
import { Home, About, Contact, Login, Register, Faq } from './pages'
import { Properties, PropertyDetail, Profile } from './pages/renter'
import { AdminGuard, OwnerGuard, AnyUserGuard, RenterGuard } from './components/AuthGuard'

// Admin route component with layout
const AdminRoute = () => (
  <AdminGuard>
    <AdminLayout />
  </AdminGuard>
)

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Routes>
              {/* Admin Routes - No Navbar */}
              <Route path="/admin/*" element={<AdminRoute />} />
              <Route path="/dashboard/*" element={<AdminRoute />} /> {/* Legacy redirect */}
              
              {/* Public Routes - With Navbar */}
              <Route path="/" element={<><Navbar /><main><Home /></main></>} />
              <Route path="/properties" element={<><Navbar /><main><Properties /></main></>} />
              <Route path="/properties/:id" element={<><Navbar /><main><PropertyDetail /></main></>} />
              <Route path="/login" element={<><Navbar /><main><Login /></main></>} />
              <Route path="/register" element={<><Navbar /><main><Register /></main></>} />
              <Route path="/contact" element={<><Navbar /><main><Contact /></main></>} />
              <Route path="/about" element={<><Navbar /><main><About /></main></>} />
              <Route path="/faq" element={<><Navbar /><main><Faq /></main></>} />
              
              {/* Protected Routes - Any authenticated user */}
              <Route path="/profile" element={
                <><Navbar /><main><AnyUserGuard><Profile /></AnyUserGuard></main></>
              } />
              
              {/* Owner Routes */}
              <Route path="/owner/*" element={
                <OwnerGuard><OwnerLayout /></OwnerGuard>
              } />

              {/* Renter Routes */}
              <Route path="/renter/*" element={
                <RenterGuard><RenterLayout /></RenterGuard>
              } />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
