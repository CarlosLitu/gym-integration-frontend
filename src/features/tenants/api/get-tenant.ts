import { apiClient } from '@/services/api-client'
import type { ApiTenant } from '../types/tenant.types'

export async function getTenantRequest(id: string): Promise<ApiTenant> {
  const { data } = await apiClient.get<{ data: ApiTenant }>(`/api/tenants/${id}`)

  return data.data
}
