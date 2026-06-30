export type SalesGranularity = 'day' | 'week' | 'month'

export interface SalesTenantInfo {
  id: string
  name: string
  gateway: string
}

export type SalesBucketId = string | { year: number; week: number }

export interface SalesBucket {
  _id: SalesBucketId
  salesCount: number
  totalValue: number
  totalPaid: number
  totalPending: number
  itemsCount: number
  averageTicket: number
  firstSaleDate: string | null
  lastSaleDate: string | null
}

export interface SalesSummaryResponse {
  message: string
  tenant: SalesTenantInfo
  period?: { startDate: string; endDate: string }
  data: SalesBucket[]
}

export interface RawSaleItem {
  item?: string | null
  description?: string | null
  saleValue?: number | null
  itemValue?: number | null
  quantity?: number | null
}

export interface RawReceivable {
  ammount?: number | null
  ammountPaid?: number | null
  paymentType?: { id?: number | null; name?: string | null } | null
}

export interface RawSalePayload {
  registrationKind?: string | null
  nameEmployeeSale?: string | null
  saleItens?: RawSaleItem[] | null
  receivables?: RawReceivable[] | null
}

export interface RawSale {
  _id: string
  saleDate: string | null
  saleValueTotal: number
  amountPaidTotal: number
  amountPendingTotal: number
  discountTotal: number
  itemValueTotal: number
  payload: RawSalePayload
}

export interface SalesListResponse {
  message: string
  tenant: SalesTenantInfo
  data: RawSale[]
}
