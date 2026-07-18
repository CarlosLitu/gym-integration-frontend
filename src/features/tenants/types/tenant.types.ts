export type TenantStatus =
  | 'INTEGRATION_PENDING'
  | 'INVALID_CREDENTIALS'
  | 'WAITING_EVENTS'
  | 'CONNECTED'

export type TenantSyncStatus = 'OFF' | 'ON' | 'ERROR'

export interface TenantPaymentCurrentPlan {
  id: string | null
  name: string | null
  type: 'ONE_TIME' | 'SUBSCRIPTION' | null
  value: number | null
  currency: string | null
  durationDays: number | null
  totalDurationMonths: number | null
}

export interface TenantPaymentSummary {
  status: string
  provider: string | null
  providerSubscriptionId: string | null
  cancelAtPeriodEnd: boolean
  cancelledAt: string | null
  currentPlan: TenantPaymentCurrentPlan | null
  currentTransactionId: string | null
  startsAt: string | null
  expiresAt: string | null
  lastPaymentAt: string | null
  permissionsSnapshot: string[]
  updatedAt: string | null
}

export interface ApiTenant {
  _id: string
  name: string
  gateway?: string
  status?: TenantStatus
  sync?: TenantSyncStatus
  lastEventReceived?: string
  updatedAt?: string
  payment?: TenantPaymentSummary | null
}

export interface TenantListItem {
  id: string
  name: string
  gateway: string | null
  status: TenantStatus
  sync: TenantSyncStatus
  lastEventReceived: string | null
  updatedAt: string | null
}

export interface SelectedTenant {
  id: string
  name: string
  status: TenantStatus
  lastEventReceived: string | null
}

export interface TenantFormValues {
  name: string
  cnpj: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  gateway: string
  apiKey: string
  apiSecret: string
}

export interface CreateTenantPayload {
  name: string
  apiKey: string
  apiSecret: string
  gateway: string
  childTenantIds?: string[]
}

export interface SyncValidateResponse {
  status: boolean
  gateway?: string
  gatewayUrl?: string
  responseStatus?: number
}
