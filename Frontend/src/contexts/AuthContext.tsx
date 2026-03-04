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
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  clearError: () => void
}

// Mock user database
const MOCK_USERS: User[] = [
  // Admin users
  {
    id: 'admin-1',
    email: 'admin@rentwise.com',
    firstName: 'System',
    lastName: 'Administrator',
    type: 'admin',
    joinedAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'admin-2',
    email: 'superadmin@rentwise.com',
    firstName: 'Super',
    lastName: 'Admin',
    type: 'admin',
    joinedAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
    isActive: true
  },
  
  // Owner users
  {
    id: 'owner-1',
    email: 'owner@rentwise.com',
    firstName: 'John',
    lastName: 'Property',
    type: 'owner',
    phone: '+1-555-0101',
    joinedAt: '2024-01-15',
    lastLogin: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'owner-2',
    email: 'sarah.johnson@rentwise.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    type: 'owner',
    phone: '+1-555-0102',
    joinedAt: '2024-01-14',
    lastLogin: '2024-01-16T10:30:00Z',
    isActive: true
  },
  {
    id: 'owner-3',
    email: 'mike.chen@rentwise.com',
    firstName: 'Mike',
    lastName: 'Chen',
    type: 'owner',
    phone: '+1-555-0103',
    joinedAt: '2024-01-13',
    lastLogin: '2024-01-15T14:20:00Z',
    isActive: true
  },
  
  // Renter users
  {
    id: 'renter-1',
    email: 'renter@rentwise.com',
    firstName: 'Jane',
    lastName: 'Doe',
    type: 'renter',
    phone: '+1-555-0201',
    joinedAt: '2024-01-20',
    lastLogin: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'renter-2',
    email: 'james.wilson@rentwise.com',
    firstName: 'James',
    lastName: 'Wilson',
    type: 'renter',
    phone: '+1-555-0202',
    joinedAt: '2024-01-11',
    lastLogin: '2024-01-16T09:15:00Z',
    isActive: true
  },
  {
    id: 'renter-3',
    email: 'emily.davis@rentwise.com',
    firstName: 'Emily',
    lastName: 'Davis',
    type: 'renter',
    phone: '+1-555-0203',
    joinedAt: '2024-01-12',
    lastLogin: '2024-01-15T16:45:00Z',
    isActive: true
  }
]

// Mock passwords (in real app, these would be hashed)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@rentwise.com': 'admin123',
  'superadmin@rentwise.com': 'superadmin123',
  'owner@rentwise.com': 'owner123',
  'sarah.johnson@rentwise.com': 'password123',
  'mike.chen@rentwise.com': 'password123',
  'renter@rentwise.com': 'renter123',
  'james.wilson@rentwise.com': 'password123',
  'emily.davis@rentwise.com': 'password123'
}

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  // Simulate checking for existing session on app load
  useEffect(() => {
    const checkAuthSession = () => {
      const savedUser = localStorage.getItem('rentwise_user')
      const savedToken = localStorage.getItem('rentwise_token')
      
      if (savedUser && savedToken) {
        try {
          const user = JSON.parse(savedUser)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          localStorage.removeItem('rentwise_user')
          localStorage.removeItem('rentwise_token')
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

    // Simulate network delay
    const timer = setTimeout(checkAuthSession, 1000)
    return () => clearTimeout(timer)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Find user in mock database
      const user = MOCK_USERS.find(u => u.email === credentials.email)
      
      if (!user) {
        throw new Error('User not found')
      }
      
      if (!user.isActive) {
        throw new Error('Account is deactivated')
      }
      
      const expectedPassword = MOCK_PASSWORDS[credentials.email]
      if (credentials.password !== expectedPassword) {
        throw new Error('Invalid password')
      }
      
      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      }
      
      // Generate mock token
      const token = `mock_token_${Date.now()}_${user.id}`
      
      // Save to localStorage
      if (credentials.rememberMe) {
        localStorage.setItem('rentwise_user', JSON.stringify(updatedUser))
        localStorage.setItem('rentwise_token', token)
      } else {
        sessionStorage.setItem('rentwise_user', JSON.stringify(updatedUser))
        sessionStorage.setItem('rentwise_token', token)
      }
      
      setAuthState({
        user: updatedUser,
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

  const register = useCallback(async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === data.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      // Create new user
      const newUser: User = {
        id: `${data.type}-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        type: data.userType,
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true
      }
      
      // Add to mock database (in real app, this would be done by backend)
      MOCK_USERS.push(newUser)
      MOCK_PASSWORDS[data.email] = data.password
      
      // Generate mock token
      const token = `mock_token_${Date.now()}_${newUser.id}`
      
      // Save to localStorage
      localStorage.setItem('rentwise_user', JSON.stringify(newUser))
      localStorage.setItem('rentwise_token', token)
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
      
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      })
    }
  }, [])

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
