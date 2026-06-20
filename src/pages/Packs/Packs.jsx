import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import PacksDesktop from './PacksDesktop'
import PacksMobile from './PacksMobile'
import './Packs.css'
import './PacksDesktop.css'

export default function Packs() {
  return (
    <div className="packs-page">
      <Navbar />

      <div className="pack-layout-desktop">
        <PacksDesktop />
      </div>

      <div className="pack-layout-mobile">
        <PacksMobile />
      </div>

      <Footer />
    </div>
  )
}
