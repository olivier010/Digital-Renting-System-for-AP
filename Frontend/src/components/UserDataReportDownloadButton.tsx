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
      className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="text-left">
        <p className="font-medium text-gray-900 dark:text-white">Download My Data Report</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Export a copy of your account data</p>
      </div>
      <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
  )
}

export default UserDataReportDownloadButton
