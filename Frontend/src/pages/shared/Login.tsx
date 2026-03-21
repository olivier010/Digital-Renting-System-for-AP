import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Building, Users, Shield, Star } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import type { LoginCredentials } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError, user, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from as string
      if (from) {
        navigate(from, { replace: true })
      } else {
        // Redirect based on user type
        switch (user.type) {
          case 'admin':
            navigate('/dashboard', { replace: true })
            break
          case 'owner':
            navigate('/owner/dashboard', { replace: true })
            break
          case 'renter':
            navigate('/renter/dashboard', { replace: true })
            break
          default:
            navigate('/profile', { replace: true })
        }
      }
    }
  }, [isAuthenticated, user, navigate, location.state])

  // Clear auth errors when component unmounts or input changes
  useEffect(() => {
    return () => clearError()
  }, [clearError])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await login(formData)
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) {
      clearError()
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Visual/Marketing Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-gray-900 p-12">
          <div className="flex-1 flex flex-col justify-center">
            {/* Custom Illustration */}
            <div className="relative">
              <div className="w-full h-[450px] flex items-center justify-center">
                <svg viewBox="0 0 400 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Background subtle gradient */}
                  <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0.05}} />
                      <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 0.02}} />
                    </linearGradient>
                    <linearGradient id="bgGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0.1}} />
                      <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 0.1}} />
                    </linearGradient>
                    <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0.8}} />
                      <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 0.9}} />
                    </linearGradient>
                    <linearGradient id="laptopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#60A5FA', stopOpacity: 0.8}} />
                      <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 0.9}} />
                    </linearGradient>
                    <linearGradient id="darkPhoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#374151', stopOpacity: 0.9}} />
                      <stop offset="100%" style={{stopColor: '#1F2937', stopOpacity: 0.95}} />
                    </linearGradient>
                    <linearGradient id="darkLaptopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#4B5563', stopOpacity: 0.9}} />
                      <stop offset="100%" style={{stopColor: '#374151', stopOpacity: 0.95}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Subtle background */}
                  <rect width="400" height="320" fill="url(#bgGradient)" className="dark:fill-[url(#bgGradientDark)]" rx="16" />
                  
                  {/* Large Smartphone */}
                  <g transform="translate(120, 60)">
                    {/* Phone frame */}
                    <rect x="0" y="0" width="80" height="140" rx="8" fill="url(#phoneGradient)" className="dark:fill-[url(#darkPhoneGradient)]" />
                    <rect x="4" y="12" width="72" height="116" rx="4" fill="white" className="dark:fill-gray-900" />
                    
                    {/* App interface - Header */}
                    <rect x="8" y="16" width="64" height="20" rx="4" fill="#EFF6FF" className="dark:fill-gray-800" />
                    <circle cx="20" cy="26" r="3" fill="#3B82F6" />
                    <rect x="28" y="23" width="24" height="6" rx="3" fill="#DBEAFE" className="dark:fill-gray-700" />
                    
                    {/* Property cards */}
                    <rect x="8" y="42" width="64" height="24" rx="4" fill="#F0FDF4" className="dark:fill-gray-800" />
                    <rect x="12" y="46" width="16" height="16" rx="2" fill="#10B981" opacity="0.3" />
                    <rect x="30" y="48" width="20" height="4" rx="2" fill="#DCFCE7" className="dark:fill-gray-700" />
                    <rect x="30" y="54" width="16" height="3" rx="1" fill="#DCFCE7" className="dark:fill-gray-700" />
                    
                    <rect x="8" y="72" width="64" height="24" rx="4" fill="#FEF3C7" className="dark:fill-gray-800" />
                    <rect x="12" y="76" width="16" height="16" rx="2" fill="#F59E0B" opacity="0.3" />
                    <rect x="30" y="78" width="20" height="4" rx="2" fill="#FEF9C3" className="dark:fill-gray-700" />
                    <rect x="30" y="84" width="16" height="3" rx="1" fill="#FEF9C3" className="dark:fill-gray-700" />
                    
                    {/* Bottom navigation */}
                    <rect x="8" y="104" width="64" height="20" rx="4" fill="#F3F4F6" className="dark:fill-gray-800" />
                    <circle cx="20" cy="114" r="3" fill="#6B7280" />
                    <circle cx="40" cy="114" r="3" fill="#3B82F6" />
                    <circle cx="60" cy="114" r="3" fill="#6B7280" />
                  </g>
                  
                  {/* Character with Phone */}
                  <g transform="translate(60, 180)">
                    {/* Body */}
                    <ellipse cx="40" cy="80" rx="25" ry="30" fill="#3B82F6" opacity="0.8" />
                    {/* Head */}
                    <circle cx="40" cy="40" r="15" fill="#FDB5A6" />
                    {/* Hair */}
                    <path d="M25 35 Q40 25, 55 35 Q52 30, 40 28 Q28 30, 25 35" fill="#1F2937" />
                    {/* Arms holding phone */}
                    <rect x="35" y="55" width="8" height="25" rx="4" fill="#FDB5A6" transform="rotate(-15 39 67)" />
                    <rect x="37" y="55" width="8" height="25" rx="4" fill="#FDB5A6" transform="rotate(15 41 67)" />
                    {/* Phone in hand */}
                    <rect x="32" y="45" width="16" height="28" rx="2" fill="#1F2937" />
                    <rect x="34" y="47" width="12" height="20" rx="1" fill="#60A5FA" />
                  </g>
                  
                  {/* Laptop User */}
                  <g transform="translate(240, 160)">
                    {/* Laptop */}
                    <rect x="0" y="40" width="80" height="50" rx="4" fill="url(#laptopGradient)" className="dark:fill-[url(#darkLaptopGradient)]" />
                    <rect x="4" y="44" width="72" height="40" rx="2" fill="white" className="dark:fill-gray-900" />
                    <rect x="20" y="90" width="40" height="4" rx="2" fill="#6B7280" />
                    <rect x="30" y="94" width="20" height="8" rx="2" fill="#9CA3AF" />
                    
                    {/* Screen content */}
                    <rect x="8" y="48" width="64" height="8" rx="2" fill="#EFF6FF" className="dark:fill-gray-800" />
                    <rect x="8" y="60" width="30" height="20" rx="2" fill="#F0FDF4" className="dark:fill-gray-800" />
                    <rect x="42" y="60" width="30" height="20" rx="2" fill="#FEF3C7" className="dark:fill-gray-800" />
                    
                    {/* Person */}
                    <ellipse cx="40" cy="25" rx="20" ry="22" fill="#3B82F6" opacity="0.8" className="dark:fill-[#10B981]" />
                    <circle cx="40" cy="5" r="12" fill="#FDB5A6" />
                    <path d="M28 2 Q40 -5, 52 2 Q50 -2, 40 -3 Q30 -2, 28 2" fill="#1F2937" />
                    {/* Arms */}
                    <rect x="35" y="20" width="6" height="20" rx="3" fill="#FDB5A6" transform="rotate(-10 38 30)" />
                    <rect x="39" y="20" width="6" height="20" rx="3" fill="#FDB5A6" transform="rotate(10 42 30)" />
                  </g>
                  
                  {/* Floating Property Icons */}
                  <g transform="translate(20, 40)">
                    {/* House icon */}
                    <rect x="0" y="8" width="20" height="16" rx="2" fill="#3B82F6" opacity="0.2" />
                    <path d="M0 8 L10 2 L20 8" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.6" />
                    <rect x="6" y="12" width="8" height="8" fill="#3B82F6" opacity="0.4" />
                  </g>
                  
                  <g transform="translate(340, 50)">
                    {/* Car icon */}
                    <rect x="0" y="8" width="24" height="12" rx="4" fill="#3B82F6" opacity="0.2" className="dark:fill-[#10B981]" />
                    <circle cx="6" cy="20" r="3" fill="#3B82F6" opacity="0.4" className="dark:fill-[#10B981]" />
                    <circle cx="18" cy="20" r="3" fill="#3B82F6" opacity="0.4" className="dark:fill-[#10B981]" />
                    <rect x="4" y="4" width="16" height="8" rx="2" fill="#3B82F6" opacity="0.3" className="dark:fill-[#10B981]" />
                  </g>
                  
                  <g transform="translate(300, 100)">
                    {/* Location pin */}
                    <path d="M12 0 C6 0, 0 6, 0 12 C0 20, 12 32, 12 32 S24 20, 24 12 C24 6, 18 0, 12 0 Z" fill="#F59E0B" opacity="0.3" />
                    <circle cx="12" cy="12" r="4" fill="#F59E0B" opacity="0.6" />
                  </g>
                  
                  {/* Connection lines */}
                  <line x1="100" y1="140" x2="240" y2="180" stroke="#3B82F6" strokeWidth="1" opacity="0.2" strokeDasharray="4,4" />
                  <line x1="200" y1="130" x2="280" y2="170" stroke="#3B82F6" strokeWidth="1" opacity="0.2" strokeDasharray="4,4" className="dark:stroke-[#10B981]" />
                  
                  {/* Floating particles */}
                  <circle cx="50" cy="80" r="2" fill="#3B82F6" opacity="0.4" />
                  <circle cx="350" cy="120" r="3" fill="#3B82F6" opacity="0.4" className="dark:fill-[#10B981]" />
                  <circle cx="180" cy="40" r="2" fill="#F59E0B" opacity="0.4" />
                  <circle cx="320" cy="200" r="2" fill="#3B82F6" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-sm">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
              {/* Logo and Header */}
              <div className="text-center mb-6">
                <Link to="/" className="flex justify-center mb-4">
                  <div className="bg-primary-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                    RW
                  </div>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Sign in to your account
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back! Please enter your details
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Auth Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`appearance-none relative block w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-sm ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`appearance-none relative block w-full pl-9 pr-9 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-sm ${
                        formErrors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formErrors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-xs">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              {/* Social Login */}
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-1">Google</span>
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="ml-1">Facebook</span>
                  </button>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
