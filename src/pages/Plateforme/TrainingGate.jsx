import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { trainingApi } from '../../features/training/api'

export default function TrainingGate({ children, requiredCourse }) {
  const [state, setState] = useState({ loading: true, user: null })

  useEffect(() => {
    let active = true
    trainingApi.session()
      .then((data) => active && setState({ loading: false, user: data.user }))
      .catch(() => active && setState({ loading: false, user: null }))
    return () => { active = false }
  }, [])

  if (state.loading) {
    return <main className="training-loading" aria-live="polite"><span /> Chargement sécurisé de votre espace…</main>
  }
  if (!state.user) return <Navigate to="/plateforme/connexion" replace />
  if (requiredCourse && !state.user.purchasedCourses.includes(requiredCourse)) {
    return <Navigate to="/plateforme" replace state={{ denied: true }} />
  }
  return children(state.user)
}
