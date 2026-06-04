import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import FeaturesStrip from '../../components/FeaturesStrip/FeaturesStrip'
import PartnerMarquee from '../../components/PartnerMarquee/PartnerMarquee'
import Footer from '../../components/Footer/Footer'
import { useHomeMobileMotion } from './useHomeMobileMotion'
import './Home.css'

export default function Home() {
  useHomeMobileMotion()

  return (
    <div className="home">
      <div className="home-m-progress" aria-hidden="true">
        <div className="home-m-progress__bar" />
      </div>

      <Navbar />
      <Hero />
      <FeaturesStrip />
      <PartnerMarquee />

      <section className="home-m-cta" aria-label="Commencer">
        <div className="home-m-cta__inner" data-home-reveal>
          <h2 className="home-m-cta__title">Prêt à imaginer votre gâteau&nbsp;?</h2>
          <p className="home-m-cta__text">
            Trouvez la créatrice idéale en quelques clics.
          </p>
          <Link to="/patissieres" className="home-m-cta__btn">
            Commencer <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
