import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  variant?: 'default' | 'glass' | 'gradient-border'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, hover = false, variant = 'default', padding = 'none', ...props }, ref) => {
    const variants: Record<string, string> = {
      default: 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-soft dark:shadow-dark-soft',
      glass: 'glass-card',
      'gradient-border': 'bg-white dark:bg-surface-800 border border-primary-200/50 dark:border-primary-700/30 shadow-soft dark:shadow-dark-soft ring-1 ring-primary-100/50 dark:ring-primary-800/20',
    }

    const paddings: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    const hoverClass = hover ? 'hover:shadow-soft-lg dark:hover:shadow-dark-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : 'transition-all duration-200'
    
    const classes = `rounded-2xl ${variants[variant]} ${paddings[padding]} ${hoverClass} ${className}`
    
    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = `px-6 py-4 border-b border-surface-200 dark:border-surface-700 ${className}`
    
    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = `px-6 py-4 ${className}`
    
    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = `px-6 py-4 border-t border-surface-200 dark:border-surface-700 ${className}`
    
    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export default Card
export { CardHeader, CardBody, CardFooter }


