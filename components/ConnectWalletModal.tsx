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
      <h2 className="text-xl font-semibold mb-4">Términos de Uso</h2>
      <p className="mb-4 text-sm">
        Al continuar confirma que acepta los términos y condiciones del uso de la
        aplicación.
      </p>
      <button
        onClick={handleAccept}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Aceptar y Firmar
      </button>
    </Modal>
  )
}
