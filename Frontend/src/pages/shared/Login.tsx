import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
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
        const resolvedUserType = String((user as any).type || (user as any).role || (user as any).userType || '').toLowerCase()
        switch (resolvedUserType) {
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
            navigate('/renter/dashboard', { replace: true })
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
    if (!validateForm()) return
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
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
    if (error) clearError()
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Visual Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary"></div>
          {/* Floating decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-32 right-16 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative flex-1 flex flex-col justify-center px-12 xl:px-20">
            <div className="animate-fade-in-up">
              <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <span className="text-white font-bold text-2xl">RW</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 tracking-tight">
                Welcome back to
                <br />
                <span className="text-accent-300">RentWise</span>
              </h2>
              <p className="text-white/70 text-lg max-w-md mb-8">
                Access your dashboard to manage properties, bookings, and more.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '10K+', label: 'Users' },
                  { value: '5K+', label: 'Properties' },
                  { value: '98%', label: 'Satisfaction' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-fade-in-up">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md">
                  RW
                </div>
                <span className="font-bold text-xl text-surface-900 dark:text-white">RentWise</span>
              </Link>
            </div>

            <div className="card-elevated p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
                  Sign in to your account
                </h1>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Welcome back! Please enter your details
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Auth Error */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-3 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-surface-50 dark:bg-surface-800 dark:text-white placeholder-surface-400 text-sm transition-all ${
                        formErrors.email ? 'border-red-300 dark:border-red-600' : 'border-surface-200 dark:border-surface-600'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{formErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-10 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-surface-50 dark:bg-surface-800 dark:text-white placeholder-surface-400 text-sm transition-all ${
                        formErrors.password ? 'border-red-300 dark:border-red-600' : 'border-surface-200 dark:border-surface-600'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-surface-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{formErrors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded dark:border-surface-600 dark:bg-surface-800"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-surface-600 dark:text-surface-400">
                      Remember me
                    </label>
                  </div>

                  <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-soft dark:shadow-dark-soft disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>

                {/* Social Login */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-200 dark:border-surface-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-surface-200 dark:border-surface-600 rounded-2xl text-sm font-medium text-surface-600 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-surface-200 dark:border-surface-600 rounded-2xl text-sm font-medium text-surface-600 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


