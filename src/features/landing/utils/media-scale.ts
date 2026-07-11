/**
 * Escala fluida das mídias da landing (mobile-first → teto desktop).
 * Piso ≈ Figma iPhone 393; teto ≈ composição desktop já validada.
 *
 * Uso: classes Tailwind arbitrary `clamp(MIN, PREFERRED, MAX)`.
 */
export const landingMedia = {
  /**
   * Dashboard - Hero:
   * mobile 472px → tablet ~640px compacto → desktop 1240px.
   */
  heroDashboardWidth:
    'w-[min(29.5rem,90vw)] md:w-[min(40rem,78%)] lg:w-[min(77.5rem,96%)]',

  /** Laptop Potencialize: 345px → 978px */
  laptopWidth: 'w-[clamp(21.5625rem,48vw+8rem,61.125rem)]',

  /** Círculo de órbita: 396px → 1204px */
  orbitWidth: 'w-[clamp(24.75rem,62vw+5rem,75.25rem)]',

  /** Logos na órbita: 40px → 64px */
  orbitLogoSize: 'h-[clamp(2.5rem,3.2vw+1rem,4rem)] w-[clamp(2.5rem,3.2vw+1rem,4rem)]',

  /** Patterns.svg: 192px → 441px */
  patternsWidth: 'w-[clamp(12rem,20vw+5rem,27.5625rem)]',

  /** Empurrão horizontal do pattern: -109px → -24px */
  patternsLeft: 'left-[clamp(-6.8125rem,-12vw,-1.5rem)]',
} as const
