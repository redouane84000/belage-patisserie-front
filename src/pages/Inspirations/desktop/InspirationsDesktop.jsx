import { useEffect, useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
import { useScrollReveal } from '../../../hooks/useScrollReveal'
import InspirationImage from '../../../components/InspirationImage/InspirationImage'
import INSPIRATION_ITEMS, { INSPIRATION_SPOTLIGHT } from '../../../data/inspirations'
import './InspirationsDesktop.css'

const CATEGORIES = [
  { id: 'Tous', label: 'Tous' },
  { id: 'Wedding Cake', label: 'Wedding Cake' },
  { id: 'Italian Cake', label: 'Italian Cake' },
]

const ITEMS = INSPIRATION_ITEMS

const MARQUEE = [
  ...ITEMS.filter((i) => i.filter === 'Wedding Cake').slice(0, 4),
  ...ITEMS.filter((i) => i.filter === 'Italian Cake').slice(0, 4),
]

const TIPS = [
  {
    title: 'Enregistrez vos coups de cœur',
    text: 'Repérez les textures, palettes et formes qui vous parlent avant de contacter une pâtissière.',
  },
  {
    title: 'Affinez avec les filtres',
    text: 'Wedding cake, Italian cake, sweet table… chaque univers a son style de référence.',
  },
  {
    title: 'Passez à l’action',
    text: 'Trouvez une créatrice sur la carte ou demandez plusieurs devis en un clic.',
  },
]

export default function InspirationsDesktop() {
  const [activeCat, setActiveCat] = useState('Tous')
  const [scrollPct, setScrollPct] = useState(0)
  const galleryRef = useRef(null)
  useScrollReveal('insp-reveal')

  const filtered = useMemo(() => {
    if (activeCat === 'Tous') return ITEMS
    return ITEMS.filter((item) => item.filter === activeCat)
  }, [activeCat])

  const gridItems = filtered

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setScrollPct(max > 0 ? (doc.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 60)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const nodes = galleryRef.current?.querySelectorAll('.insp-card')
    nodes?.forEach((el) => {
      observer.observe(el)
    })

    const fallback = window.setTimeout(() => {
      nodes?.forEach((el) => el.classList.add('is-visible'))
    }, 400)

    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [filtered, gridItems.length])

  return (
    <div className="inspirations-page">
      <div
        className="insp-progress"
        style={{ width: `${scrollPct}%` }}
        aria-hidden="true"
      />

      <Navbar />

      <header className="insp-header">
        <p className="insp-header__eyebrow">Galerie créative</p>
        <h1 className="insp-header__title">Inspirations</h1>
        <p className="insp-header__subtitle">
          {ITEMS.length} créations premium pour imaginer votre prochain gâteau sur-mesure
        </p>
        <div className="insp-header__line" />
        <p className="insp-header__desc">
          Une banque d&apos;images premium centrée sur les gâteaux de mariage et
          les Italian cakes : pièces à étages, finitions dorées, esthétique
          méditerranéenne et inspirations nuptiales. Filtrez par univers, puis
          trouvez le prestataire idéal.
        </p>
      </header>

      <div className="insp-marquee" aria-hidden="true">
        <div className="insp-marquee__track">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <div key={`${item.id}-${i}`} className="insp-marquee__slide">
              <InspirationImage src={item.image} alt={item.alt || item.title} />
            </div>
          ))}
        </div>
      </div>

      <section className="insp-toolbar insp-reveal reveal">
        <div className="insp-toolbar__top">
          <p className="insp-toolbar__label">Filtrer par univers</p>
          <span className="insp-toolbar__count">
            {filtered.length} création{filtered.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="insp-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-cat={cat.id}
              className={`insp-pill ${activeCat === cat.id ? 'is-active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="insp-spotlight insp-reveal reveal">
        <div className="insp-spotlight__frame">
          <div className="insp-spotlight__media">
            <InspirationImage
              src={INSPIRATION_SPOTLIGHT.image}
              alt={INSPIRATION_SPOTLIGHT.alt}
              className="insp-spotlight__img"
              loading="eager"
              fetchPriority="high"
            />
            <div className="insp-spotlight__overlay">
              <p className="insp-spotlight__tag">{INSPIRATION_SPOTLIGHT.tag}</p>
              <h2 className="insp-spotlight__title">{INSPIRATION_SPOTLIGHT.title}</h2>
              <p className="insp-spotlight__text">{INSPIRATION_SPOTLIGHT.text}</p>
              <div className="insp-spotlight__actions">
                <a href="#insp-gallery" className="insp-btn insp-btn--gold">
                  {INSPIRATION_SPOTLIGHT.cta}{' '}
                  <ArrowRight size={14} strokeWidth={2} />
                </a>
                <Link to="/patissieres" className="insp-btn insp-btn--outline-light">
                  Trouver un prestataire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="insp-gallery-wrap"
        id="insp-gallery"
        aria-label="Galerie"
      >
        <h2 className="insp-gallery-title insp-reveal reveal">La galerie</h2>
        <div className="insp-header__line insp-reveal reveal" />
        <div className="insp-gallery" ref={galleryRef}>
          {gridItems.map((item) => (
            <article
              key={item.id}
              className={`insp-card insp-card--${item.size}`}
            >
              <InspirationImage
                src={item.image}
                alt={item.alt || item.title}
                loading="lazy"
                className={item.fit === 'contain' ? 'insp-img--contain' : ''}
              />
              <div className="insp-card__shade" />
              <div className="insp-card__body">
                <span className="insp-card__cat">{item.category}</span>
                <h3>{item.title}</h3>
                <span className="insp-card__link">
                  Je veux ce style <ArrowRight size={12} strokeWidth={2} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="insp-scroll-section">
        <div className="insp-scroll-head insp-reveal reveal">
          <h2>Tendances en mouvement</h2>
          <p>Faites glisser pour parcourir les styles du moment</p>
        </div>
        <div className="insp-scroll-row">
          {ITEMS.map((item) => (
            <article key={`scroll-${item.id}`} className="insp-scroll-card">
              <InspirationImage
                src={item.image}
                alt={item.alt || item.title}
                loading="lazy"
                className={item.fit === 'contain' ? 'insp-img--contain' : ''}
              />
              <div className="insp-scroll-card__info">
                <span>{item.category}</span>
                <strong>{item.title}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="insp-tips">
        <h2 className="insp-tips__title insp-reveal reveal">Comment utiliser cette page</h2>
        <div className="insp-tips__grid">
          {TIPS.map((tip, i) => (
            <article
              key={tip.title}
              className="insp-tip insp-reveal reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Sparkles size={18} strokeWidth={1.6} />
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="insp-cta insp-reveal reveal">
        <h2>Vous avez trouvé votre inspiration ?</h2>
        <p>
          Décrivez votre projet : date, nombre de parts, style souhaité. Recevez des
          réponses de pâtissières du réseau Bel Âge.
        </p>
        <div className="insp-cta__actions">
          <Link to="/patissieres" className="insp-btn insp-btn--dark">
            Créer ma demande <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <Link to="/carte" className="insp-btn insp-btn--outline">
            Voir la carte France
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
