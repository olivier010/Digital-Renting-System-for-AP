import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

// User types
export type UserType = 'renter' | 'owner' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  type: UserType
  avatar?: string
  phone?: string
  joinedAt: string
  lastLogin?: string
  isActive: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  userType: UserType
  agreeToTerms: boolean
  type: UserType
  phone?: string
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  clearError: () => void
}

// ...existing code...

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

const normalizeUserType = (rawType: unknown): UserType => {
  const type = String(rawType || '').toLowerCase()
  if (type === 'admin' || type === 'owner' || type === 'renter') {
    return type
  }
  return 'renter'
}

const normalizeUser = (user: any): User => ({
  ...user,
  type: normalizeUserType(user?.type || user?.role || user?.userType)
})

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  const clearStoredAuth = () => {
    localStorage.removeItem('rentwise_user')
    localStorage.removeItem('rentwise_token')
    sessionStorage.removeItem('rentwise_user')
    sessionStorage.removeItem('rentwise_token')
  }

  // Validate existing session on app load.
  useEffect(() => {
    const checkAuthSession = async () => {
      const savedUser = localStorage.getItem('rentwise_user') || sessionStorage.getItem('rentwise_user')
      const savedToken = localStorage.getItem('rentwise_token') || sessionStorage.getItem('rentwise_token')
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser)
          const normalizedUser = normalizeUser(parsedUser)

          const meRes = await fetch('http://localhost:8080/api/auth/me', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${savedToken}`
            }
          })

          if (!meRes.ok) {
            clearStoredAuth()
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            })
            return
          }

          setAuthState({
            user: normalizedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

          // Persist normalized auth data to avoid future role/type mismatches.
          const hasLocalSession = Boolean(localStorage.getItem('rentwise_user'))
          const storage = hasLocalSession ? localStorage : sessionStorage
          storage.setItem('rentwise_user', JSON.stringify(normalizedUser))
        } catch {
          clearStoredAuth()
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    }

    void checkAuthSession()
  }, [])

  // Implement login with backend API
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Login failed')
      }
      const result = await response.json()
      // Backend wraps token and user in data property
      const { token, user } = result.data || {}
      if (!token || !user) throw new Error('Invalid response from server')
      const normalizedUser = normalizeUser(user)

      // Keep only one active session source to avoid stale token conflicts.
      clearStoredAuth()

      if (credentials.rememberMe) {
        localStorage.setItem('rentwise_user', JSON.stringify(normalizedUser))
        localStorage.setItem('rentwise_token', token)
      } else {
        sessionStorage.setItem('rentwise_user', JSON.stringify(normalizedUser))
        sessionStorage.setItem('rentwise_token', token)
      }
      setAuthState({
        user: normalizedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      })
    }
  }, [])

  // Implement register with backend API
  const register = useCallback(async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone || '',
          role: (data.userType || data.type || 'RENTER').toUpperCase()
        })
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Registration failed')
      }
      // Registration success, auto-login
      await login({ email: data.email, password: data.password, rememberMe: true })
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      })
    }
  }, [login])

  const logout = useCallback(() => {
    // Clear all storage thoroughly
    localStorage.removeItem('rentwise_user')
    localStorage.removeItem('rentwise_token')
    sessionStorage.removeItem('rentwise_user')
    sessionStorage.removeItem('rentwise_token')
    
    // Also clear any other potential auth-related items
    localStorage.clear()
    sessionStorage.clear()
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
  }, [])

  const updateUser = useCallback((userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData }
      setAuthState(prev => ({ ...prev, user: updatedUser }))
      
      // Update storage
      const savedUser = localStorage.getItem('rentwise_user')
      if (savedUser) {
        localStorage.setItem('rentwise_user', JSON.stringify(updatedUser))
      } else {
        sessionStorage.setItem('rentwise_user', JSON.stringify(updatedUser))
      }
    }
  }, [authState.user])

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  const value: AuthContextType = useMemo(() => ({
    ...authState,
    login,
    register,
    logout,
    updateUser,
    clearError
  }), [authState, login, register, logout, updateUser, clearError])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
