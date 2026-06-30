import { useState } from 'react'
import { clsx } from 'clsx'
import { Modal } from '@/components'
import { useTenantModalView } from '../hooks/useTenantModalView'
import { useTenantWizard } from '../hooks/useTenantWizard'
import { useCreateTenant } from '../hooks/useCreateTenant'
import { tenantListItemToSelected, useSelectedTenant } from '../hooks/useSelectedTenant'
import type { TenantListItem as TenantListItemType } from '../types/tenant.types'
import { TenantListView } from './TenantListView'
import { TenantCreateForm } from './TenantCreateForm'

interface TenantSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TenantSwitcherModal({ isOpen, onClose }: TenantSwitcherModalProps) {
  const { view, showCreate, showList } = useTenantModalView()
  const { step, next, back, reset } = useTenantWizard()
  const {
    values,
    setField,
    reset: resetForm,
    isValid,
    isLoading,
    error,
    submit,
    canTest,
    isTesting,
    testStatus,
    testMessage,
    testConnection,
  } = useCreateTenant()
  const [reloadToken, setReloadToken] = useState(0)
  const { selectTenant, selectedTenantId } = useSelectedTenant()

  function handleClose() {
    showList()
    reset()
    resetForm()
    onClose()
  }

  function handleBack() {
    if (step === 1) {
      showList()
    } else {
      back()
    }
  }

  async function handleSubmit() {
    try {
      await submit()
      resetForm()
      reset()
      setReloadToken((current) => current + 1)
      showList()
    } catch {
      // Erro ja tratado e exibido pelo hook useCreateTenant.
    }
  }

  function handleTenantSelect(tenant: TenantListItemType) {
    if (tenant.id !== selectedTenantId) {
      selectTenant(tenantListItemToSelected(tenant))
    }
    handleClose()
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
          <TenantListView
            isOpen={isOpen}
            onNewTenant={showCreate}
            onTenantSelect={handleTenantSelect}
            reloadToken={reloadToken}
          />
        </div>
        <div
          className={clsx(
            'absolute inset-0 flex flex-col gap-4 transition-transform duration-300 ease-out',
            view === 'create' ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <TenantCreateForm
            step={step}
            onNext={next}
            onBack={handleBack}
            values={values}
            onChange={setField}
            isValid={isValid}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
            canTest={canTest}
            isTesting={isTesting}
            testStatus={testStatus}
            testMessage={testMessage}
            onTestConnection={testConnection}
          />
        </div>
      </div>
    </Modal>
  )
}
