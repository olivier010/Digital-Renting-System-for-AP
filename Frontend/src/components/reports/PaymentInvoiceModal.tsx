import { X, Download } from 'lucide-react'
import { downloadPaymentInvoicePdf, type PaymentInvoiceData } from './paymentInvoicePdf'

interface PaymentInvoiceModalProps {
  payment: PaymentInvoiceData | null
  isOpen: boolean
  onClose: () => void
}

const formatAmount = (value?: number) => `$${Number(value || 0).toLocaleString()}`

const PaymentInvoiceModal = ({ payment, isOpen, onClose }: PaymentInvoiceModalProps) => {
  if (!isOpen || !payment) return null

  const invoiceId = payment.invoiceId || `INV-${payment.id}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Preview</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Invoice</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{invoiceId}</p>
            </div>
            <div className="bg-primary-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold">
              RW
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-gray-500 dark:text-gray-400">Description</p>
            <p className="font-medium text-gray-900 dark:text-white">{payment.description || 'N/A'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium text-gray-900 dark:text-white">{payment.status || 'N/A'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-gray-500 dark:text-gray-400">Property</p>
            <p className="font-medium text-gray-900 dark:text-white">{payment.property || 'N/A'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-gray-500 dark:text-gray-400">Date</p>
            <p className="font-medium text-gray-900 dark:text-white">{payment.date || 'N/A'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
            <p className="font-medium text-gray-900 dark:text-white">{payment.cardType || 'N/A'} •••• {payment.cardLast4 || 'N/A'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-3">
            <p className="text-gray-500 dark:text-gray-400">Amount</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatAmount(payment.amount)}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={() => downloadPaymentInvoicePdf(payment)}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentInvoiceModal
