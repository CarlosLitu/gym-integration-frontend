import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import footerMark from '@/assets/images/pulse-footer-mark.svg'
import { scrollToDemo, scrollToSection, scrollToTop } from '../utils/scroll-to-demo'
import { LandingContainer } from './LandingContainer'

const linkClass =
  'font-sans text-sm font-medium text-[#F7F9FC] transition-opacity hover:opacity-80'
const mutedClass = 'font-sans text-sm text-[rgba(247,249,252,0.6)]'
const columnTitleClass = 'font-sans text-sm text-[rgba(247,249,252,0.6)]'

export function LandingFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="overflow-x-clip bg-[#0D1628] py-10">
      <LandingContainer className="flex flex-col gap-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[588px] flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <img src={footerMark} alt="" aria-hidden="true" className="h-[34px] w-[34px]" />
              <span className="font-heading text-xl font-bold tracking-[0.02em] text-white">
                PULS<span className="text-pulse-blue">E</span>
              </span>
            </div>
            <p className={mutedClass}>{t('landing.footer.tagline')}</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 lg:gap-20">
            <div className="flex flex-col gap-3">
              <p className={columnTitleClass}>{t('landing.footer.usefulLinks')}</p>
              <button type="button" className={`${linkClass} text-left`} onClick={scrollToTop}>
                {t('landing.footer.home')}
              </button>
              <button
                type="button"
                className={`${linkClass} text-left`}
                onClick={() => scrollToSection('product')}
              >
                {t('landing.footer.product')}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <p className={columnTitleClass}>{t('landing.footer.navigation')}</p>
              <Link to="/login" className={linkClass}>
                {t('landing.footer.login')}
              </Link>
              <button type="button" className={`${linkClass} text-left`} onClick={scrollToDemo}>
                {t('landing.footer.requestDemo')}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <p className={columnTitleClass}>{t('landing.footer.contact')}</p>
              <a href={`mailto:${t('landing.footer.email')}`} className={linkClass}>
                {t('landing.footer.email')}
              </a>
              <p className={linkClass}>{t('landing.footer.cnpj')}</p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[rgba(247,249,252,0.1)]" aria-hidden="true" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className={mutedClass}>{t('landing.footer.copyright', { year })}</p>
          <div className="flex items-center gap-3">
            <a href="#" className={linkClass} onClick={(event) => event.preventDefault()}>
              {t('landing.footer.terms')}
            </a>
            <span className={linkClass} aria-hidden="true">
              •
            </span>
            <a href="#" className={linkClass} onClick={(event) => event.preventDefault()}>
              {t('landing.footer.privacy')}
            </a>
          </div>
        </div>
      </LandingContainer>
    </footer>
  )
}
