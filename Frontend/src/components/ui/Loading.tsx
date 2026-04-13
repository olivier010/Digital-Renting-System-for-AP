interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullPage?: boolean
}

const Loading = ({ size = 'md', text, fullPage = false }: LoadingProps) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizes[size]} rounded-full border-2 border-primary-200 dark:border-primary-800`}></div>
        {/* Spinning arc */}
        <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent border-t-primary-600 dark:border-t-primary-400 animate-spin`}></div>
      </div>
      {text && (
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  )
}

export default Loading


