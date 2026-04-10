import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserType } from '../contexts/AuthContext'
import Loading from './ui/Loading'

interface AuthGuardProps {
  children: ReactNode
  requiredType?: UserType
  redirectTo?: string
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredType, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  if (requiredType && user?.type !== requiredType) {
    // Redirect to appropriate dashboard based on user type
    const redirectMap: Record<UserType, string> = {
      admin: '/dashboard',
      owner: '/owner/dashboard',
      renter: '/renter/dashboard'
    }

    const resolvedType: UserType =
      user?.type === 'admin' || user?.type === 'owner' || user?.type === 'renter'
        ? user.type
        : 'renter'
    
    return (
      <Navigate 
        to={redirectMap[resolvedType]} 
        replace 
      />
    )
  }

  return <>{children}</>
}

// Specific route guards for different user types
export const AdminGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requiredType="admin" redirectTo="/login">
    {children}
  </AuthGuard>
)

export const OwnerGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requiredType="owner" redirectTo="/login">
    {children}
  </AuthGuard>
)

export const RenterGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requiredType="renter" redirectTo="/login">
    {children}
  </AuthGuard>
)

export const AnyUserGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard redirectTo="/login">
    {children}
  </AuthGuard>
)
