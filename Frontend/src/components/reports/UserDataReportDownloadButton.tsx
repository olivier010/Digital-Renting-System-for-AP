import { useState } from 'react'
import { Download } from 'lucide-react'
import { apiFetch } from '../../utils/api'
import { downloadUserDataPdfReport } from './userDataPdfReport'

interface UserDataReportDownloadButtonProps {
  className?: string
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

const UserDataReportDownloadButton = ({
  className,
  onSuccess,
  onError
}: UserDataReportDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await apiFetch('/auth/me/export')
      const payload = response?.data ?? response
      downloadUserDataPdfReport(payload)
      onSuccess?.('Your PDF report has been downloaded.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download PDF report'
      onError?.(message)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={
        className ??
        'w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed dark:hover:bg-gray-700 transition-colors'
      }
    >
      <div className="flex items-center space-x-3">
        <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <div className="text-left">
          <p className="font-medium text-gray-900 dark:text-white">{isDownloading ? 'Preparing PDF...' : 'Download Your Data'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get a full PDF report of your data</p>
        </div>
      </div>
    </button>
  )
}

export default UserDataReportDownloadButton
