import { useState } from 'react'

export type TenantModalView = 'list' | 'create'

export function useTenantModalView() {
  const [view, setView] = useState<TenantModalView>('list')

  return {
    view,
    showCreate: () => setView('create'),
    showList: () => setView('list'),
  }
}
