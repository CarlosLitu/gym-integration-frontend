import { useState } from 'react'
import { CircleNotch } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal } from '@/components'
import { useApiMessage } from '@/hooks/useApiMessage'
import { deleteUserRequest } from '../api/delete-user'
import type { UserListItem } from '../types/user.types'

interface UserDeactivateModalProps {
  isOpen: boolean
  user: UserListItem | null
  onClose: () => void
  onSuccess: () => void
}

export function UserDeactivateModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: UserDeactivateModalProps) {
  const { t } = useTranslation()
  const { getErrorMessage } = useApiMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDeactivate() {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      await deleteUserRequest(user.id)
      onSuccess()
      onClose()
    } catch (deactivateError) {
      setError(getErrorMessage(deactivateError))
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    if (isLoading) return
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} dimOverlay className="max-w-md rounded-[24px] p-6">
      <div className="flex flex-col gap-4">
        <h2 className="pr-10 font-sans text-2xl font-semibold text-pulse-navy">
          {t('users.deactivate.title')}
        </h2>

        {user ? (
          <p className="font-sans text-sm text-pulse-muted">
            {t('users.deactivate.confirm', { name: user.name })}
          </p>
        ) : null}

        {error ? <Alert>{error}</Alert> : null}

        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="rounded-pill border-slate-200 bg-white hover:bg-pulse-surface"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t('users.form.cancel')}
          </Button>
          <Button
            type="button"
            variant="brand"
            size="md"
            onClick={handleDeactivate}
            disabled={!user || isLoading}
            className="gap-2 !bg-[#C51A31] hover:!bg-[#a81629]"
          >
            {isLoading ? (
              <>
                <CircleNotch className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
                {t('users.deactivate.deactivating')}
              </>
            ) : (
              t('users.deactivate.action')
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
