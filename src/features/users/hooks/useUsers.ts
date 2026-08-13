import { useEffect, useState } from 'react'
import { useApiMessage } from '@/hooks/useApiMessage'
import { listUsersRequest } from '../api/list-users'
import type { UserListItem } from '../types/user.types'

export function useUsers(enabled: boolean, reloadToken = 0) {
  const { getErrorMessage } = useApiMessage()
  const [users, setUsers] = useState<UserListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let isMounted = true
    setIsLoading(true)
    setError(null)

    listUsersRequest()
      .then((data) => {
        if (isMounted) setUsers(data)
      })
      .catch((requestError) => {
        if (isMounted) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [enabled, reloadToken, getErrorMessage])

  return { users, isLoading, error }
}
