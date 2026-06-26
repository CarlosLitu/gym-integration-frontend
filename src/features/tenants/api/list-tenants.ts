import { apiClient } from '@/services/api-client'
import type { ApiTenant, TenantListItem } from '../types/tenant.types'

export async function listTenantsRequest(): Promise<TenantListItem[]> {
  const { data } = await apiClient.get<{ data: ApiTenant[] }>('/api/tenants')

  return data.data.map((tenant) => ({
    id: tenant._id,
    name: tenant.name,
    gateway: tenant.gateway ?? null,
    status: tenant.status ?? 'INTEGRATION_PENDING',
    sync: tenant.sync ?? 'OFF',
    updatedAt: tenant.updatedAt ?? null,
  }))
}
