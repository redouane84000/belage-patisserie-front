import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ShieldCheck, Users, UserPlus, X, KeyRound, Pencil, Trash2, UserRoundX } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TrainingGate from './TrainingGate'
import { trainingApi } from '../../features/training/api'
import './TrainingPlatform.css'

function Admin({ user }) {
  const [state, setState] = useState({ loading: true, users: [], error: '' })
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    trainingApi.adminUsers().then(({ users }) => setState({ loading: false, users, error: '' })).catch((error) => setState({ loading: false, users: [], error: error.message }))
  }, [])
  if (state.loading) return <main className="training-loading"><span /> Chargement de l’administration…</main>
  const unavailable = () => setNotice('Cette action sera disponible depuis ce dashboard après la connexion de la base de données. Pour le moment, elle doit être réalisée avec l’outil local.')
  return <div className="training-app"><Navbar /><main className="training-dashboard training-admin"><header className="training-dashboard__header"><div><p className="training-eyebrow">Administration</p><h1>Bonjour {user.firstName} <span>🛡️</span></h1><p>Suivi des accès à la plateforme de formation.</p></div><button className="training-primary" onClick={unavailable}><UserPlus size={16} /> Ajouter une cliente</button></header><section className="training-admin__summary"><article><Users size={20} /><strong>{state.users.length}</strong><span>clientes enregistrées</span></article><article><ShieldCheck size={20} /><strong>{state.users.filter((item) => item.isActive).length}</strong><span>comptes actifs</span></article></section>{notice && <p className="training-admin__notice">{notice}</p>}{state.error ? <p className="training-error">{state.error}</p> : <section className="training-admin__panel"><div><p className="training-eyebrow">Utilisatrices</p><h2>Accès aux formations</h2></div><div className="training-admin__table">{state.users.map((item) => <button key={item.id} className="training-admin__row" onClick={() => setSelected(item)}><div><strong>{item.firstName}</strong><span>@{item.username}</span></div><div>{item.purchasedCourses.length ? item.purchasedCourses.map((course) => <small key={course}>{course}</small>) : <span>Pas de formation</span>}</div><span className={item.isActive ? 'is-active' : 'is-disabled'}>{item.isActive ? 'Actif' : 'Désactivé'}</span></button>)}</div><p className="training-admin__note">Clique sur une cliente pour consulter sa fiche. Les mots de passe ne sont jamais affichés.</p></section>}<Link className="training-primary" to="/plateforme">Voir l’espace cliente</Link></main>{selected && <div className="training-admin__modal"><button className="training-admin__overlay" aria-label="Fermer" onClick={() => setSelected(null)} /><section className="training-admin__sheet"><button className="training-admin__close" onClick={() => setSelected(null)}><X size={18} /></button><p className="training-eyebrow">Fiche cliente</p><h2>{selected.firstName}</h2><p>@{selected.username}</p><dl><div><dt>E-mail</dt><dd>{selected.email || 'Non renseigné'}</dd></div><div><dt>Téléphone</dt><dd>{selected.phone || 'Non renseigné'}</dd></div><div><dt>Formations</dt><dd>{selected.purchasedCourses.length ? selected.purchasedCourses.join(', ') : 'Aucune'}</dd></div><div><dt>Statut</dt><dd>{selected.isActive ? 'Actif' : 'Désactivé'}</dd></div></dl><div className="training-admin__actions"><button onClick={unavailable}><Pencil size={15} /> Modifier</button><button onClick={unavailable}><KeyRound size={15} /> Réinitialiser le mot de passe</button><button onClick={unavailable}><UserRoundX size={15} /> {selected.isActive ? 'Désactiver' : 'Réactiver'}</button><button className="is-danger" onClick={unavailable}><Trash2 size={15} /> Supprimer</button></div></section></div>}<Footer /></div>
}

export default function TrainingAdmin() {
  return <TrainingGate>{(user) => user.isAdmin ? <Admin user={user} /> : <Navigate to="/plateforme" replace />}</TrainingGate>
}
