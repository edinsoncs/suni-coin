import Modal from './Modal'
import { useWallet } from './WalletContext'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ConnectWalletModal({ open, onClose }: Props) {
  const { createWallet } = useWallet()

  async function handleAccept() {
    await createWallet()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Terms of Use</h2>
      <p className="mb-4 text-sm">
        By continuing you confirm that you accept the application's terms and
        conditions.
      </p>
      <button
        onClick={handleAccept}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Accept and Sign
      </button>
    </Modal>
  )
}
