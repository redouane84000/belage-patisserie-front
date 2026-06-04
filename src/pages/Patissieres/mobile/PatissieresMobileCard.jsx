import { formatPricePerSlice, getPricePerSlice } from '../../../utils/patissiere'
import { initiales } from './patissieresMobileIcons'

const AVATAR_GRADS = [
  'linear-gradient(135deg, #E2C97E, #C9A84C)',
  'linear-gradient(135deg, #D4B896, #A8864A)',
  'linear-gradient(135deg, #C9B8A8, #8B7355)',
  'linear-gradient(135deg, #DCC9A0, #B8956E)',
  'linear-gradient(135deg, #E8D4B8, #C9A84C)',
  'linear-gradient(135deg, #BFA88A, #7A6548)',
]

function IconStar() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 6 21.2l1.4-6.8L2.3 9.7l6.9-.7z" />
    </svg>
  )
}

export default function PatissieresMobileCard({
  profile: p,
  index = 0,
  highlight = false,
  onOpen,
  cardRef,
}) {
  const spec = p.specialites[0] || ''
  const grad = AVATAR_GRADS[index % AVATAR_GRADS.length]
  const price = formatPricePerSlice(getPricePerSlice(p))

  let badge = null
  if (p.badge) {
    badge = { label: 'Sélection', kind: 'selection' }
  } else if (p.offersInfluence) {
    badge = { label: 'Influence', kind: 'influence' }
  } else if (spec) {
    badge = { label: spec, kind: 'spec' }
  }

  return (
    <button
      ref={cardRef}
      type="button"
      className={`mob-ios-card ${highlight ? 'mob-ios-card--highlight' : ''}`}
      onClick={onOpen}
      aria-label={`Voir le profil de ${p.nom}`}
    >
      <div
        className={`mob-ios-card__avatar ${p.badge ? 'mob-ios-card__avatar--sel' : ''} ${p.image ? 'mob-ios-card__avatar--photo' : ''}`}
        style={p.image ? undefined : { background: grad }}
      >
        {p.image ? (
          <img src={p.image} alt="" loading="lazy" />
        ) : (
          initiales(p.nom)
        )}
      </div>

      <div className="mob-ios-card__body">
        <p className="mob-ios-card__name">{p.nom}</p>
        <p className="mob-ios-card__sub">
          {spec && `${spec} · `}
          {p.ville} · {price}
        </p>
      </div>

      {badge && (
        <span className={`mob-ios-card__badge mob-ios-card__badge--${badge.kind}`}>
          {badge.kind === 'selection' && <IconStar />}
          {badge.label}
        </span>
      )}
    </button>
  )
}
