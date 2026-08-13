import { apiClient } from '@/services/api-client'
import type { ApiTenant, CreateTenantPayload } from '../types/tenant.types'

export async function createTenantRequest(payload: CreateTenantPayload): Promise<ApiTenant> {
  const { data } = await apiClient.post<{ data: ApiTenant }>('/api/tenants', payload)

  return data.data
}
