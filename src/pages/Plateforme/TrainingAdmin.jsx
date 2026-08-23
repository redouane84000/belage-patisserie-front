import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ShieldCheck, Users } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TrainingGate from './TrainingGate'
import { trainingApi } from '../../features/training/api'
import './TrainingPlatform.css'

function Admin({ user }) {
  const [state, setState] = useState({ loading: true, users: [], error: '' })
  useEffect(() => {
    trainingApi.adminUsers().then(({ users }) => setState({ loading: false, users, error: '' })).catch((error) => setState({ loading: false, users: [], error: error.message }))
  }, [])
  if (state.loading) return <main className="training-loading"><span /> Chargement de l’administration…</main>
  return <div className="training-app"><Navbar /><main className="training-dashboard training-admin"><header className="training-dashboard__header"><div><p className="training-eyebrow">Administration</p><h1>Bonjour {user.firstName} <span>🛡️</span></h1><p>Suivi des accès à la plateforme de formation.</p></div></header><section className="training-admin__summary"><article><Users size={20} /><strong>{state.users.length}</strong><span>clientes enregistrées</span></article><article><ShieldCheck size={20} /><strong>{state.users.filter((item) => item.isActive).length}</strong><span>comptes actifs</span></article></section>{state.error ? <p className="training-error">{state.error}</p> : <section className="training-admin__panel"><div><p className="training-eyebrow">Utilisatrices</p><h2>Accès aux formations</h2></div><div className="training-admin__table">{state.users.map((item) => <article key={item.id}><div><strong>{item.firstName}</strong><span>@{item.username}</span></div><div>{item.purchasedCourses.length ? item.purchasedCourses.map((course) => <small key={course}>{course}</small>) : <span>Pas de formation</span>}</div><span className={item.isActive ? 'is-active' : 'is-disabled'}>{item.isActive ? 'Actif' : 'Désactivé'}</span></article>)}</div><p className="training-admin__note">Les mots de passe ne sont jamais affichés. Pour une cliente qui a perdu le sien, générez un nouveau mot de passe temporaire avec l’outil d’administration local.</p></section>}<Link className="training-primary" to="/plateforme">Voir l’espace cliente</Link></main><Footer /></div>
}

export default function TrainingAdmin() {
  return <TrainingGate>{(user) => user.isAdmin ? <Admin user={user} /> : <Navigate to="/plateforme" replace />}</TrainingGate>
}
