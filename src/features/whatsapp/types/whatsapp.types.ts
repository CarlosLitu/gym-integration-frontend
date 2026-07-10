export type WhatsappConnectionStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'QRCODE'
  | 'CONNECTED'
  | 'ERROR'

export interface WhatsappQrCodeData {
  tenantId: string
  instanceName: string
  status: WhatsappConnectionStatus
  connectionState: string
  isSynced: boolean
  qrCodeImageUrl: string | null
  qrCodeValue: string | null
  pairingCode: string | null
  webhookUrl: string
}
