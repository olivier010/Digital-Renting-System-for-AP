import { Download } from 'lucide-react'

interface UserDataReportDownloadButtonProps {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

const UserDataReportDownloadButton = ({
  onSuccess,
  onError,
}: UserDataReportDownloadButtonProps) => {
  const handleDownload = async () => {
    try {
      // Placeholder behavior until report export endpoint is wired.
      onSuccess?.('User data report request queued.')
    } catch {
      onError?.('Failed to generate user data report.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="w-full flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
    >
      <div className="text-left">
        <p className="font-medium text-surface-900 dark:text-white">Download My Data Report</p>
        <p className="text-sm text-surface-500 dark:text-surface-400">Export a copy of your account data</p>
      </div>
      <Download className="w-5 h-5 text-surface-600 dark:text-surface-300" />
    </button>
  )
}

export default UserDataReportDownloadButton


