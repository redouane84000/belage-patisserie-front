import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, MapPin, ChevronDown } from 'lucide-react'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
import InspirationImage from '../../../components/InspirationImage/InspirationImage'
import INSPIRATION_ITEMS, { INSPIRATION_SPOTLIGHT } from '../../../data/inspirations'
import InspirationsMobileSheet from './InspirationsMobileSheet'
import './InspirationsMobile.css'

const CATEGORIES = [
  { id: 'Tous', label: 'Tous' },
  { id: 'Wedding Cake', label: 'Wedding' },
  { id: 'Italian Cake', label: 'Italian' },
]

const TIPS = [
  {
    title: 'Coups de cœur',
    text: 'Touchez une création pour l’ouvrir et la garder en référence.',
  },
  {
    title: 'Filtrez',
    text: 'Wedding cake ou Italian cake — chaque univers a son style.',
  },
  {
    title: 'Passez à l’action',
    text: 'Trouvez une créatrice sur la carte ou créez votre demande.',
  },
]

function cardVariant(index) {
  if (index % 5 === 0) return 'wide'
  if (index % 3 === 1) return 'tall'
  return 'normal'
}

export default function InspirationsMobile() {
  const [activeCat, setActiveCat] = useState('Tous')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    if (activeCat === 'Tous') return INSPIRATION_ITEMS
    return INSPIRATION_ITEMS.filter((item) => item.filter === activeCat)
  }, [activeCat])

  return (
    <div className="insp-m">
      <Navbar />

      <section className="insp-m-hero" aria-label="À la une">
        <InspirationImage
          src={INSPIRATION_SPOTLIGHT.image}
          alt={INSPIRATION_SPOTLIGHT.alt}
          loading="eager"
          fetchPriority="high"
        />
        <div className="insp-m-hero__shade" />
        <div className="insp-m-hero__content">
          <p className="insp-m-hero__tag">{INSPIRATION_SPOTLIGHT.tag}</p>
          <h1 className="insp-m-hero__title">Inspirations</h1>
          <p className="insp-m-hero__sub">
            {INSPIRATION_ITEMS.length} créations premium · wedding &amp; italian
          </p>
        </div>
        <div className="insp-m-hero__scroll" aria-hidden>
          <ChevronDown size={18} strokeWidth={2} />
        </div>
      </section>

      <div className="insp-m-shell">
        <div className="insp-m-sticky">
          <div className="insp-m-sticky__head">
            <p className="insp-m-sticky__label">Galerie</p>
            <span className="insp-m-sticky__count">
              {filtered.length} style{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="insp-m-seg" role="tablist" aria-label="Filtrer par univers">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCat === cat.id}
                className={`insp-m-seg__btn ${activeCat === cat.id ? 'is-active' : ''}`}
                data-cat={cat.id}
                onClick={() => setActiveCat(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="insp-m-grid" aria-label="Galerie inspirations">
          {filtered.map((item, index) => {
            const variant = cardVariant(index)
            return (
              <button
                key={item.id}
                type="button"
                className={`insp-m-card insp-m-card--${variant}`}
                onClick={() => setSelected(item)}
              >
                <InspirationImage
                  src={item.image}
                  alt={item.alt || item.title}
                  loading="lazy"
                  className={item.fit === 'contain' ? 'insp-m-img--contain' : ''}
                />
                <div className="insp-m-card__shade" />
                <div className="insp-m-card__info">
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                </div>
              </button>
            )
          })}
        </div>

        <section className="insp-m-tips" aria-label="Conseils">
          <div className="insp-m-tips__head">
            <Sparkles size={16} strokeWidth={1.8} />
            <h2>Comment utiliser</h2>
          </div>
          <div className="insp-m-tips__row">
            {TIPS.map((tip, i) => (
              <article key={tip.title} className="insp-m-tip">
                <span className="insp-m-tip__num">{i + 1}</span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="insp-m-banner">
          <p>Inspirée ? Décrivez votre projet et recevez des réponses du réseau.</p>
          <Link to="/patissieres" className="insp-m-banner__link">
            Créer ma demande <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </section>

        <div className="insp-m-dock-spacer" aria-hidden />
      </div>

      <Footer />

      <div className="insp-m-dock" role="navigation" aria-label="Actions rapides">
        <Link to="/patissieres" className="insp-m-dock__primary">
          Trouver un prestataire
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
        <Link to="/carte" className="insp-m-dock__map" aria-label="Carte France">
          <MapPin size={20} strokeWidth={2} />
        </Link>
      </div>

      {selected && (
        <InspirationsMobileSheet
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
