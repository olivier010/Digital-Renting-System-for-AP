import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Check, Eye, EyeOff, AlertCircle, Mail, Lock, User, Phone } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState<{
    firstName: string; lastName: string; email: string; phone: string;
    password: string; confirmPassword: string; userType: 'renter' | 'owner' | 'admin'; agreeToTerms: boolean;
  }>({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', userType: 'renter', agreeToTerms: false
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
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) { newErrors.email = 'Email is required' }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Email is invalid' }
    if (!formData.phone) { newErrors.phone = 'Phone number is required' }
    else if (!/^\+?\d{7,10}$/.test(formData.phone)) { newErrors.phone = 'Phone number is invalid' }
    if (!formData.password) { newErrors.password = 'Password is required' }
    else if (formData.password.length < 8) { newErrors.password = 'Password must be at least 8 characters' }
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) { newErrors.password = 'Password must contain uppercase, lowercase, and number' }
    if (!formData.confirmPassword) { newErrors.confirmPassword = 'Please confirm your password' }
    else if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Passwords do not match' }
    if (!formData.agreeToTerms) { newErrors.agreeToTerms = 'You must agree to the terms and conditions' }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await register({ ...formData, type: formData.userType as 'renter' | 'owner' | 'admin' })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch { /* Error handled by AuthContext */ }
    finally { setIsSubmitting(false) }
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
      { text: 'Very Weak', color: 'text-red-500' }, { text: 'Weak', color: 'text-orange-500' },
      { text: 'Fair', color: 'text-yellow-500' }, { text: 'Good', color: 'text-blue-500' },
      { text: 'Strong', color: 'text-green-500' }, { text: 'Very Strong', color: 'text-green-600' }
    ]
    return { strength, ...levels[Math.min(strength - 1, 5)] }
  }
  const passwordStrength = getPasswordStrength(formData.password)

  const inputClasses = (fieldName: string) =>
    `w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-surface-50 dark:bg-surface-800 dark:text-white placeholder-surface-400 text-sm transition-all ${errors[fieldName] ? 'border-red-300 dark:border-red-600' : 'border-surface-200 dark:border-surface-600'}`

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Visual Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary"></div>
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
                Join the <span className="text-accent-300">RentWise</span> community
              </h2>
              <p className="text-white/70 text-lg max-w-md mb-8">
                Create your account and start finding or listing properties in minutes.
              </p>

              <div className="space-y-4">
                {[
                  { icon: '✓', text: 'Free for renters to browse and book' },
                  { icon: '✓', text: 'Verified listings with real photos' },
                  { icon: '✓', text: 'Secure payments and 24/7 support' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent-400/20 rounded-full flex items-center justify-center text-accent-300 text-xs">
                      {item.icon}
                    </div>
                    <span className="text-white/80 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-xl animate-fade-in-up">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md">RW</div>
                <span className="font-bold text-xl text-surface-900 dark:text-white">RentWise</span>
              </Link>
            </div>

            <div className="card-elevated p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Create your account</h1>
                <p className="text-sm text-surface-500 dark:text-surface-400">Join RentWise and start your rental journey</p>
              </div>

              {/* Success Message */}
              {success ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Registration Successful!</h3>
                  <p className="text-surface-600 dark:text-surface-300 text-center">You will be redirected to the login page shortly.</p>
                  <p className="text-surface-500 text-sm mt-2">
                    If not redirected, <Link to="/login" className="text-primary-600 hover:underline dark:text-primary-400">click here</Link>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-3 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">First Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400"><User className="h-4 w-4" /></div>
                        <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={inputClasses('firstName')} placeholder="John" />
                      </div>
                      {errors.firstName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>}
                    </div>
                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Last Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400"><User className="h-4 w-4" /></div>
                        <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={inputClasses('lastName')} placeholder="Doe" />
                      </div>
                      {errors.lastName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400"><Mail className="h-4 w-4" /></div>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputClasses('email')} placeholder="john@example.com" />
                      </div>
                      {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                    </div>
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Phone *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400"><Phone className="h-4 w-4" /></div>
                        <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClasses('phone')} placeholder="+1234567890" />
                      </div>
                      {errors.phone && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400"><Lock className="h-4 w-4" /></div>
                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className={`${inputClasses('password')} pr-10`} placeholder="Strong password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-surface-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
                    </div>
                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Confirm Password *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400"><Lock className="h-4 w-4" /></div>
                        <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} className={`${inputClasses('confirmPassword')} pr-10`} placeholder="Confirm password" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-surface-600">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  {/* Password Strength */}
                  {formData.password && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-surface-600 dark:text-surface-400">Password Strength:</span>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.text}</span>
                      </div>
                      <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.strength <= 2 ? 'bg-red-500' : passwordStrength.strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Account Type */}
                  <div>
                    <label htmlFor="userType" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Account Type *</label>
                    <select id="userType" name="userType" value={formData.userType} onChange={handleChange} className="w-full px-4 py-3 border-2 border-surface-200 dark:border-surface-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white text-sm transition-all">
                      <option value="renter">RENTER</option>
                      <option value="owner">OWNER</option>
                    </select>
                  </div>

                  {/* Terms & Submit */}
                  <div className="space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex items-start">
                      <input id="agreeToTerms" name="agreeToTerms" type="checkbox" checked={formData.agreeToTerms} onChange={handleChange} className="h-4 w-4 flex-shrink-0 text-primary-600 focus:ring-primary-500 border-surface-300 rounded mt-0.5 dark:border-surface-600 dark:bg-surface-800" />
                      <label htmlFor="agreeToTerms" className="ml-2 text-sm text-surface-600 dark:text-surface-400">
                        I agree to the <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">Terms of Service</Link> and <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">Privacy Policy</Link>
                      </label>
                    </div>
                    {errors.agreeToTerms && <p className="text-xs text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>}

                    <button type="submit" disabled={isSubmitting || isLoading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      {(isSubmitting || isLoading) ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                          Creating Account...
                        </span>
                      ) : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-surface-500 dark:text-surface-400">
                      Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">Sign in</Link>
                    </p>
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
