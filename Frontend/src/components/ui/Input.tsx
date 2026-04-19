import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    const baseClasses = 'w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-200 text-sm bg-surface-50 dark:bg-surface-800 placeholder-surface-400 dark:placeholder-surface-500'
    const stateClasses = error 
      ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-red-600 dark:focus:border-red-500'
      : 'border-surface-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:border-surface-600 dark:focus:border-primary-400 dark:text-white'
    
    const classes = `${baseClasses} ${stateClasses} ${icon ? 'pl-11' : ''} ${className}`

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400 dark:text-surface-500">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            className={classes}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input


