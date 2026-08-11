import { Component } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { HIDDEN_ROUTES } from './config/hiddenRoutes'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import MobileBelAgeFxShell from './components/MobileBelAgeFx/MobileBelAgeFxShell'
import Home from './pages/Home/Home'
import Carte from './pages/Carte/Carte'
import Patissieres from './pages/Patissieres/Patissieres'
import Inspirations from './pages/Inspirations/Inspirations'
import Packs from './pages/Packs/Packs'
import Rejoindre from './pages/Rejoindre/Rejoindre'
import CalculateurRentabilite from './pages/CalculateurRentabilite/CalculateurRentabilite'
import Mentions from './pages/Mentions/Mentions'
import Contact from './pages/Contact/Contact'
import TrainingLogin from './pages/Plateforme/TrainingLogin'
import TrainingDashboard from './pages/Plateforme/TrainingDashboard'
import TrainingCourse from './pages/Plateforme/TrainingCourse'

class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('Application render failed:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'sans-serif' }}>
          <div>
            <h1>Une erreur empêche l’affichage de la page.</h1>
            {import.meta.env.DEV && <pre>{this.state.error.message}</pre>}
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <AppErrorBoundary>
      <ScrollToTop />
      <MobileBelAgeFxShell />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/carte" element={<Carte />} />
      <Route path="/carte-france" element={<Carte />} />
      <Route path="/patissieres" element={<Patissieres />} />
      <Route
        path="/inspirations"
        element={HIDDEN_ROUTES.has('/inspirations') ? <Navigate to="/" replace /> : <Inspirations />}
      />
      <Route path="/packs" element={<Packs />} />
      <Route path="/rejoindre" element={<Rejoindre />} />
      <Route
        path="/calculateur-rentabilite"
        element={HIDDEN_ROUTES.has('/calculateur-rentabilite') ? <Navigate to="/" replace /> : <CalculateurRentabilite />}
      />
      <Route path="/mentions-legales" element={<Mentions />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/plateforme/connexion" element={<TrainingLogin />} />
      <Route path="/plateforme" element={<TrainingDashboard />} />
      <Route path="/plateforme/:courseId" element={<TrainingCourse />} />
      </Routes>
      <Analytics />
    </AppErrorBoundary>
  )
}

export default App
