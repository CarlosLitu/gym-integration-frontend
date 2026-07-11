import { useTranslation } from 'react-i18next'
import { Check, CheckCircle } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { Alert, Button, Input, Select } from '@/components'
import { useDemoForm } from '../hooks/useDemoForm'
import { LandingContainer } from './LandingContainer'

const BENEFIT_KEYS = ['noCard', 'dashboards', 'integrations', 'cashFlow'] as const

const STUDENT_RANGE_OPTIONS = [
  { value: 'up-to-100', labelKey: 'upTo100' },
  { value: '100-300', labelKey: '100to300' },
  { value: '300-1000', labelKey: '300to1000' },
  { value: '1000-plus', labelKey: '1000plus' },
] as const

const fieldLabelClass =
  'font-sans text-[14px] font-semibold leading-none text-[rgba(247,249,252,0.7)]'

const fieldInputClass =
  'h-[38px] rounded-lg border-[#DADDE2] bg-[#F7F9FC] px-[14px] py-3 text-[14px] placeholder:text-[#AFB8C0] focus:border-pulse-blue focus:ring-2 focus:ring-pulse-blue/20'

export function DemoFormSection() {
  const { t } = useTranslation()
  const {
    values,
    fieldErrors,
    formError,
    isLoading,
    isSuccess,
    canSubmit,
    handleChange,
    handleAcceptedTermsChange,
    handleSubmit,
  } = useDemoForm()

  return (
    <section id="demo" className="relative overflow-x-clip bg-[#F7F9FC]">
      {/* Fundo externo = seção acima; o azul fica só no bloco arredondado */}
      <div className="rounded-t-[24px] bg-[#142139] py-10 lg:rounded-t-[80px] lg:py-20">
      <LandingContainer className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-12">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-8 xl:max-w-[562px]">
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-[30px] bg-[rgba(0,194,168,0.04)] px-[15px] py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C2A8]" aria-hidden="true" />
              <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#00C2A8]">
                {t('landing.demo.badge')}
              </span>
            </div>

            <h2 className="font-heading text-[32px] font-bold leading-[40px] tracking-[-0.0106em] text-white lg:text-[40px] lg:leading-[40.8px] lg:tracking-[-0.0085em]">
              {t('landing.demo.title')}
            </h2>

            <p className="font-sans text-[16px] leading-6 text-[rgba(247,249,252,0.68)] lg:leading-[24.8px]">
              {t('landing.demo.description')}
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {BENEFIT_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-2">
                <CheckCircle
                  className="h-6 w-6 shrink-0 text-[#00C2A8]"
                  weight="regular"
                  aria-hidden="true"
                />
                <span className="font-sans text-[16px] leading-[24.8px] text-white">
                  {t(`landing.demo.benefits.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="flex w-full min-w-0 flex-1 flex-col gap-6 rounded-[22.5px] bg-[rgba(255,255,255,0.03)] p-8 backdrop-blur-[5px] xl:max-w-[628px]"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex w-full flex-col">
            <h3 className="font-heading text-[24px] font-medium leading-[40.8px] tracking-[-0.0142em] text-white">
              {t('landing.demo.formTitle')}
            </h3>
            <p className="font-sans text-[16px] leading-[24.8px] text-[rgba(247,249,252,0.68)]">
              {t('landing.demo.formSubtitle')}
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="demo-name" className={fieldLabelClass}>
                  {t('landing.demo.fields.name')}
                </label>
                <Input
                  id="demo-name"
                  name="name"
                  placeholder={t('landing.demo.placeholders.name')}
                  value={values.name}
                  error={fieldErrors.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className={fieldInputClass}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="demo-gym" className={fieldLabelClass}>
                  {t('landing.demo.fields.gymName')}
                </label>
                <Input
                  id="demo-gym"
                  name="gymName"
                  placeholder={t('landing.demo.placeholders.gymName')}
                  value={values.gymName}
                  error={fieldErrors.gymName}
                  onChange={(event) => handleChange('gymName', event.target.value)}
                  className={`${fieldInputClass} placeholder:italic`}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="demo-email" className={fieldLabelClass}>
                  {t('landing.demo.fields.email')}
                </label>
                <Input
                  id="demo-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t('landing.demo.placeholders.email')}
                  value={values.email}
                  error={fieldErrors.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className={fieldInputClass}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="demo-whatsapp" className={fieldLabelClass}>
                  {t('landing.demo.fields.whatsapp')}
                </label>
                <Input
                  id="demo-whatsapp"
                  type="tel"
                  name="whatsapp"
                  autoComplete="tel"
                  placeholder={t('landing.demo.placeholders.whatsapp')}
                  value={values.whatsapp}
                  error={fieldErrors.whatsapp}
                  onChange={(event) => handleChange('whatsapp', event.target.value)}
                  className={fieldInputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="students-range" className={fieldLabelClass}>
              {t('landing.demo.fields.studentsRange')}
            </label>
            <Select
              id="students-range"
              value={values.studentsRange}
              error={fieldErrors.studentsRange}
              placeholder={t('landing.demo.placeholders.studentsRange')}
              options={STUDENT_RANGE_OPTIONS.map((option) => ({
                value: option.value,
                label: t(`landing.demo.studentRanges.${option.labelKey}`),
              }))}
              onChange={(nextValue) => handleChange('studentsRange', nextValue)}
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="demo-terms"
              className="flex cursor-pointer items-start gap-3"
            >
              <span className="relative mt-0.5 inline-flex shrink-0">
                <input
                  id="demo-terms"
                  type="checkbox"
                  name="acceptedTerms"
                  checked={values.acceptedTerms}
                  onChange={(event) => handleAcceptedTermsChange(event.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={clsx(
                    'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                    values.acceptedTerms
                      ? 'border-[#00C2A8] bg-[#00C2A8]'
                      : 'border-[rgba(247,249,252,0.28)] bg-transparent',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-[#00C2A8]/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#142139]',
                  )}
                >
                  {values.acceptedTerms ? (
                    <Check className="h-3 w-3 text-[#142139]" weight="bold" />
                  ) : null}
                </span>
              </span>
              <span className="font-sans text-[13px] leading-5 text-[rgba(247,249,252,0.68)]">
                {t('landing.demo.termsLabel')}
              </span>
            </label>
            {fieldErrors.acceptedTerms ? (
              <p className="pl-7 font-sans text-xs text-red-400">{fieldErrors.acceptedTerms}</p>
            ) : null}
          </div>

          {isSuccess ? <Alert>{t('landing.demo.success')}</Alert> : null}
          {formError ? <Alert>{formError}</Alert> : null}

          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="h-12 w-full !rounded-[10px] bg-[#2D6CDF] font-sans text-[14.5px] font-semibold text-[#F7F9FC] hover:bg-[#2D6CDF]/90"
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? t('landing.demo.submitting') : t('landing.demo.submit')}
          </Button>

          <p className="text-left font-sans text-[12px] leading-[24.8px] text-[rgba(247,249,252,0.68)] lg:text-center">
            {t('landing.demo.footerNote')}
          </p>
        </form>
      </LandingContainer>
      </div>
    </section>
  )
}
