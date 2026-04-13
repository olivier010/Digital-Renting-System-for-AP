import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]'
    
    const variants: Record<string, string> = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white focus-visible:ring-primary-500 shadow-sm hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600',
      secondary: 'bg-surface-600 hover:bg-surface-700 text-white focus-visible:ring-surface-500 shadow-sm hover:shadow-md dark:bg-surface-600 dark:hover:bg-surface-500',
      outline: 'border-2 border-surface-300 text-surface-700 bg-white hover:bg-surface-50 focus-visible:ring-primary-500 dark:border-surface-600 dark:text-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700',
      ghost: 'text-surface-600 hover:bg-surface-100 focus-visible:ring-primary-500 dark:text-surface-300 dark:hover:bg-surface-800',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 shadow-sm hover:shadow-md dark:bg-red-600 dark:hover:bg-red-500',
      gradient: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white focus-visible:ring-primary-500 shadow-md hover:shadow-soft dark:shadow-dark-soft hover:scale-[1.02]',
      accent: 'bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-600 hover:to-accent-500 text-white focus-visible:ring-accent-500 shadow-md hover:shadow-soft dark:shadow-dark-soft hover:scale-[1.02]',
    }
    
    const sizes: Record<string, string> = {
      xs: 'px-2.5 py-1 text-xs gap-1',
      sm: 'px-3.5 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2',
      icon: 'p-2.5',
    }

    const classes = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`

    return (
      <button
        className={classes}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button


