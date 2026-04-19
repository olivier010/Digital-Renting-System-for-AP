import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ui/ThemeToggle'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => location.pathname === path
  const dashboardPath =
    user?.type === 'admin' ? '/dashboard' :
      user?.type === 'owner' ? '/owner/dashboard' :
        '/renter/dashboard'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/properties' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled || isMenuOpen
        ? 'glass-navbar shadow-soft dark:shadow-dark-soft'
        : 'bg-white/60 dark:bg-surface-900/60 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-glow-primary transition-shadow duration-300">
              RW
            </div>
            <span className="font-bold text-xl text-surface-800 dark:text-white tracking-tight">
              Rent<span className="text-primary-600 dark:text-primary-400">Wise</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link px-4 py-2 rounded-lg text-sm ${
                  isActive(link.path) || (link.path === '/properties' && isActive('/properties/'))
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-soft dark:shadow-dark-soft hover:scale-[1.02]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Open Portal
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white font-medium text-sm transition-colors px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-600 hover:to-accent-500 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-soft dark:shadow-dark-soft hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-2xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-5 relative">
                <span className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'top-[10px] rotate-45' : 'top-[3px]'}`}></span>
                <span className={`absolute left-0 top-[10px] w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'top-[10px] -rotate-45' : 'top-[17px]'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 space-y-2 border-t border-surface-200 dark:border-surface-700 mt-2">
              {isAuthenticated ? (
                <Link
                  to={dashboardPath}
                  className="block w-full text-center bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2.5 rounded-2xl font-semibold text-sm"
                >
                  Open Portal
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center text-surface-600 dark:text-surface-300 font-medium text-sm py-2.5 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-gradient-to-r from-accent-500 to-accent-400 text-white px-4 py-2.5 rounded-2xl font-semibold text-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


