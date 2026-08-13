import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookmarkSimple,
  Buildings,
  ChartBar,
  Funnel,
} from '@phosphor-icons/react'
import patternsImage from '@/assets/images/Patterns.svg'
import productCardBg from '@/assets/images/product-card-bg.jpg'
import { LandingContainer } from './LandingContainer'

const FEATURE_ICONS = [Buildings, Funnel, BookmarkSimple, ChartBar] as const

const FEATURE_KEYS = ['billing', 'collection', 'retention', 'payments'] as const

const STAT_KEYS = ['spreadsheets', 'cashFlow', 'billing'] as const

const PRODUCT_GRADIENT =
  'linear-gradient(270deg, rgba(193, 193, 192, 0.05) 20%, rgba(29, 27, 29, 0.4) 51%, rgba(32, 30, 33, 1) 100%)'

const PATTERN_CLASS =
  'pointer-events-none absolute z-[2] h-auto w-[69%] opacity-30 lg:w-[283.5px]'

export function ProductSection() {
  const { t, i18n } = useTranslation()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <section id="product" className="overflow-x-clip bg-[#F7F9FC]">
      <LandingContainer className="flex flex-col gap-14 py-12 lg:gap-14 lg:py-[100px]">
        <div className="flex w-full max-w-[737px] flex-col gap-3">
          <p className="font-sans text-[12px] font-bold uppercase tracking-[0.0867em] text-[#2D6CDF]">
            {t('landing.product.overline')}
          </p>

          <div className="flex flex-col gap-3">
            <h2 className="max-w-[647px] font-heading text-[32px] font-bold leading-[40px] tracking-[-0.0119em] text-[#142139] lg:text-[40px] lg:leading-[44.84px] lg:tracking-[-0.0095em]">
              {t('landing.product.title')}
            </h2>
            <p className="max-w-[633px] font-sans text-[16px] leading-6 text-[#5C667A] lg:leading-[26.4px]">
              {t('landing.product.description')}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="relative mx-auto h-[444.4px] w-full max-w-none shrink-0 overflow-hidden rounded-2xl bg-[#201E21] lg:max-w-[411px]">
            <img
              src={productCardBg}
              alt=""
              aria-hidden="true"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              className="absolute left-0 top-0 z-[1] h-full w-[59%] max-w-[243px] backdrop-blur-[2px] lg:w-[243px]"
              style={{ background: PRODUCT_GRADIENT }}
              aria-hidden="true"
            />

            <img
              src={patternsImage}
              alt=""
              aria-hidden="true"
              className={`${PATTERN_CLASS} -left-[30px] top-[68%] lg:top-[300px]`}
            />
            <img
              src={patternsImage}
              alt=""
              aria-hidden="true"
              className={`${PATTERN_CLASS} left-[59%] top-[68%] lg:left-[243px] lg:top-[300px]`}
            />

            <div className="absolute left-6 top-10 z-10 flex w-[183px] flex-col gap-6 lg:left-10 lg:top-14">
              {STAT_KEYS.map((key, index) => {
                const value = t(`landing.product.stats.${key}.value`)
                const valueSuffix = i18n.exists(`landing.product.stats.${key}.valueSuffix`)
                  ? t(`landing.product.stats.${key}.valueSuffix`)
                  : null

                return (
                  <div key={key} className="contents">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-heading text-[40px] font-bold leading-[31.2px] text-white">
                        {valueSuffix ? (
                          <>
                            <span className="text-[#00C2A8]">{value}</span>{' '}
                            <span>{valueSuffix}</span>
                          </>
                        ) : (
                          value
                        )}
                      </span>
                      <span className="font-sans text-[16px] leading-normal text-[#F7F9FC]">
                        {t(`landing.product.stats.${key}.label`)}
                      </span>
                    </div>

                    {index < STAT_KEYS.length - 1 && (
                      <hr className="w-[182px] border-0 border-t border-[rgba(247,249,252,0.5)]" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:gap-4">
            {[0, 2].map((rowStart) => (
              <div key={rowStart} className="flex flex-col gap-3 lg:flex-row">
                {FEATURE_KEYS.slice(rowStart, rowStart + 2).map((key, index) => {
                  const Icon = FEATURE_ICONS[rowStart + index]

                  return (
                    <article
                      key={key}
                      className="flex min-w-0 flex-1 flex-col gap-[15px] rounded-2xl bg-white p-6 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[rgba(221,224,230,0.25)] text-[#142139]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <h3 className="font-heading text-[18px] font-bold leading-[23.2px] tracking-[-0.01em] text-[#142139]">
                          {t(`landing.product.features.${key}.title`)}
                        </h3>
                        <p className="font-sans text-[14.5px] leading-[23.2px] text-[#5C667A]">
                          {t(`landing.product.features.${key}.description`)}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </LandingContainer>
    </section>
  )
}
