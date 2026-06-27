import { useEffect, useRef, useState } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Alert, Input } from '@/components'
import type { TestConnectionStatus } from '../../hooks/useCreateTenant'
import type { TenantFormValues } from '../../types/tenant.types'

interface TenantStepIntegrationProps {
  values: TenantFormValues
  onChange: (field: keyof TenantFormValues, value: string) => void
  testStatus: TestConnectionStatus
  testMessage: string | null
}

const GATEWAY_OPTIONS = [{ value: 'EVO', label: 'EVO' }]

export function TenantStepIntegration({
  values,
  onChange,
  testStatus,
  testMessage,
}: TenantStepIntegrationProps) {
  const { t } = useTranslation()
  const [isGatewayOpen, setIsGatewayOpen] = useState(false)
  const gatewayRef = useRef<HTMLDivElement>(null)

  const selectedGateway =
    GATEWAY_OPTIONS.find((option) => option.value === values.gateway) ?? GATEWAY_OPTIONS[0]

  useEffect(() => {
    if (!isGatewayOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (gatewayRef.current && !gatewayRef.current.contains(event.target as Node)) {
        setIsGatewayOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isGatewayOpen])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col gap-2">
        <label htmlFor="tenant-gateway" className="font-sans text-sm font-semibold text-pulse-navy">
          {t('tenants.create.fields.gateway')}
        </label>
        <div ref={gatewayRef} className="relative">
          <button
            id="tenant-gateway"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isGatewayOpen}
            onClick={() => setIsGatewayOpen((open) => !open)}
            className={clsx(
              'flex h-auto w-full items-center justify-between rounded-input border bg-pulse-surface py-3 pl-[14px] pr-[14px] font-sans text-sm text-pulse-navy outline-none transition-colors',
              isGatewayOpen
                ? 'border-pulse-blue ring-2 ring-pulse-blue/20'
                : 'border-pulse-border hover:border-pulse-blue/60',
            )}
          >
            <span>{selectedGateway.label}</span>
            <CaretDown
              size={16}
              weight="bold"
              aria-hidden="true"
              className={clsx(
                'text-pulse-muted transition-transform duration-200',
                isGatewayOpen && 'rotate-180',
              )}
            />
          </button>

          {isGatewayOpen ? (
            <ul
              role="listbox"
              className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-input border border-pulse-border bg-white py-1 shadow-card"
            >
              {GATEWAY_OPTIONS.map((option) => {
                const isSelected = option.value === values.gateway

                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange('gateway', option.value)
                        setIsGatewayOpen(false)
                      }}
                      className={clsx(
                        'flex w-full items-center justify-between px-[14px] py-2.5 text-left font-sans text-sm transition-colors',
                        isSelected
                          ? 'bg-pulse-blue/10 font-medium text-pulse-blue'
                          : 'text-pulse-navy hover:bg-pulse-blue/5',
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected ? <Check size={16} weight="bold" aria-hidden="true" /> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </div>
      <Input
        type="password"
        revealToggle
        revealLabel={t('tenants.create.reveal')}
        hideLabel={t('tenants.create.hide')}
        label={t('tenants.create.fields.apiKey')}
        placeholder={t('tenants.create.placeholders.apiKey')}
        value={values.apiKey}
        onChange={(event) => onChange('apiKey', event.target.value)}
      />
      <Input
        type="password"
        revealToggle
        revealLabel={t('tenants.create.reveal')}
        hideLabel={t('tenants.create.hide')}
        label={t('tenants.create.fields.apiSecret')}
        placeholder={t('tenants.create.placeholders.apiSecret')}
        value={values.apiSecret}
        onChange={(event) => onChange('apiSecret', event.target.value)}
      />
      {testStatus === 'error' && testMessage ? <Alert>{testMessage}</Alert> : null}
      <p className="font-sans text-xs leading-relaxed text-pulse-muted">
        {t('tenants.create.integrationNote')}
      </p>
    </div>
  )
}
