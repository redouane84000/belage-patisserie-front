import { Component, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import IconSprite, { Ico } from '../../components/refonte/IconSprite'
import MobileTabBar from '../../components/refonte/MobileTabBar'
import TrainingGate from './TrainingGate'
import { TRAINING_COURSES } from '../../data/trainingCourses'
import { clearTrainingProgress, getTrainingProgress } from '../../features/training/progress'
import { trainingApi } from '../../features/training/api'
import { COURSE_ASSETS } from '../../content/courseAssets'
import { courseMeta } from '../../content/courseMeta'

class TrainingErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('Training dashboard render failed:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="training-loading">
          <strong>Impossible d’afficher votre espace de formation.</strong>
          {import.meta.env.DEV && <small>{this.state.error.message}</small>}
        </main>
      )
    }
    return this.props.children
  }
}

function progressFor(course, progress) {
  const meta = courseMeta(course.id)
  const lessonCount = meta?.chapterCount || course.lessonCount
  const completed = progress.completed.filter((lessonId) => lessonId.startsWith(`${course.id}:`)).length
  const percent = lessonCount ? Math.round((completed / lessonCount) * 100) : 0
  const unit = completed > 1 ? meta?.chapterUnit : meta?.chapterUnitOne
  return { lessonCount, completed, percent, line: `${completed} ${unit} sur ${lessonCount} terminé${completed > 1 ? 's' : ''}` }
}

