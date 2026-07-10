import { ArrowsClockwise, WhatsappLogo } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, StatusBadge } from '@/components'
import { useWhatsappQrCode } from '@/features/whatsapp/hooks/useWhatsappQrCode'
import type { WhatsappConnectionStatus } from '@/features/whatsapp/types/whatsapp.types'
import { ChartCard } from './ChartCard'

interface WhatsappQrCardProps {
  tenantId: string | null
}

function getStatusVariant(status: WhatsappConnectionStatus | undefined) {
  switch (status) {
    case 'CONNECTED':
      return 'connected'
    case 'CONNECTING':
    case 'QRCODE':
      return 'waiting'
    case 'ERROR':
      return 'invalid'
    case 'DISCONNECTED':
    default:
      return 'pending'
  }
}

function getStatusLabel(status: WhatsappConnectionStatus | undefined, t: (key: string) => string) {
  switch (status) {
    case 'CONNECTED':
      return t('dashboard.charts.whatsapp.status.CONNECTED')
    case 'CONNECTING':
      return t('dashboard.charts.whatsapp.status.CONNECTING')
    case 'QRCODE':
      return t('dashboard.charts.whatsapp.status.QRCODE')
    case 'ERROR':
      return t('dashboard.charts.whatsapp.status.ERROR')
    case 'DISCONNECTED':
    default:
      return t('dashboard.charts.whatsapp.status.DISCONNECTED')
  }
}

export function WhatsappQrCard({ tenantId }: WhatsappQrCardProps) {
  const { t } = useTranslation()
  const { data, isLoading, isRefreshing, error, refresh } = useWhatsappQrCode(tenantId)

  return (
    <ChartCard
      title={t('dashboard.charts.whatsapp.title')}
      subtitle={t('dashboard.charts.whatsapp.subtitle')}
      info={t('dashboard.charts.whatsapp.info')}
      isLoading={isLoading}
      error={error}
      isEmpty={!tenantId}
      emptyLabel={t('dashboard.charts.whatsapp.noTenantSelected')}
    >
      <div className="flex min-h-[18rem] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <StatusBadge
            status={getStatusVariant(data?.status)}
            icon={<WhatsappLogo className="h-4 w-4" weight="fill" />}
          >
            {getStatusLabel(data?.status, t)}
          </StatusBadge>

          <div className="space-y-1 text-sm text-pulse-muted">
            <p>
              <span className="font-semibold text-pulse-navy">
                  {t('dashboard.charts.whatsapp.instanceName')}:
              </span>{' '}
              {data?.instanceName ?? '-'}
            </p>
            <p>
              <span className="font-semibold text-pulse-navy">
                  {t('dashboard.charts.whatsapp.connectionState')}:
              </span>{' '}
              {data?.connectionState || '-'}
            </p>
            {data?.pairingCode ? (
              <p>
                <span className="font-semibold text-pulse-navy">
                  {t('dashboard.charts.whatsapp.pairingCode')}:
                </span>{' '}
                {data.pairingCode}
              </p>
            ) : null}
          </div>

          {data?.status === 'CONNECTED' ? (
            <p className="text-sm text-pulse-muted">{t('dashboard.charts.whatsapp.connectedHelp')}</p>
          ) : (
            <p className="text-sm text-pulse-muted">{t('dashboard.charts.whatsapp.qrHelp')}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void refresh()} disabled={!tenantId || isRefreshing}>
              <span className="inline-flex items-center gap-2">
                <ArrowsClockwise className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing
                  ? t('dashboard.charts.whatsapp.refreshing')
                  : t('dashboard.charts.whatsapp.refreshButton')}
              </span>
            </Button>
          </div>

          {!data?.qrCodeImageUrl && data?.status !== 'CONNECTED' ? (
            <Alert>{t('dashboard.charts.whatsapp.qrUnavailable')}</Alert>
          ) : null}
        </div>

        <div className="flex justify-center lg:min-w-[18rem]">
          {data?.qrCodeImageUrl ? (
            <div className="rounded-[12px] border border-pulse-border bg-white p-3 shadow-sm">
              <img
                src={data.qrCodeImageUrl}
                alt={t('dashboard.charts.whatsapp.qrAlt')}
                className="h-64 w-64 rounded-[8px] object-contain"
              />
            </div>
          ) : (
            <div className="flex h-64 w-64 items-center justify-center rounded-[12px] border border-dashed border-pulse-border bg-pulse-surface px-6 text-center text-sm text-pulse-muted">
              {data?.status === 'CONNECTED'
                ? t('dashboard.charts.whatsapp.connectedNoQr')
                : t('dashboard.charts.whatsapp.waitingQr')}
            </div>
          )}
        </div>
      </div>
    </ChartCard>
  )
}
