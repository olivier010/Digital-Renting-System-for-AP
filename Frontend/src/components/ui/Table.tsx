import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
  emptyIcon?: ReactNode
  onRowClick?: (item: T) => void
  className?: string
}

function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data found', emptyIcon, onRowClick, className = '' }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={`card-elevated p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center text-center">
          {emptyIcon || (
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          )}
          <p className="text-surface-500 dark:text-surface-400 font-medium">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`card-elevated overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3.5 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider bg-surface-50 dark:bg-surface-800/50 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-6 py-4 text-sm text-surface-700 dark:text-surface-300 ${col.className || ''}`}>
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table


