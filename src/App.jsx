import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Home from './pages/Home/Home'
import Carte from './pages/Carte/Carte'
import Patissieres from './pages/Patissieres/Patissieres'
import Inspirations from './pages/Inspirations/Inspirations'
import Packs from './pages/Packs/Packs'
import Rejoindre from './pages/Rejoindre/Rejoindre'
import Mentions from './pages/Mentions/Mentions'
import Contact from './pages/Contact/Contact'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/carte" element={<Carte />} />
      <Route path="/carte-france" element={<Carte />} />
      <Route path="/patissieres" element={<Patissieres />} />
      <Route path="/inspirations" element={<Inspirations />} />
      <Route path="/packs" element={<Packs />} />
      <Route path="/rejoindre" element={<Rejoindre />} />
      <Route path="/mentions-legales" element={<Mentions />} />
      <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
