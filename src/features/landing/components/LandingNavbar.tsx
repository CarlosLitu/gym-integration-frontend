import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { List } from '@phosphor-icons/react'
import logoIcon from '@/assets/images/navbar-logo-icon.svg'
import closeIcon from '@/assets/images/nav-close.svg'
import { useAuth } from '@/features/auth'
import { scrollToDemo } from '../utils/scroll-to-demo'
import { LandingContainer } from './LandingContainer'

const secondaryButtonClass =
  'inline-flex h-12 items-center justify-center rounded-xl bg-[rgba(247,249,252,0.12)] px-6 py-3 font-sans text-[14.5px] font-semibold leading-none text-pulse-surface backdrop-blur-[2px] transition-colors hover:bg-[rgba(247,249,252,0.18)]'

const primaryButtonClass =
  'inline-flex h-12 items-center justify-center rounded-[10px] bg-pulse-blue px-6 py-3 font-sans text-[14.5px] font-semibold leading-none text-pulse-surface transition-colors hover:bg-pulse-blue/90'

/** Itens do menu mobile — Figma #4491:1553 */
const mobileMenuItemClass =
  'flex h-10 w-full items-center justify-center font-sans text-[14.5px] font-semibold leading-none text-[#F7F9FC] transition-opacity hover:opacity-80'

export function LandingNavbar() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function handleDemoClick() {
    setMenuOpen(false)
    scrollToDemo()
  }

  return (
    <>
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-transparent lg:hidden"
          aria-label={t('landing.nav.closeMenu', { defaultValue: 'Fechar menu' })}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <header
        className={`absolute inset-x-0 top-0 z-50 ${
          menuOpen
            ? 'overflow-hidden rounded-b-[24px] bg-[rgba(18,23,32,0.9)] backdrop-blur-[5px] lg:overflow-visible lg:rounded-none lg:bg-[rgba(13,22,40,0.08)] lg:backdrop-blur-[7px]'
            : 'bg-[rgba(13,22,40,0.08)] backdrop-blur-[7px]'
        }`}
      >
        <LandingContainer className="flex items-center justify-between gap-3 py-5 lg:py-[21px]">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img src={logoIcon} alt="" className="h-[34px] w-[34px] shrink-0" aria-hidden="true" />
            <span className="font-heading text-xl font-bold leading-none tracking-[0.02em] text-white">
              PULS<span className="text-pulse-blue">E</span>
            </span>
          </Link>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className={secondaryButtonClass}
            >
              {t('landing.nav.enter')}
            </Link>

            <button type="button" className={primaryButtonClass} onClick={scrollToDemo}>
              {t('landing.nav.requestDemo')}
            </button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={
              menuOpen
                ? t('landing.nav.closeMenu', { defaultValue: 'Fechar menu' })
                : t('landing.nav.openMenu', { defaultValue: 'Abrir menu' })
            }
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <img src={closeIcon} alt="" className="h-4 w-4" aria-hidden="true" />
            ) : (
              <List className="h-[18px] w-[18px] text-[#F7F9FC]" weight="bold" aria-hidden="true" />
            )}
          </button>
        </LandingContainer>

        {menuOpen ? (
          <nav
            id="landing-mobile-menu"
            className="flex flex-col gap-4 px-6 py-3 lg:hidden"
            aria-label={t('landing.nav.menu', { defaultValue: 'Menu' })}
          >
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className={mobileMenuItemClass}
              onClick={() => setMenuOpen(false)}
            >
              {t('landing.nav.enter')}
            </Link>
            <button type="button" className={mobileMenuItemClass} onClick={handleDemoClick}>
              {t('landing.nav.requestDemo')}
            </button>
          </nav>
        ) : null}
      </header>
    </>
  )
}
