import { LandingNavbar } from '../components/LandingNavbar'
import { HeroSection } from '../components/HeroSection'
import { LogoCarousel } from '../components/LogoCarousel'
import { ProductSection } from '../components/ProductSection'
import { PotencializeSection } from '../components/PotencializeSection'
import { DemoFormSection } from '../components/DemoFormSection'
import { LandingFooter } from '../components/LandingFooter'

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <LogoCarousel />
        <ProductSection />
        <PotencializeSection />
        <DemoFormSection />
      </main>
      <LandingFooter />
    </div>
  )
}
