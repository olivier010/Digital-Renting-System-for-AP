import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Check, Eye, EyeOff, AlertCircle, Mail, Lock, User, Phone } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    userType: 'renter' | 'owner' | 'admin';
    agreeToTerms: boolean;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'renter', // renter or owner
    agreeToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await register({
        ...formData,
        type: formData.userType as 'renter' | 'owner' | 'admin',
      })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    
    const levels = [
      { text: 'Very Weak', color: 'text-red-500' },
      { text: 'Weak', color: 'text-orange-500' },
      { text: 'Fair', color: 'text-yellow-500' },
      { text: 'Good', color: 'text-blue-500' },
      { text: 'Strong', color: 'text-green-500' },
      { text: 'Very Strong', color: 'text-green-600' }
    ]
    
    return { strength, ...levels[Math.min(strength - 1, 5)] }
  }

  const passwordStrength = getPasswordStrength(formData.password)

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
                    
                    {/* Registration form elements */}
                    <rect x="8" y="42" width="64" height="4" rx="2" fill="#F0FDF4" className="dark:fill-gray-800" />
                    <rect x="8" y="50" width="64" height="4" rx="2" fill="#F0FDF4" className="dark:fill-gray-800" />
                    <rect x="8" y="58" width="64" height="4" rx="2" fill="#F0FDF4" className="dark:fill-gray-800" />
                    
                    <rect x="8" y="72" width="64" height="4" rx="2" fill="#FEF3C7" className="dark:fill-gray-800" />
                    <rect x="8" y="80" width="64" height="4" rx="2" fill="#FEF3C7" className="dark:fill-gray-800" />
                    
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

        {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-xl">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
              {/* Logo and Header */}
              <div className="text-center mb-4">
                <Link to="/" className="flex justify-center mb-3">
                  <div className="bg-primary-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                    RW
                  </div>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Create your account
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join RentWise and start your rental journey
                </p>
              </div>

              {/* Success Message */}
              {success ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Registration Successful!</h3>
                  <p className="text-gray-700 dark:text-gray-200 text-center">You will be redirected to the login page shortly.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    If not redirected, <Link to="/login" className="text-primary-600 hover:underline">click here</Link>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Auth Error */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Two Column Form */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Left Column */}
                    <div className="space-y-2">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-base ${
                              errors.firstName ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="John"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-base ${
                              errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Password *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full pl-9 pr-9 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-base ${
                              errors.password ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Create strong password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="userType" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Account Type *
                        </label>
                        <select
                          id="userType"
                          name="userType"
                          value={formData.userType}
                          onChange={handleChange}
                          className="block w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                        >
                          <option value="renter">RENTER</option>
                          <option value="owner">OWNER</option>
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`appearance-none relative block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-base ${
                            errors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-base ${
                              errors.phone ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="+1234567890"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full pl-9 pr-9 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-base ${
                              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Password Strength
                        </label>
                        {formData.password && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Strength:</span>
                              <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.text}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength.strength <= 2 ? 'bg-red-500' :
                                  passwordStrength.strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms and Submit - Full Width */}
                  <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="flex items-start">
                        <input
                          id="agreeToTerms"
                          name="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded mt-1"
                        />
                        <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {(isSubmitting || isLoading) ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
