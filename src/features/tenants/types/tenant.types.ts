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
