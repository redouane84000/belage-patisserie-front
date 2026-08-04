import { Component } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Lock, LogOut, Play, Sparkles } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TrainingGate from './TrainingGate'
import { TRAINING_COURSES } from '../../data/trainingCourses'
import { clearTrainingProgress, getTrainingProgress } from '../../features/training/progress'
import { trainingApi } from '../../features/training/api'
import './TrainingPlatform.css'

class TrainingErrorBoundary extends Component {
  // Keeps rendering failures contained to the training area.
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

function Dashboard({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const progress = getTrainingProgress(user.username)

  async function logout() {
    try { await trainingApi.logout() } finally {
      clearTrainingProgress(user.username)
      navigate('/plateforme/connexion', { replace: true })
    }
  }

  return (
    <div className="training-app">
      <Navbar />
      <main className="training-dashboard">
        <header className="training-dashboard__header">
          <div>
            <p className="training-eyebrow">Votre espace personnel</p>
            <h1>Bienvenue {user.firstName} <span>👋</span></h1>
            <p>{user.firstName}, reprenez votre parcours à votre rythme.</p>
          </div>
          <button className="training-logout" onClick={logout}><LogOut size={16} /> Se déconnecter</button>
        </header>

        {location.state?.denied && <p className="training-error">Cette formation ne fait pas partie de votre accès.</p>}

        <section>
          <div className="training-section-heading">
            <div><p className="training-eyebrow">Vos formations</p><h2>Votre progression</h2></div>
            <span>{progress.completed.length} leçon{progress.completed.length > 1 ? 's' : ''} terminée{progress.completed.length > 1 ? 's' : ''}</span>
          </div>
          <div className="training-course-grid">
            {TRAINING_COURSES.map((course) => {
              const allowed = user.purchasedCourses.includes(course.id)
              const lessonCount = course.lessonCount
              const completed = progress.completed
                .filter((lessonId) => lessonId.startsWith(`${course.id}:`)).length
              return (
                <article key={course.id} className={`training-course-card ${allowed ? '' : 'is-locked'}`}>
                  <div className="training-course-card__art"><Sparkles size={22} /></div>
                  <p>{course.eyebrow}</p><h3>{course.title}</h3><span>{course.description}</span>
                  {allowed ? (
                    <>
                      <div className="training-progress"><i style={{ width: `${lessonCount ? (completed / lessonCount) * 100 : 0}%` }} /></div>
                      <small>{completed}/{lessonCount} leçons terminées</small>
                      <Link to={`/plateforme/${course.id}`} className="training-primary">Reprendre <Play size={15} /></Link>
                    </>
                  ) : (
                    <div className="training-locked"><Lock size={16} /> Formation non achetée</div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
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
