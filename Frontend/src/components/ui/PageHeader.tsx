import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

const PageHeader = ({ title, subtitle, action, className = '' }: PageHeaderProps) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}

export default PageHeader


