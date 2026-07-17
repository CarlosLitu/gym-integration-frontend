import { apiClient } from '@/services/api-client'
import type {
  PaymentOrderPayload,
  PaymentOrderResult,
  PaymentPlan,
  PaymentPlanCreatePayload,
  PaymentPlanUpdatePayload,
  PaymentTransactionListData,
} from '../types/payment.types'

export interface ListPaymentTransactionsParams {
  provider?: string
  status?: string
  userQuery?: string
  paymentPlanId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export async function createPaymentOrderRequest(payload: PaymentOrderPayload): Promise<PaymentOrderResult> {
  const { data } = await apiClient.post<{ data: PaymentOrderResult }>('/api/payments/order', payload)
  return data.data
}

export async function createPaymentPlanRequest(payload: PaymentPlanCreatePayload): Promise<PaymentPlan> {
  const { data } = await apiClient.post<{ data: PaymentPlan }>('/api/payments/plans', payload)
  return data.data
}

export async function updatePaymentPlanRequest(
  id: string,
  payload: PaymentPlanUpdatePayload,
): Promise<PaymentPlan> {
  const { data } = await apiClient.put<{ data: PaymentPlan }>(`/api/payments/plans/${id}`, payload)
  return data.data
}

export async function deletePaymentPlanRequest(id: string): Promise<PaymentPlan> {
  const { data } = await apiClient.delete<{ data: PaymentPlan }>(`/api/payments/plans/${id}`)
  return data.data
}

export async function getPaymentPlanRequest(id: string): Promise<PaymentPlan> {
  const { data } = await apiClient.get<{ data: PaymentPlan }>(`/api/payments/plans/${id}`)
  return data.data
}

export async function listPaymentPlansRequest(): Promise<PaymentPlan[]> {
  const { data } = await apiClient.get<{ data: PaymentPlan[] }>('/api/payments/plans')
  return data.data
}

export async function listUserPaymentPlansRequest(): Promise<PaymentPlan[]> {
  const { data } = await apiClient.get<{ data: PaymentPlan[] }>('/api/payments/plans/catalog')
  return data.data
}

export async function listPaymentTransactionsRequest(
  params: ListPaymentTransactionsParams,
): Promise<PaymentTransactionListData> {
  const { data } = await apiClient.get<{ data: PaymentTransactionListData }>('/api/payments/transactions', {
    params,
  })
  return data.data
}
