import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { CalculatorProvider } from '../../features/calculateur/CalculatorContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import CalculatorMobile from '../../features/calculateur/mobile/CalculatorMobile'
import CalculatorDesktop from '../../features/calculateur/desktop/CalculatorDesktop'
import './CalculateurRentabilite.css'

/** Desktop ≥1024px — wizard mobile en dessous */
function CalculatorLayout() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  return isDesktop ? <CalculatorDesktop /> : <CalculatorMobile />
}

export default function CalculateurRentabilite() {
  return (
    <CalculatorProvider>
      <div className="calc-page">
        <Navbar />
        <CalculatorLayout />
        <Footer />
      </div>
    </CalculatorProvider>
  )
}
