import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import IconSprite, { Ico } from '../../components/refonte/IconSprite'
import SiteHeader from '../../components/refonte/SiteHeader'
import { trainingApi } from '../../features/training/api'
import { COURSE_ASSETS } from '../../content/courseAssets'

export default function TrainingLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const identifier = String(form.get('username') || username || '').trim()
    const secret = String(form.get('password') || password || '')
    setUsername(identifier)
    setPassword(secret)
    setLoading(true)
    setError('')
    try {
      const { user } = await trainingApi.login(identifier, secret)
      setAuthenticated(user.isAdmin ? 'admin' : 'client')
    } catch (err) {
      setError(err.message || 'Identifiant ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  if (authenticated) return <Navigate to={authenticated === 'admin' ? '/plateforme/admin' : '/plateforme'} replace />

  return (
    <div className="bl page-login">
      <IconSprite />
      <SiteHeader
        variant="bar"
        loginTo="/packs"
        loginLabel="Découvrir les formations"
        showUser={false}
      />
      <main className="lg-main">
        <section className="lg-art" aria-hidden="true">
          <figure>
            <img src="/training/products/wedding-cake.jpeg" alt="" width="1440" height="1920" />
          </figure>
          <p className="eyebrow">Votre espace</p>
          <h2>Plateforme<br />de formation</h2>
        </section>
        <div className="lg-form-wrap">
          <section className="lg-card" aria-labelledby="lg-title">
            <span className="ac-badge" aria-hidden="true"><Ico name="i-lock" /></span>
            <p className="eye">Bel Âge Pâtisserie</p>
            <h1 id="lg-title">Connexion à votre espace</h1>
            <p className="intro">Votre espace est réservé aux clientes ayant acheté une formation Bel Âge.</p>
            <p className="hint">Utilisez l’e-mail de votre commande, ou votre identifiant. Pas besoin du code belage-xxxxx si vous avez votre e-mail.</p>
            <form className="lg-form" onSubmit={submit}>
              <label htmlFor="training-username">Identifiant ou e-mail</label>
              <div className="lg-input">
                <input
                  id="training-username"
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                />
              </div>
              <label htmlFor="training-password">Mot de passe</label>
              <div className="lg-input">
                <input
                  id="training-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="eye-btn"
                  type="button"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Ico name="i-eye" />
                </button>
              </div>
              {error && <p className="lg-err is-visible" role="alert">{error}</p>}
              <button className="btn btn--bx" disabled={loading} type="submit">
                {loading ? 'Connexion…' : <>Se connecter <Ico name="i-arrow" className="arr" /></>}
              </button>
            </form>
            <p className="lg-help">Pas encore de formation ? <Link to="/packs">Voir les formations</Link></p>
          </section>
        </div>
      </main>
    </div>
  )
}