function Dashboard({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const progress = getTrainingProgress(user.username)
  const [tab, setTab] = useState('cours')

  async function logout() {
    try { await trainingApi.logout() } finally {
      clearTrainingProgress(user.username)
      navigate('/plateforme/connexion', { replace: true })
    }
  }

  const firstName = user.firstName || 'élève'

  return (
    <div className="bl page-app">
      <IconSprite />
      <header className="hdr hdr--bar only-m">
        <Link className="logo" to="/" aria-label="BEL'ÂGE Pâtisserie — accueil" />
        <div className="hdr-r">
          <button className="btn btn--login" type="button" onClick={logout} style={{ height: 44, padding: '0 16px', fontSize: 13 }}>
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="ac-shell">
        <aside className="ac-side" aria-label="Espace personnel">
          <Link className="logo" to="/" aria-label="BEL'ÂGE Pâtisserie — accueil" />
          <nav className="ac-nav" aria-label="Menu de l’espace">
            <Link className="ac-pill" to="/plateforme" aria-current="page"><Ico name="i-dash" />Tableau de bord</Link>
            <div className="ac-group">
              <Link className="is-active" to="/plateforme"><Ico name="i-courses" />Mes formations</Link>
              <Link to="/contact"><Ico name="i-help" />Aide &amp; contact</Link>
            </div>
          </nav>
          <figure className="ac-side-photo" aria-hidden="true">
            <img src={COURSE_ASSETS.decor.side} alt="" width="476" height="304" />
          </figure>
        </aside>

        <main className="ac-main">
          <div className="ac-top">
            <nav className="nav" aria-label="Navigation principale">
              <Link to="/packs">Nos formations</Link>
              <Link className="is-active" to="/plateforme">Plateforme de formation</Link>
            </nav>
            <div className="hdr-r">
              <Link className="circle-btn" to="/plateforme" aria-label="Mon espace"><Ico name="i-user" /></Link>
              <button className="btn btn--bx" type="button" onClick={logout} style={{ height: 52 }}>
                Se déconnecter <Ico name="i-logout" className="arr" />
              </button>
            </div>
          </div>

          <section className="ac-content" aria-labelledby="ac-title">
            <h1 className="ac-h1" id="ac-title">Mes formations</h1>
            <p className="ac-sub">Bonjour {firstName}, retrouvez vos formations et continuez votre apprentissage.</p>
            {location.state?.denied && <p className="lg-err is-visible" role="alert">Cette formation ne fait pas partie de votre accès.</p>}
            <div className="ac-cards">
              {TRAINING_COURSES.map((course) => {
                const allowed = user.isAdmin || user.purchasedCourses.includes(course.id)
                const stats = progressFor(course, progress)
                const assets = COURSE_ASSETS[course.id]
                return (
                  <article key={course.id} className={`ac-card ${allowed ? '' : 'is-locked'}`} data-course={course.id}>
                    <figure className="ph">
                      <img src={assets.cardDesktop} alt={assets.alt} width="721" height="879" decoding="async" />
                    </figure>
                    <div className="ac-card-body">
                      <h3>{course.title}</h3>
                      {allowed ? (
                        <>
                          <p className="ac-line">{stats.line}</p>
                          <p className="ac-pct">{stats.percent} % terminé</p>
                          <div className="ac-bar" aria-hidden="true"><i style={{ width: `${stats.percent}%` }} /></div>
                          <Link className="btn btn--bx" to={`/plateforme/${course.id}`}>
                            {stats.completed ? 'Continuer' : 'Commencer'} <Ico name="i-arrow" className="arr" />
                          </Link>
                        </>
                      ) : (
                        <div className="ac-lock"><Ico name="i-lock" />Formation non achetée</div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="only-m" aria-labelledby="ac-welcome">
            <div className="ac-welcome">
              <span className="ac-badge" aria-hidden="true"><Ico name="i-cap" /></span>
              <h1 id="ac-welcome">Bienvenue {firstName}</h1>
              <h2>sur votre espace formation</h2>
              <p>Accédez à vos cours, progressez à votre rythme et retrouvez vos supports.</p>
            </div>
            <div className="ac-tabs" role="tablist">
              <button role="tab" type="button" aria-selected={tab === 'cours'} onClick={() => setTab('cours')}>Mes formations</button>
              <button role="tab" type="button" aria-selected={tab === 'achats'} onClick={() => setTab('achats')}>Mes achats</button>
            </div>
            <div className="ac-list" hidden={tab !== 'cours'} role="tabpanel">
              {TRAINING_COURSES.map((course) => {
                const allowed = user.isAdmin || user.purchasedCourses.includes(course.id)
                const stats = progressFor(course, progress)
                const assets = COURSE_ASSETS[course.id]
                if (!allowed) {
                  return (
                    <article className="ac-row" key={course.id}>
                      <figure className="ph"><img src={assets.cardDesktop} alt={assets.alt} width="721" height="879" decoding="async" /></figure>
                      <div>
                        <h3>{course.title}</h3>
                        <p>Formation non achetée</p>
                      </div>
                    </article>
                  )
                }
                return (
                  <article className="ac-row" key={course.id}>
                    <figure className="ph"><img src={assets.cardDesktop} alt={assets.alt} width="721" height="879" decoding="async" /></figure>
                    <div>
                      <h3>{course.title}</h3>
                      <p>{stats.completed} {stats.completed > 1 ? courseMeta(course.id)?.chapterUnit : courseMeta(course.id)?.chapterUnitOne} sur {stats.lessonCount} · {stats.percent} %</p>
                      <div className="ac-bar" aria-hidden="true"><i style={{ width: `${stats.percent}%` }} /></div>
                      <Link className="btn btn--bx" to={`/plateforme/${course.id}`}>
                        {stats.completed ? 'Reprendre' : 'Commencer'} <Ico name="i-arrow" className="arr" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="ac-purchases" hidden={tab !== 'achats'} role="tabpanel">
              {(user.isAdmin ? TRAINING_COURSES.map((course) => course.id) : user.purchasedCourses).map((id) => {
                const meta = courseMeta(id)
                if (!meta) return null
                return (
                  <div className="ac-purchase" key={id}>
                    <strong>{meta.title}</strong>
                    Formation en ligne
                    <div className="row2"><span>{meta.priceLabel}</span><span className="paid">Accès actif</span></div>
                  </div>
                )
              })}
            </div>
          </section>
        </main>
      </div>
      <MobileTabBar active="compte" />
    </div>
  )
}

export default function TrainingDashboard() {
  return (
    <TrainingErrorBoundary>
      <TrainingGate>{(user) => <Dashboard user={user} />}</TrainingGate>
    </TrainingErrorBoundary>
  )
}
