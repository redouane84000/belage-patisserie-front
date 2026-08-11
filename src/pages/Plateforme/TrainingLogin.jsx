import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, ArrowRight } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { trainingApi } from '../../features/training/api'
import './TrainingPlatform.css'

export default function TrainingLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await trainingApi.login(username, password)
      setAuthenticated(true)
    } catch (err) {
      setError(err.message || 'Identifiant ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  if (authenticated) return <Navigate to="/plateforme" replace />

  return (
    <div className="training-app">
      <Navbar />
      <main className="training-login">
        <section className="training-login__card">
          <span className="training-login__icon"><LockKeyhole size={22} /></span>
          <p className="training-eyebrow">Bel Âge Pâtisserie</p>
          <h1>Plateforme de formation</h1>
          <p>Votre espace est réservé aux clientes ayant acheté une formation Bel Âge.</p>
          <form onSubmit={submit}>
            <label htmlFor="training-username">Identifiant</label>
            <input id="training-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            <label htmlFor="training-password">Mot de passe</label>
            <div className="training-password">
              <input id="training-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
              <button type="button" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="training-error" role="alert">{error}</p>}
            <button className="training-primary" disabled={loading} type="submit">
              {loading ? 'Connexion…' : <>Se connecter <ArrowRight size={17} /></>}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}
