import { Link } from 'react-router-dom'
import { MapPin, Clock, Cake, Heart, Hash, Baby, ArrowRight } from 'lucide-react'
import { PARTNERS } from '../PartnerMarquee/PartnerMarquee'
import { PROVIDER_SECTIONS } from '../../data/providerSections'
import './Hero.css'

// Photo du gâteau BEL ÂGE servie depuis /public.
// Pointe directement vers le fichier déposé (double extension incluse).
const CAKE_IMG = '/miriam2.png.png'

const PACK_TYPES = [
  { icon: Cake, label: 'Anniversaire' },
  { icon: Heart, label: 'Mariage' },
  { icon: Hash, label: 'Number Cake' },
  { icon: Baby, label: 'Baby Shower' },
]

export default function Hero() {
  const totalProviders = PROVIDER_SECTIONS.reduce(
    (sum, section) => sum + section.providers.length,
    0
  )

  return (
    <section className="hero">
      <div className="hero__inner">
        {/* Colonne texte */}
        <div className="hero__content">
          <p className="hero__eyebrow anim" style={{ animationDelay: '0s' }}>
            Réseau de prestataires événement
          </p>

          <h1 className="hero__wordmark anim" style={{ animationDelay: '0.1s' }}>
            <img
              className="hero__wordmark-img"
              src="/police.png"
              alt="BEL ÂGE Entreprise"
            />
          </h1>

          <h2 className="hero__subtitle anim" style={{ animationDelay: '0.2s' }}>
            <span className="hero__line">
              <span className="hero__line-in">Trouvez le prestataire</span>
            </span>{' '}
            <span className="hero__line">
              <span className="hero__line-in">idéal pour votre</span>
            </span>{' '}
            <span className="hero__line">
              <span className="hero__line-in">projet sur-mesure.</span>
            </span>
          </h2>

          <div className="hero__divider anim" style={{ animationDelay: '0.25s' }} />

          <p className="hero__desc anim" style={{ animationDelay: '0.3s' }}>
            Comparez les prestataires près de chez vous, explorez les inspirations
            et demandez plusieurs devis en quelques clics.
          </p>

          <div className="hero__cta anim" style={{ animationDelay: '0.4s' }}>
            <Link to="/patissieres" className="btn btn--dark home-m-shine">
              Trouver mon prestataire <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/carte" className="btn btn--outline">
              Explorer la carte <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Colonne visuelle */}
        <div className="hero__visual anim" style={{ animationDelay: '0.3s' }}>
          <div className="hero__photo-wrap">
            <img
              className="hero__photo"
              src={CAKE_IMG}
              alt="Gâteau de luxe BEL ÂGE crème et or"
              loading="eager"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement.classList.add('hero__photo-wrap--empty')
              }}
              onLoad={(e) => {
                e.currentTarget.style.display = ''
                e.currentTarget.parentElement.classList.remove('hero__photo-wrap--empty')
              }}
            />

            {/* Repli élégant tant que /public/cake.png n'existe pas encore */}
            <div className="hero__photo-placeholder" aria-hidden="true">
              <Cake size={56} strokeWidth={1.2} />
              <span>Votre gâteau ici</span>
              <small>Déposez cake.png dans /public</small>
            </div>

            {/* CARD 1 — Réseau par métier */}
            <div className="float-card float-card--region">
              <div className="float-card__row">
                <MapPin size={16} className="float-card__pin" strokeWidth={2} />
                <span className="float-card__title">Réseau France</span>
              </div>
              <ul className="network-stats">
                {PROVIDER_SECTIONS.map((section) => (
                  <li key={section.id} className="network-stats__row">
                    <span className="network-stats__label">{section.shortLabel}</span>
                    <span className="network-stats__count">{section.providers.length}</span>
                  </li>
                ))}
              </ul>
              <p className="network-stats__total">
                {totalProviders} prestataire{totalProviders > 1 ? 's' : ''} au total
              </p>
            </div>

            {/* CARD 3 — Types de packs */}
            <div className="float-card float-card--packs">
              <ul className="packs-list">
                {PACK_TYPES.slice(0, 3).map(({ icon: Icon, label }) => (
                  <li key={label} className="packs-list__item">
                    <Icon size={14} strokeWidth={1.8} />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CARD 2 — Demande de devis */}
            <div className="float-card float-card--devis">
              <p className="float-card__eyebrow">Devis</p>
              <p className="devis__highlight">
                <span data-count="5" className="home-count">5</span> devis
              </p>
              <div className="devis__response">
                <Clock size={13} className="devis__clock" strokeWidth={2} />
                <span className="devis__response-value">
                  <span data-count="24" className="home-count">24</span>h
                </span>
              </div>
            </div>
          </div>

          <div className="hero__partners-strip" aria-label="Références partenaires">
            <div className="hero__partners-viewport">
              <div className="hero__partners-track">
                {[...PARTNERS, ...PARTNERS].map((brand, i) => (
                  <span key={`${brand.name}-strip-${i}`} className="hero__partners-brand">
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="hero__scroll-cue" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
