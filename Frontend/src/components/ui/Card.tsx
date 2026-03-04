import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, hover = false, ...props }, ref) => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700'
    const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200 dark:hover:shadow-gray-700' : ''
    
    const classes = `${baseClasses} ${hoverClass} ${className}`
    
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
    const classes = `px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`
    
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
    const classes = `px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`
    
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
