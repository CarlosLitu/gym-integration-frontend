export type PaymentPlanType = 'ONE_TIME' | 'SUBSCRIPTION'

export interface PaymentPlan {
  id: string
  name?: string | null
  value: number
  currency: string
  durationDays: number
  maxBillingCycles: number | null
  totalDurationMonths: number | null
  permissions: string[] | null
  type: PaymentPlanType
  allowMultiplePurchases: boolean
  isActive: boolean
  paymentPlanIds: Record<string, string> | null
  paymentProductIds: Record<string, string> | null
  createdAt: string
  updatedAt: string
}

export interface PaymentPlanCreatePayload {
  name: string
  value: number
  currency: string
  type: PaymentPlanType
  durationDays?: number
  maxBillingCycles?: number | null
  permissions?: string[] | null
  allowMultiplePurchases?: boolean
}

export interface PaymentPlanUpdatePayload extends PaymentPlanCreatePayload {
  isActive?: boolean
}

export interface PaymentOrderPayload {
  planId: string
}

export interface PaymentOrderResult {
  idempotencyKey: string
  provider: PaymentProvider | string
  providerOrderId: string
  status: string
  approveUrl: string | null
  raw: unknown
}

export type PaymentProvider = 'paypal' | 'mock'

export type PaymentTransactionStatus = 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED'

export interface PaymentTransactionUser {
  id: string
  name: string
  email: string
  phone: string | null
}

export interface PaymentTransaction {
  id: string
  provider: PaymentProvider | string
  providerOrderId: string
  paymentPlanId: string | null
  paymentPlan: PaymentPlan | null
  userId: string | null
  user: PaymentTransactionUser | null
  amount: number
  currency: string
  purchasedAt: string
  accessStartsAt: string | null
  accessExpiresAt: string | null
  status: PaymentTransactionStatus | string
  webhookEventId: string | null
  providerResponse: unknown
  createdAt: string
  updatedAt: string
}

export interface PaymentTransactionListFilters {
  provider: string | null
  status: string | null
  userId: string | null
  userQuery: string | null
  paymentPlanId: string | null
  startDate: string | null
  endDate: string | null
}

export interface PaymentTransactionListPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaymentTransactionListData {
  items: PaymentTransaction[]
  pagination: PaymentTransactionListPagination
  filters: PaymentTransactionListFilters
}
