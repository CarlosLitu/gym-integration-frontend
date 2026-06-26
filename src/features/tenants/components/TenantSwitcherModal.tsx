import { clsx } from 'clsx'
import { Modal } from '@/components'
import { useTenantModalView } from '../hooks/useTenantModalView'
import { useTenantWizard } from '../hooks/useTenantWizard'
import { TenantListView } from './TenantListView'
import { TenantCreateForm } from './TenantCreateForm'

interface TenantSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TenantSwitcherModal({ isOpen, onClose }: TenantSwitcherModalProps) {
  const { view, showCreate, showList } = useTenantModalView()
  const { step, next, back, reset } = useTenantWizard()

  function handleClose() {
    showList()
    reset()
    onClose()
  }

  function handleBack() {
    if (step === 1) {
      showList()
    } else {
      back()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="h-[786px] max-h-[90vh] w-[868px] max-w-[95vw] rounded-[24px] p-6"
    >
      <div className="relative flex-1 overflow-hidden">
        <div
          className={clsx(
            'absolute inset-0 flex flex-col gap-4 transition-transform duration-300 ease-out',
            view === 'list' ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <TenantListView isOpen={isOpen} onNewTenant={showCreate} />
        </div>
        <div
          className={clsx(
            'absolute inset-0 flex flex-col gap-4 transition-transform duration-300 ease-out',
            view === 'create' ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <TenantCreateForm step={step} onNext={next} onBack={handleBack} />
        </div>
      </div>
    </Modal>
  )
}
