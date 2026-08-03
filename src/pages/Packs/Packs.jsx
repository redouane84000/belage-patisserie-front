import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import PacksSingle from './PacksSingle'
import './Packs.css'

export default function Packs() {
  return (
    <div className="packs-page">
      <Navbar />

      <PacksSingle />

      <Footer />
    </div>
  )
}
