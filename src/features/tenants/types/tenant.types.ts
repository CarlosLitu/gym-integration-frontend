export type TenantStatus =
  | 'INTEGRATION_PENDING'
  | 'INVALID_CREDENTIALS'
  | 'WAITING_EVENTS'
  | 'CONNECTED'

export type TenantSyncStatus = 'OFF' | 'ON' | 'ERROR'

export interface ApiTenant {
  _id: string
  name: string
  gateway?: string
  status?: TenantStatus
  sync?: TenantSyncStatus
  lastEventReceived?: string
  updatedAt?: string
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
