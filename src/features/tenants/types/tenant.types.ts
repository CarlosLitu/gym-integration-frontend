export interface ApiTenant {
  _id: string
  name: string
  gateway?: string
  updatedAt?: string
}

export interface TenantListItem {
  id: string
  name: string
  gateway: string | null
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
  token: string
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
