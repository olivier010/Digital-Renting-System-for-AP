import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: number
  trendLabel?: string
  iconColor?: string
  iconBg?: string
  className?: string
}

const StatCard = ({
  label,
  value,
  icon,
  trend,
  trendLabel = 'from last month',
  iconColor = 'text-primary-600 dark:text-primary-400',
  iconBg = 'bg-primary-100 dark:bg-primary-900/30',
  className = '',
}: StatCardProps) => {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <div className={`card-elevated p-6 group hover:shadow-soft-lg dark:hover:shadow-dark-lg transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
            {label}
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white tracking-tight">
            {value}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`inline-flex items-center text-xs font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <svg
                  className={`w-3.5 h-3.5 mr-0.5 ${isPositive ? '' : 'rotate-180'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {isPositive ? '+' : ''}{trend.toFixed(1)}%
              </span>
              <span className="text-xs text-surface-400 dark:text-surface-500">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard


