import { Link } from 'react-router-dom'

export default function PaymentResult({ cancelled = false }) {
  return (
    <main className="training-checkout">
      <p>{cancelled ? 'Paiement annulé' : 'Paiement confirmé'}</p>
      <h1>{cancelled ? 'Votre panier vous attend.' : 'Merci pour votre commande.'}</h1>
      <p className="training-stripe-note">
        {cancelled
          ? 'Aucun montant n’a été prélevé. Vous pouvez reprendre votre sélection quand vous le souhaitez.'
          : 'Votre paiement est en cours de vérification. Votre accès formation vous sera envoyé manuellement après confirmation.'}
      </p>
      <Link to="/packs" className="training-action">{cancelled ? 'Retour aux formations' : 'Voir les formations'}</Link>
    </main>
  )
}
