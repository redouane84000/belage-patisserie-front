import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function PaymentResult({ cancelled = false }) {
  const [searchParams] = useSearchParams()
  const [state, setState] = useState(cancelled ? 'cancelled' : 'loading')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (cancelled) return
    if (!sessionId) {
      setState('unknown')
      return
    }

    let active = true
    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((session) => {
        if (!active) return
        if (session.status === 'complete' && session.paymentStatus === 'paid') {
          localStorage.removeItem('belage-training-cart')
          setState('paid')
        } else {
          setState('pending')
        }
      })
      .catch(() => active && setState('unknown'))

    return () => { active = false }
  }, [cancelled, sessionId])

  const content = {
    loading: { icon: Clock3, eyebrow: 'Vérification sécurisée', title: 'Nous vérifions votre paiement.', text: 'Ne fermez pas cette page : Stripe confirme votre transaction.' },
    paid: { icon: CheckCircle2, eyebrow: 'Paiement réussi', title: 'Merci pour votre commande.', text: 'Votre paiement est confirmé. Nous vous enverrons vos accès formation après vérification administrative.' },
    pending: { icon: Clock3, eyebrow: 'Paiement en attente', title: 'Votre paiement est en cours de confirmation.', text: 'Aucun accès n’est créé tant que Stripe ne confirme pas le règlement. Nous vous contacterons dès validation.' },
    cancelled: { icon: XCircle, eyebrow: 'Paiement annulé', title: 'Votre panier vous attend.', text: 'Aucun montant n’a été prélevé. Vous pouvez reprendre votre sélection quand vous le souhaitez.' },
    unknown: { icon: Clock3, eyebrow: 'Vérification nécessaire', title: 'Nous n’avons pas pu confirmer le paiement.', text: 'Si Stripe vous a confirmé le règlement, conservez son e-mail : nous vérifierons la commande avant d’envoyer vos accès.' },
  }[state]
  const Icon = content.icon

  return (
    <main className="training-checkout">
      <p>{content.eyebrow}</p>
      <Icon size={34} aria-hidden="true" />
      <h1>{content.title}</h1>
      <p className="training-stripe-note">
        {content.text}
      </p>
      {state !== 'loading' && <Link to="/packs" className="training-action">{state === 'paid' ? 'Voir les formations' : 'Retour aux formations'}</Link>}
    </main>
  )
}
